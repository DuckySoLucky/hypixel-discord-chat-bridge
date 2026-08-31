import BlacklistUser from "../../data/blacklist/BlacklistUser.js";
import EmbedHelper from "../../discord/private/EmbedHelper.js";
import GetMinecraftData from "minecraft-data";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import MowojangAPI from "../../private/MowojangAPI.js";
import RequirementsCommand from "../../discord/commands/requirementsCommand.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";
import { delay, isUuid, replaceAllRanks } from "../../utils/miscUtils.js";
import { replaceVariables, truncateString } from "../../utils/stringUtils.js";
import { runDetached, safeListener, toError } from "../../utils/asyncUtils.js";
import type MinecraftManager from "../MinecraftManager.js";
import type { ChatMessage } from "prismarine-chat";
import type { Client } from "minecraft-protocol";
import type { HeadedEmbedEvent } from "../../types/bridge.js";

function parseChatComponent(value: string): object {
  const parsed: unknown = JSON.parse(value);
  if (typeof parsed !== "object" || parsed === null) throw new Error("Minecraft chat component is not an object.");
  return parsed;
}

class MessageHandler {
  private allowLimbo: boolean = true;
  private readonly minecraftData;
  constructor(private readonly minecraft: MinecraftManager) {
    this.minecraftData = GetMinecraftData(this.minecraft.application.config.minecraft.bot.version);
  }

  setAllowLimbo(state: boolean): this {
    this.allowLimbo = state;
    return this;
  }

  registerEvents(client: Client): void {
    client.on(
      "systemChat",
      safeListener(async (data: { formattedMessage: string }) => {
        const chatMessage = this.minecraft.prismarineChat.fromNotch(data.formattedMessage);
        await this.onMessage(chatMessage.toString(), chatMessage.toMotd());
      }, this.reportError)
    );
    client.on(
      "playerChat",
      safeListener((data: object) => this.onFormattedMessage(data), this.reportError)
    );
  }

  private async onFormattedMessage(data: object): Promise<void> {
    const message = (data as { formattedMessage?: string }).formattedMessage;
    let resultMessage: ChatMessage & Partial<{ unsigned: ChatMessage }>;

    if (this.minecraftData.supportFeature("clientsideChatFormatting")) {
      const verifiedPacket = data as { senderName?: unknown; targetName?: unknown; plainMessage?: unknown; unsignedContent?: unknown; type?: unknown };
      if (typeof verifiedPacket.plainMessage !== "string" || typeof verifiedPacket.type !== "number") {
        throw new Error("Received a malformed formatted Minecraft chat packet.");
      }
      const rawContent = message ?? verifiedPacket.unsignedContent;
      const parameters: { content: object; sender?: object; target?: object } = {
        content: typeof rawContent === "string" ? parseChatComponent(rawContent) : { text: verifiedPacket.plainMessage }
      };

      if (typeof verifiedPacket.senderName === "string") {
        parameters.sender = parseChatComponent(verifiedPacket.senderName);
      }
      if (typeof verifiedPacket.targetName === "string") {
        parameters.target = parseChatComponent(verifiedPacket.targetName);
      }
      resultMessage = this.minecraft.prismarineChat.fromNetwork(verifiedPacket.type, parameters);

      if (typeof verifiedPacket.unsignedContent === "string") {
        resultMessage.unsigned = this.minecraft.prismarineChat.fromNetwork(verifiedPacket.type, {
          ...parameters,
          content: parseChatComponent(verifiedPacket.unsignedContent)
        });
      }
    } else {
      if (typeof message !== "string") throw new Error("Received a Minecraft chat packet without formatted content.");
      resultMessage = this.minecraft.prismarineChat.fromNotch(message);
    }
    await this.onMessage(resultMessage.toString(), resultMessage.toMotd());
  }

  async onMessage(message: string, colouredMessage: string): Promise<void> {
    if (!this.minecraft.isBotOnline()) return;

    // NOTE: fixes "100/100     100/100 Mana" spam in the debug channel
    if (message.includes(" Mana") && message.includes("") && message.includes("/")) return;

    if (this.minecraft.application.config.bridge.channels.debug.enabled) {
      await this.minecraft.broadcastMessage({ fullMessage: colouredMessage, message, chatType: "Debug" });
    }

    if (this.isLobbyJoinMessage(message)) {
      if (this.allowLimbo) return this.minecraft.bot.chat("/limbo");
    }

    if (this.isRequestMessage(message)) {
      const username = replaceAllRanks((message.split("has")?.[0] ?? "").replaceAll("-----------------------------------------------------\n", "")).trim();
      const uuid = await MowojangAPI.getUUID(username);
      if (!uuid) return;
      if (!this.minecraft.application.discord.isClientOnline()) {
        throw new HypixelDiscordChatBridgeError("The discord bot doesn't seam to be online? Please restart the application");
      }

      let blacklistUser: BlacklistUser | undefined;
      if (this.minecraft.application.config.blacklist.enabled) blacklistUser = await this.minecraft.application.data.blacklist.getUserByUUID(uuid);

      const logChannel = await this.minecraft.application.discord.getChannel("Logger-Guild");
      if (!logChannel || !logChannel.isSendable()) return;
      const requestEmbed = new EmbedHelper().setColor("Green").setDescription(replaceVariables(this.minecraft.application.messages.requestMessage, { username }));
      const buttons: ButtonBuilder[] = [new ButtonBuilder().setCustomId("joinRequestAccept").setLabel("Accept Request").setStyle(ButtonStyle.Success)];
      if (this.minecraft.application.config.blacklist.notifications.onJoinRequest && blacklistUser) {
        requestEmbed.setTitle(":warning: User is blacklisted");
        buttons.push(new ButtonBuilder().setCustomId("joinRequestViewBlacklist").setLabel("View Blacklist").setStyle(ButtonStyle.Secondary));
      }
      const logMessage = await logChannel.send({ embeds: [requestEmbed], components: [new ActionRowBuilder<ButtonBuilder>().addComponents(buttons)] });

      setTimeout(
        () =>
          runDetached(
            (async () => {
              const component = logMessage.components[0];
              if (!component || component.type !== ComponentType.ActionRow) return;
              let found = false;
              const fixedButtons = component.components.flatMap((compontent) => {
                if (compontent.type !== ComponentType.Button) return [];
                if (!compontent.customId || !compontent.label) return [];
                if (compontent.customId === "joinRequestAccept") found = true;
                return [
                  new ButtonBuilder()
                    .setCustomId(compontent.customId)
                    .setLabel(compontent.label)
                    .setStyle(compontent.style)
                    .setDisabled(compontent.customId === "joinRequestAccept")
                ];
              });
              if (!found) return;
              await logMessage.edit({ components: [new ActionRowBuilder<ButtonBuilder>().addComponents(fixedButtons)] });
            })()
          ),
        5 * 60 * 1000
      );

      if (this.minecraft.application.config.minecraft.guild.requirements.enabled) {
        const requirementsCommand = new RequirementsCommand(this.minecraft.application.discord);
        const data = await requirementsCommand.checkRequirements(uuid);
        this.minecraft.bot.chat(`/oc ${data.username} ${data.passed ? "meets" : "Doesn't meet"} Requirements. More info in the guild logs channel`);
        await delay(1000);
        if (data.passed && this.minecraft.application.config.minecraft.guild.requirements.autoAccept) this.minecraft.bot.chat(`/guild accept ${username}`);
        const embed = requirementsCommand.generateEmbed(data);
        await logMessage.edit({ embeds: [...logMessage.embeds, embed] });
        const officerChannel = await this.minecraft.application.discord.getChannel("Officer");
        if (officerChannel?.isSendable()) await officerChannel.send({ embeds: [embed] });
      }

      if (this.minecraft.application.config.blacklist.enabled && this.minecraft.application.config.blacklist.notifications.onJoinRequest) {
        if (!blacklistUser) return;
        this.minecraft.bot.chat(`/oc [WARNING!] ${username} is blacklisted`);
        await delay(500);
        this.minecraft.bot.chat(`/oc Reason: ${truncateString(blacklistUser.reason, 128)}`);
      }
    }

    if (this.isLoginMessage(message)) {
      const username = ((message.split(">")?.[1] ?? "").trim().split("joined.")?.[0] ?? "").trim();
      return this.minecraft.broadcastPlayerToggle({
        fullMessage: colouredMessage,
        username: username,
        message: replaceVariables(this.minecraft.application.messages.loginMessage, { username }),
        color: "Green",
        chatType: "Guild"
      });
    }

    if (this.isLogoutMessage(message)) {
      const username = ((message.split(">")?.[1] ?? "").trim().split("left.")?.[0] ?? "").trim();
      return this.minecraft.broadcastPlayerToggle({
        fullMessage: colouredMessage,
        username: username,
        message: replaceVariables(this.minecraft.application.messages.logoutMessage, { username }),
        color: "Red",
        chatType: "Guild"
      });
    }

    if (this.isJoinMessage(message)) {
      const username = this.getUsernameFromEventMessage(message);
      setTimeout(() => runDetached(this.tryToUpdateUser(username)), 15000);

      await delay(1000);
      this.minecraft.bot.chat(
        `/gc ${replaceVariables(this.minecraft.application.messages.guildJoinMessage, {
          prefix: this.minecraft.application.config.minecraft.commands.normal.prefix
        })} | by @duckysolucky`
      );

      const broadcastMessage: Omit<HeadedEmbedEvent, "chatType"> = {
        message: replaceVariables(this.minecraft.application.messages.joinMessage, { username }),
        title: "Member Joined",
        icon: `https://mc-heads.net/avatar/${username}`,
        color: "Green"
      };

      await Promise.all([
        this.minecraft.broadcastHeadedEmbed({ ...broadcastMessage, chatType: "Logger-Guild" }),
        this.minecraft.broadcastHeadedEmbed({ ...broadcastMessage, chatType: "Guild" })
      ]);
      return;
    }

    if (this.isLeaveMessage(message)) {
      const username = this.getUsernameFromEventMessage(message);
      setTimeout(() => runDetached(this.tryToUpdateUser(username)), 15000);

      const broadcastMessage: Omit<HeadedEmbedEvent, "chatType"> = {
        message: replaceVariables(this.minecraft.application.messages.leaveMessage, { username }),
        title: "Member Left",
        icon: `https://mc-heads.net/avatar/${username}`,
        color: "Red"
      };

      await Promise.all([
        this.minecraft.broadcastHeadedEmbed({ ...broadcastMessage, chatType: "Logger-Guild" }),
        this.minecraft.broadcastHeadedEmbed({ ...broadcastMessage, chatType: "Guild" })
      ]);
      return;
    }

    if (this.isKickMessage(message)) {
      const username = this.getUsernameFromEventMessage(message);
      setTimeout(() => runDetached(this.tryToUpdateUser(username)), 15000);

      const broadcastMessage: Omit<HeadedEmbedEvent, "chatType"> = {
        message: replaceVariables(this.minecraft.application.messages.kickMessage, { username }),
        title: "Member Kicked",
        icon: `https://mc-heads.net/avatar/${username}`,
        color: "Red"
      };

      await Promise.all([
        this.minecraft.broadcastHeadedEmbed({ ...broadcastMessage, chatType: "Logger-Guild" }),
        this.minecraft.broadcastHeadedEmbed({ ...broadcastMessage, chatType: "Guild" })
      ]);
      return;
    }

    if (this.isPromotionMessage(message)) {
      const username = this.getUsernameFromEventMessage(message);
      const rank =
        message
          .replace(/\[(.*?)\]/g, "")
          .trim()
          .split(" to ")
          .pop()
          ?.trim() ?? "";

      setTimeout(() => runDetached(this.tryToUpdateUser(username)), 15000);

      const broadcastMessage: Omit<HeadedEmbedEvent, "chatType"> = {
        message: replaceVariables(this.minecraft.application.messages.promotionMessage, { username, rank }),
        title: "Member Promoted",
        icon: `https://mc-heads.net/avatar/${username}`,
        color: "Green"
      };

      await Promise.all([
        this.minecraft.broadcastHeadedEmbed({ ...broadcastMessage, chatType: "Guild" }),
        this.minecraft.broadcastHeadedEmbed({ ...broadcastMessage, chatType: "Logger-Guild" })
      ]);
      return;
    }

    if (this.isDemotionMessage(message)) {
      const username = this.getUsernameFromEventMessage(message);
      const rank =
        message
          .replace(/\[(.*?)\]/g, "")
          .trim()
          .split(" to ")
          .pop()
          ?.trim() ?? "";

      const broadcastMessage: Omit<HeadedEmbedEvent, "chatType"> = {
        message: replaceVariables(this.minecraft.application.messages.demotionMessage, { username, rank }),
        title: "Member Demoted",
        icon: `https://mc-heads.net/avatar/${username}`,
        color: "Red"
      };

      await Promise.all([
        this.minecraft.broadcastHeadedEmbed({ ...broadcastMessage, chatType: "Guild" }),
        this.minecraft.broadcastHeadedEmbed({ ...broadcastMessage, chatType: "Logger-Guild" })
      ]);
      return;
    }

    if (this.isCannotMuteMoreThanOneMonth(message)) {
      return this.minecraft.broadcastCleanEmbed({ message: this.minecraft.application.messages.cannotMuteMoreThanOneMonthMessage, color: "Red", chatType: "Guild" });
    }

    if (this.isBlockedMessage(message)) {
      const blockedMsg = (message.match(/".+"/g)?.[0] ?? "").slice(1, -1);
      return this.minecraft.broadcastCleanEmbed({
        message: replaceVariables(this.minecraft.application.messages.messageBlockedByHypixel, { message: blockedMsg }),
        color: "Red",
        chatType: "Guild"
      });
    }

    if (this.isRepeatMessage(message)) {
      return this.minecraft.broadcastCleanEmbed({ message: this.minecraft.application.messages.repeatMessage, color: "Red", chatType: "Guild" });
    }

    if (this.isNoPermission(message)) {
      return this.minecraft.broadcastCleanEmbed({ message: this.minecraft.application.messages.noPermissionMessage, color: "Red", chatType: "Guild" });
    }

    if (this.isMuted(message)) {
      const formattedMessage = message.split(" ").slice(1).join(" ");
      await this.minecraft.broadcastHeadedEmbed({
        message: formattedMessage.charAt(0).toUpperCase() + formattedMessage.slice(1),
        title: "Bot is currently muted for a Major Chat infraction.",
        color: "Red",
        chatType: "Guild"
      });
    }

    if (this.isIncorrectUsage(message)) {
      return this.minecraft.broadcastCleanEmbed({ message: message.split("'").join("`"), color: "Red", chatType: "Guild" });
    }

    if (this.isOnlineInvite(message)) {
      const username = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(/ +/g)[2];
      await Promise.all([
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(this.minecraft.application.messages.onlineInvite, { username }),
          color: "Green",
          chatType: "Guild"
        }),
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(this.minecraft.application.messages.onlineInvite, { username }),
          color: "Green",
          chatType: "Logger-Guild"
        })
      ]);
      return;
    }

    if (this.isOfflineInvite(message)) {
      const usernameToken = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(/ +/g)[6];
      const username = usernameToken?.match(/\w+/u)?.[0];
      if (!username) throw new Error(`Unable to parse the invited username from: ${message}`);
      await Promise.all([
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(this.minecraft.application.messages.offlineInvite, { username }),
          color: "Green",
          chatType: "Guild"
        }),
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(this.minecraft.application.messages.offlineInvite, { username }),
          color: "Green",
          chatType: "Logger-Guild"
        })
      ]);
      return;
    }

    if (this.isFailedInvite(message)) {
      await Promise.all([
        this.minecraft.broadcastCleanEmbed({ message: message.replace(/\[(.*?)\]/g, "").trim(), color: "Red", chatType: "Guild" }),
        this.minecraft.broadcastCleanEmbed({ message: message.replace(/\[(.*?)\]/g, "").trim(), color: "Red", chatType: "Logger-Guild" })
      ]);
      return;
    }

    if (this.isGuildMuteMessage(message)) {
      const time = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(/ +/g)[7];
      await Promise.all([
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(this.minecraft.application.messages.guildMuteMessage, { time }),
          color: "Red",
          chatType: "Guild"
        }),
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(this.minecraft.application.messages.guildMuteMessage, { time }),
          color: "Red",
          chatType: "Logger-Guild"
        })
      ]);
      return;
    }

    if (this.isGuildUnmuteMessage(message)) {
      await Promise.all([
        this.minecraft.broadcastCleanEmbed({ message: this.minecraft.application.messages.guildUnmuteMessage, color: "Green", chatType: "Guild" }),
        this.minecraft.broadcastCleanEmbed({ message: this.minecraft.application.messages.guildUnmuteMessage, color: "Green", chatType: "Logger-Guild" })
      ]);
      return;
    }

    if (this.isUserMuteMessage(message)) {
      const username =
        message
          .replace(/\[(.*?)\]/g, "")
          .trim()
          .split(/ +/g)[3]
          ?.replace(/[^\w]+/g, "") ?? "UNKNOWN";
      const time = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(/ +/g)[5];
      await Promise.all([
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(this.minecraft.application.messages.userMuteMessage, { username, time }),
          color: "Red",
          chatType: "Guild"
        }),
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(this.minecraft.application.messages.userMuteMessage, { username, time }),
          color: "Red",
          chatType: "Logger-Guild"
        })
      ]);
      return;
    }

    if (this.isUserUnmuteMessage(message)) {
      const username = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(/ +/g)[3];
      await Promise.all([
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(this.minecraft.application.messages.userUnmuteMessage, { username }),
          color: "Green",
          chatType: "Guild"
        }),
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(this.minecraft.application.messages.userUnmuteMessage, { username }),
          color: "Green",
          chatType: "Logger-Guild"
        })
      ]);
      return;
    }

    if (this.isSetrankFail(message)) {
      return this.minecraft.broadcastCleanEmbed({ message: this.minecraft.application.messages.setrankFailMessage, color: "Red", chatType: "Guild" });
    }

    if (this.isGuildQuestCompletion(message)) {
      await this.minecraft.broadcastHeadedEmbed({ title: "Guild Quest Completion", message: message, color: "Yellow", chatType: "Guild" });
    }

    if (this.isAlreadyMuted(message)) {
      return this.minecraft.broadcastCleanEmbed({ message: this.minecraft.application.messages.alreadyMutedMessage, color: "Red", chatType: "Guild" });
    }

    if (this.isNotInGuild(message)) {
      const username = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(" ")[0];
      return this.minecraft.broadcastCleanEmbed({
        message: replaceVariables(this.minecraft.application.messages.notInGuildMessage, { username }),
        color: "Red",
        chatType: "Guild"
      });
    }

    if (this.isLowestRank(message)) {
      const username = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(" ")[0];
      return this.minecraft.broadcastCleanEmbed({
        message: replaceVariables(this.minecraft.application.messages.lowestRankMessage, { username }),
        color: "Red",
        chatType: "Guild"
      });
    }

    if (this.isAlreadyHasRank(message)) {
      return this.minecraft.broadcastCleanEmbed({ message: this.minecraft.application.messages.alreadyHasRankMessage, color: "Red", chatType: "Guild" });
    }

    if (this.isTooFast(message)) {
      return console.warn(message);
    }

    if (this.isPlayerNotFound(message)) {
      const username = (message.split(" ")?.[8] ?? "").slice(1, -1);
      return this.minecraft.broadcastCleanEmbed({
        message: replaceVariables(this.minecraft.application.messages.playerNotFoundMessage, { username }),
        color: "Red",
        chatType: "Guild"
      });
    }

    if (this.isGuildLevelUpMessage(message)) {
      const level = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(/ +/g)[5];
      return this.minecraft.broadcastCleanEmbed({
        message: replaceVariables(this.minecraft.application.messages.guildLevelUpMessage, { level }),
        color: "Yellow",
        chatType: "Guild"
      });
    }

    const regex =
      this.minecraft.application.config.bridge.discord.mode === "minecraft"
        ? /^(?<chatType>§[0-9a-fA-F](Guild|Officer)) > (?<rank>§[0-9a-fA-F](?:\[.*?\])?)?\s*(?<username>[^§\s]+)\s*(?:(?<guildRank>§[0-9a-fA-F](?:\[.*?\])?))?\s*§f: (?<message>.*)/
        : /^(?<chatType>\w+) > (?:(?:\[(?<rank>[^\]]+)\] )?(?:(?<username>\w+)(?: \[(?<guildRank>[^\]]+)\])?: )?)?(?<message>.+)$/;

    const match = (this.minecraft.application.config.bridge.discord.mode === "minecraft" ? colouredMessage : message).match(regex);
    if (!match || !match?.groups || !match.groups.message || !match.groups.chatType || !match.groups.username) return;

    if (this.isDiscordMessage(match.groups.message) === false) {
      const { chatType, rank = "", username, guildRank = "[Member]", message } = match.groups;
      if (message.includes("replying to") && username === this.minecraft.bot.username) {
        return;
      }

      await this.minecraft.broadcastMessage({
        fullMessage: colouredMessage,
        chatType: chatType.includes("Officer") ? "Officer" : "Guild",
        username,
        rank: rank ?? null,
        guildRank,
        message,
        color: this.minecraftChatColorToHex(this.getRankColor(colouredMessage))
      });
    }

    if (this.isCommand(match.groups.message)) {
      const officer = match.groups.chatType.includes("Officer");
      if (this.isDiscordMessage(match.groups.message) === true) {
        const { player, command } = this.getCommandData(match.groups.message);
        if (!player || !command) return;
        return this.minecraft.commandHandler.handle(player, command, officer);
      }

      return this.minecraft.commandHandler.handle(match.groups.username, match.groups.message, officer);
    }
  }

  private readonly reportError = (error: unknown): void => console.error(toError(error));

  isDiscordMessage(message: string): boolean {
    const isDiscordMessage = /^(?<username>(?!https?:\/\/).+?)\s*[»:>]\s*(?<message>.*)$/;
    const match = message.match(isDiscordMessage);
    if (!match?.groups) return false;
    if (match && ["Party", "Guild", "Officer"].includes(match.groups.username || "UNKNOWN")) {
      return false;
    }
    return isDiscordMessage.test(message);
  }

  private isCommand(message: string): boolean {
    const regex = new RegExp(
      `^(?<prefix>[${this.minecraft.application.config.minecraft.commands.normal.prefix}${this.minecraft.application.config.minecraft.commands.soopy.prefix}])(?<command>\\S+)(?:\\s+(?<args>.+))?\\s*$`
    );

    if (regex.test(message) === false) {
      const getMessage = /^(?<username>(?!https?:\/\/)[^\s»:>]+)\s*[»:>]\s*(?<message>.*)/;
      const match = message.match(getMessage);
      if (match === null || match.groups === undefined || match.groups.message === undefined) return false;
      return regex.test(match.groups.message);
    }
    return regex.test(message);
  }

  private getCommandData(message: string): { [key: string]: string } {
    const regex = /^(?<player>[^\s»:>\s]+(?:\s+[^\s»:>\s]+)*)\s*[»:>\s]\s*(?<command>.*)/;
    const match = message.match(regex);
    if (match === null) return {};
    return match.groups ?? {};
  }

  getRankColor(message: string): string {
    const regex = /§\w*\[(\w*[a-zA-Z0-9]+§?\w*(?:\+{0,2})?§?\w*)\] /g;

    const match = message.match(regex);
    if (match) {
      const color = match[0]
        .match(/§(\w)/g)
        ?.filter((value, index, self) => self.indexOf(value) === index)
        .at(-1);

      return (color ?? "").slice(1);
    }

    return "7";
  }

  getUsernameFromEventMessage(message: string): string {
    const regex = /(?:\[(?<rank>[^\]]+)\] )?(?<username>[^\s]+) (?<event>.+)/;
    const match = message.match(regex);
    if (match === null || !match.groups) return "";
    return match.groups.username || "UNKNOWN";
  }

  isGuildMessage(message: string): boolean {
    return message.startsWith("Guild >") && message.includes(":");
  }

  isOfficerMessage(message: string): boolean {
    return message.startsWith("Officer >") && message.includes(":");
  }

  isGuildQuestCompletion(message: string): boolean {
    return message.includes("GUILD QUEST TIER ") && message.includes("COMPLETED") && !message.includes(":");
  }

  isLoginMessage(message: string): boolean {
    return message.startsWith("Guild >") && message.endsWith("joined.") && !message.includes(":");
  }

  isLogoutMessage(message: string): boolean {
    return message.startsWith("Guild >") && message.endsWith("left.") && !message.includes(":");
  }

  isJoinMessage(message: string): boolean {
    return message.includes("joined the guild!") && !message.includes(":");
  }

  isLeaveMessage(message: string): boolean {
    return message.includes("left the guild!") && !message.includes(":");
  }

  isKickMessage(message: string): boolean {
    return message.includes("was kicked from the guild by") && !message.includes(":");
  }

  isPromotionMessage(message: string): boolean {
    return message.includes("was promoted from") && !message.includes(":");
  }

  isDemotionMessage(message: string): boolean {
    return message.includes("was demoted from") && !message.includes(":");
  }

  isRequestMessage(message: string): boolean {
    return message.includes("has requested to join the Guild!");
  }

  isBlockedMessage(message: string): boolean {
    return message.includes("We blocked your comment") && !message.includes(":");
  }

  isRepeatMessage(message: string): boolean {
    return message === "You cannot say the same message twice!";
  }

  isNoPermission(message: string): boolean {
    return (
      (message.includes("You must be the Guild Master to use that command!") ||
        message.includes("You do not have permission to use this command!") ||
        message.includes(
          "I'm sorry, but you do not have permission to perform this command. Please contact the server administrators if you believe that this is in error."
        ) ||
        message.includes("You cannot mute a guild member with a higher guild rank!") ||
        message.includes("You cannot kick this player!") ||
        message.includes("You can only promote up to your own rank!") ||
        message.includes("You cannot mute yourself from the guild!") ||
        message.includes("is the guild master so can't be demoted!") ||
        message.includes("is the guild master so can't be promoted anymore!") ||
        message.includes("You do not have permission to kick people from the guild!")) &&
      !message.includes(":")
    );
  }

  isIncorrectUsage(message: string): boolean {
    return message.includes("Invalid usage!") && !message.includes(":");
  }

  isOnlineInvite(message: string): boolean {
    return message.includes("You invited") && message.includes("to your guild. They have 5 minutes to accept.") && !message.includes(":");
  }

  isOfflineInvite(message: string): boolean {
    return message.includes("You sent an offline invite to") && message.includes("They will have 5 minutes to accept once they come online!") && !message.includes(":");
  }

  isFailedInvite(message: string): boolean {
    return (
      (message.includes("is already in another guild!") ||
        message.includes("You cannot invite this player to your guild!") ||
        (message.includes("You've already invited") && message.includes("to your guild! Wait for them to accept!")) ||
        message.includes("is already in your guild!")) &&
      !message.includes(":")
    );
  }

  isUserMuteMessage(message: string): boolean {
    return message.includes("has muted") && message.includes("for") && !message.includes(":");
  }

  isUserUnmuteMessage(message: string): boolean {
    return message.includes("has unmuted") && !message.includes(":");
  }

  isCannotMuteMoreThanOneMonth(message: string): boolean {
    return message.includes("You cannot mute someone for more than one month") && !message.includes(":");
  }

  isGuildMuteMessage(message: string): boolean {
    return message.includes("has muted the guild chat for") && !message.includes(":");
  }

  isGuildUnmuteMessage(message: string): boolean {
    return message.includes("has unmuted the guild chat!") && !message.includes(":");
  }

  isSetrankFail(message: string): boolean {
    return message.includes("I couldn't find a rank by the name of ") && !message.includes(":");
  }

  isAlreadyMuted(message: string): boolean {
    return message.includes("This player is already muted!") && !message.includes(":");
  }

  isNotInGuild(message: string): boolean {
    return message.includes(" is not in your guild!") && !message.includes(":");
  }

  isLowestRank(message: string): boolean {
    return message.includes("is already the lowest rank you've created!") && !message.includes(":");
  }

  isAlreadyHasRank(message: string): boolean {
    return message.includes("They already have that rank!") && !message.includes(":");
  }

  isLobbyJoinMessage(message: string): boolean {
    return (message.endsWith(" the lobby!") || message.endsWith(" the lobby! <<<")) && message.includes("[MVP+");
  }

  isTooFast(message: string): boolean {
    return message.includes("You are sending commands too fast! Please slow down.") && !message.includes(":");
  }

  isMuted(message: string): boolean {
    return message.includes("Your mute will expire in") && !message.includes(":");
  }

  isPlayerNotFound(message: string): boolean {
    return message.startsWith("Can't find a player by the name of");
  }

  isGuildLevelUpMessage(message: string): boolean {
    return message.includes("The Guild has reached Level") && !message.includes("!");
  }

  minecraftChatColorToHex(color: string) {
    switch (color) {
      case "0":
        return "#000000";
      case "1":
        return "#0000AA";
      case "2":
        return "#00AA00";
      case "3":
        return "#00AAAA";
      case "4":
        return "#AA0000";
      case "5":
        return "#AA00AA";
      case "6":
        return "#FFAA00";
      case "7":
        return "#AAAAAA";
      case "8":
        return "#555555";
      case "9":
        return "#5555FF";
      case "a":
        return "#55FF55";
      case "b":
        return "#55FFFF";
      case "c":
        return "#FF5555";
      case "d":
        return "#FF55FF";
      case "e":
        return "#FFFF55";
      case "f":
        return "#FFFFFF";
      default:
        return "#FFFFFF";
    }
  }

  private async tryToUpdateUser(input: string) {
    try {
      let uuid: string | null = input;
      if (this.minecraft.application.config.verification.enabled === false) return;
      if (isUuid(uuid) === false) uuid = await MowojangAPI.getUUID(uuid);
      if (!uuid) return;
      const linkedUser = await this.minecraft.application.data.linked.getUserByUUID(uuid);
      if (!linkedUser) return;
      await linkedUser.updateRoles();
    } catch {
      //
    }
  }
}

export default MessageHandler;
