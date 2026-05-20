import HypixelDiscordChatBridgeError from "../../Private/Error.js";
import MowojangAPI from "../../Private/MowojangAPI.js";
import RequirementsCommand from "../../Discord/Commands/RequirementsCommand.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Delay, ReplaceAllRanks, isUuid } from "../../Utils/MiscUtils.js";
import { HexToDecimal } from "../../Utils/ColorUtils.js";
import { ReplaceVariables } from "../../Utils/StringUtils.js";
import type MinecraftManager from "../MinecraftManager.js";
import type { BroadcastEvent } from "../../Types/Bridge.js";
import type { ChannelNames } from "../../Types/Discord.js";
import type { ChatMessage } from "prismarine-chat";

class MessageHandler {
  private readonly minecraft: MinecraftManager;
  constructor(minecraftManager: MinecraftManager) {
    this.minecraft = minecraftManager;
  }

  registerEvents() {
    if (!this.minecraft.isBotOnline()) return;
    this.minecraft.bot.on("message", (message) => this.onMessage(message));
  }

  async onMessage(rawMessage: ChatMessage): Promise<any> {
    if (!this.minecraft.isBotOnline()) return;
    const message = rawMessage.toString();
    const colouredMessage = rawMessage.toMotd();

    // NOTE: fixes "100/100❤     100/100✎ Mana" spam in the debug channel
    if (message.includes("✎ Mana") && message.includes("❤") && message.includes("/")) return;

    if (this.minecraft.app.config.discord.channels.debugMode === true) {
      this.minecraft.broadcastMessage({ fullMessage: colouredMessage, message: message, chat: "debugChannel" });
    }

    if (this.isLobbyJoinMessage(message) && this.minecraft.app.config.discord.other.autoLimbo === true) {
      return this.minecraft.bot.chat("/limbo");
    }

    if (this.isPartyMessage(message) && this.minecraft.app.config.minecraft.fragBot.enabled === true) {
      const content = message.substring(54).trim();
      const parts = content.split(/\s+/);
      const username: string = content.startsWith("[") ? (parts[1] ?? "").trim() : (parts[0] ?? "").trim();

      const { blacklist, blacklisted, whitelist, whitelisted } = this.minecraft.app.config.minecraft.fragBot;
      if (blacklist || whitelist) {
        const uuid = await MowojangAPI.getUUID(username);
        if (uuid === null) return;

        if (this.minecraft.app.config.minecraft.fragBot.blacklist === true) {
          if (blacklisted.includes(username) || blacklisted.includes(uuid)) {
            return;
          }
        }

        const guild = await this.minecraft.app.getBotGuild();
        const members = guild.members.map((member) => member.uuid);
        if ((this.minecraft.app.config.minecraft.fragBot.whitelist && whitelisted.includes(username)) || members.includes(uuid)) {
          this.minecraft.bot.chat(`/party accept ${username}`);
          await Delay(Math.floor(Math.random() * (6900 - 4200 + 1)) + 4200);
          this.minecraft.bot.chat("/party leave");
        }
      } else {
        this.minecraft.bot.chat(`/party accept ${username}`);
        await Delay(Math.floor(Math.random() * (6900 - 4200 + 1)) + 4200);
        this.minecraft.bot.chat("/party leave");
      }
    }

    if (this.isRequestMessage(message)) {
      const username = ReplaceAllRanks((message.split("has")?.[0] ?? "").replaceAll("-----------------------------------------------------\n", "")).trim();
      if (!this.minecraft.app.discord.isClientOnline()) {
        throw new HypixelDiscordChatBridgeError("The discord bot doesn't seam to be online? Please restart the application");
      }
      const logChannel = await this.minecraft.app.discord.client.channels.fetch(`${this.minecraft.app.config.discord.channels.loggingChannel}`);
      if (!logChannel || !logChannel.isSendable()) return;
      const logMessage = await logChannel.send({
        embeds: [{ color: 2067276, description: ReplaceVariables(this.minecraft.app.messages.requestMessage, { username }) }],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setCustomId("joinRequestAccept").setLabel("Accept Request").setStyle(ButtonStyle.Success)
          )
        ]
      });

      if (this.minecraft.app.config.minecraft.guildRequirements.enabled) {
        const uuid = await MowojangAPI.getUUID(username);
        if (!uuid) return;
        const requirementsCommand = new RequirementsCommand(this.minecraft.app.discord);
        const data = await requirementsCommand.checkRequirements(uuid);
        this.minecraft.bot.chat(`/oc ${data.username} ${data.passed ? "meets" : "Doesn't meet"} Requirements. More info in the guild logs channel`);
        await Delay(1000);
        if (data.passed && this.minecraft.app.config.minecraft.guildRequirements.autoAccept) this.minecraft.bot.chat(`/guild accept ${username}`);
        const embed = requirementsCommand.generateEmbed(data);
        await logMessage.edit({ embeds: [...logMessage.embeds, embed] });
        this.minecraft.app.discord.client.channels.fetch(this.minecraft.app.config.discord.channels.officerChannel).then((channel) => {
          if (!channel || !channel.isSendable()) return;
          channel.send({ embeds: [embed] });
        });
      }
    }

    if (this.isLoginMessage(message)) {
      if (this.minecraft.app.config.discord.other.joinMessage === true) {
        const username = ((message.split(">")?.[1] ?? "").trim().split("joined.")?.[0] ?? "").trim();
        return this.minecraft.broadcastPlayerToggle({
          fullMessage: colouredMessage,
          username: username,
          message: ReplaceVariables(this.minecraft.app.messages.loginMessage, { username }),
          color: 2067276,
          chatType: "Guild"
        });
      }
    }

    if (this.isLogoutMessage(message)) {
      if (this.minecraft.app.config.discord.other.joinMessage === true) {
        const username = ((message.split(">")?.[1] ?? "").trim().split("left.")?.[0] ?? "").trim();
        return this.minecraft.broadcastPlayerToggle({
          fullMessage: colouredMessage,
          username: username,
          message: ReplaceVariables(this.minecraft.app.messages.logoutMessage, { username }),
          color: 15548997,
          chatType: "Guild"
        });
      }
    }

    if (this.isJoinMessage(message)) {
      const username = this.getUsernameFromEventMessage(message);
      setTimeout(() => this.tryToUpdateUser(username), 15000);

      await Delay(1000);
      this.minecraft.bot.chat(
        `/gc ${ReplaceVariables(this.minecraft.app.messages.guildJoinMessage, { prefix: this.minecraft.app.config.minecraft.bot.prefix })} | by @duckysolucky`
      );

      const broadcastMessage: BroadcastEvent = {
        message: ReplaceVariables(this.minecraft.app.messages.joinMessage, { username }),
        title: "Member Joined",
        icon: `https://mc-heads.net/avatar/${username}`,
        color: 2067276
      };

      return [
        this.minecraft.broadcastHeadedEmbed({ ...broadcastMessage, chatType: "Logger" }),
        this.minecraft.broadcastHeadedEmbed({ ...broadcastMessage, chatType: "Guild" })
      ];
    }

    if (this.isLeaveMessage(message)) {
      const username = this.getUsernameFromEventMessage(message);
      setTimeout(() => this.tryToUpdateUser(username), 15000);

      const broadcastMessage = {
        message: ReplaceVariables(this.minecraft.app.messages.leaveMessage, { username }),
        title: "Member Left",
        icon: `https://mc-heads.net/avatar/${username}`,
        color: 15548997
      };

      return [
        this.minecraft.broadcastHeadedEmbed({ ...broadcastMessage, chatType: "Logger" }),
        this.minecraft.broadcastHeadedEmbed({ ...broadcastMessage, chatType: "Guild" })
      ];
    }

    if (this.isKickMessage(message)) {
      const username = this.getUsernameFromEventMessage(message);
      setTimeout(() => this.tryToUpdateUser(username), 15000);

      const broadcastMessage = {
        message: ReplaceVariables(this.minecraft.app.messages.kickMessage, { username }),
        title: "Member Kicked",
        icon: `https://mc-heads.net/avatar/${username}`,
        color: 15548997
      };

      return [
        this.minecraft.broadcastHeadedEmbed({ ...broadcastMessage, chatType: "Logger" }),
        this.minecraft.broadcastHeadedEmbed({ ...broadcastMessage, chatType: "Guild" })
      ];
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

      setTimeout(() => this.tryToUpdateUser(username), 15000);

      const broadcastMessage = {
        message: ReplaceVariables(this.minecraft.app.messages.promotionMessage, { username, rank }),
        title: "Member Promoted",
        icon: `https://mc-heads.net/avatar/${username}`,
        color: 2067276
      };

      return [
        this.minecraft.broadcastCleanEmbed({ ...broadcastMessage, chatType: "Guild" }),
        this.minecraft.broadcastCleanEmbed({ ...broadcastMessage, chatType: "Logger" })
      ];
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

      const broadcastMessage = {
        message: ReplaceVariables(this.minecraft.app.messages.demotionMessage, { username, rank }),
        title: "Member Demoted",
        icon: `https://mc-heads.net/avatar/${username}`,
        color: 15548997
      };

      return [
        this.minecraft.broadcastCleanEmbed({ ...broadcastMessage, chatType: "Guild" }),
        this.minecraft.broadcastCleanEmbed({ ...broadcastMessage, chatType: "Logger" })
      ];
    }

    if (this.isCannotMuteMoreThanOneMonth(message)) {
      return this.minecraft.broadcastCleanEmbed({ message: this.minecraft.app.messages.cannotMuteMoreThanOneMonthMessage, color: 15548997, chatType: "Guild" });
    }

    if (this.isBlockedMessage(message)) {
      const blockedMsg = (message.match(/".+"/g)?.[0] ?? "").slice(1, -1);
      return this.minecraft.broadcastCleanEmbed({
        message: ReplaceVariables(this.minecraft.app.messages.messageBlockedByHypixel, { message: blockedMsg }),
        color: 15548997,
        chatType: "Guild"
      });
    }

    if (this.isRepeatMessage(message)) {
      if (!this.minecraft.app.discord.isClientOnline()) return;
      const channel = await this.minecraft.app.discord.client.channels.fetch(this.minecraft.app.config.discord.channels.guildChatChannel);
      if (!channel || !channel.isSendable()) return;
      return channel.send({ embeds: [{ color: 15548997, description: this.minecraft.app.messages.repeatMessage }] });
    }

    if (this.isNoPermission(message)) {
      return this.minecraft.broadcastCleanEmbed({ message: this.minecraft.app.messages.noPermissionMessage, color: 15548997, chatType: "Guild" });
    }

    if (this.isMuted(message)) {
      const formattedMessage = message.split(" ").slice(1).join(" ");
      this.minecraft.broadcastHeadedEmbed({
        message: formattedMessage.charAt(0).toUpperCase() + formattedMessage.slice(1),

        title: "Bot is currently muted for a Major Chat infraction.",
        color: 15548997,
        chatType: "Guild"
      });
    }

    if (this.isIncorrectUsage(message)) {
      return this.minecraft.broadcastCleanEmbed({ message: message.split("'").join("`"), color: 15548997, chatType: "Guild" });
    }

    if (this.isAlreadyBlacklistedMessage(message)) {
      return this.minecraft.broadcastHeadedEmbed({
        message: this.minecraft.app.messages.alreadyBlacklistedMessage,
        title: "Blacklist",
        color: 2067276,
        chatType: "Guild"
      });
    }

    if (this.isBlacklistMessage(message)) {
      const username = message.split(" ")[1];

      return [
        this.minecraft.broadcastHeadedEmbed({
          message: ReplaceVariables(this.minecraft.app.messages.blacklistMessage, { username }),
          title: "Blacklist",
          color: 2067276,
          chatType: "Guild"
        }),
        this.minecraft.broadcastHeadedEmbed({
          message: ReplaceVariables(this.minecraft.app.messages.blacklistMessage, { username }),
          title: "Blacklist",
          color: 2067276,
          chatType: "Logger"
        })
      ];
    }

    if (this.isBlacklistRemovedMessage(message)) {
      const username = message.split(" ")[1];
      return [
        this.minecraft.broadcastHeadedEmbed({
          message: ReplaceVariables(this.minecraft.app.messages.blacklistRemoveMessage, { username }),
          title: "Blacklist",
          color: 2067276,
          chatType: "Guild"
        }),
        this.minecraft.broadcastHeadedEmbed({
          message: ReplaceVariables(this.minecraft.app.messages.blacklistRemoveMessage, { username }),
          title: "Blacklist",
          color: 2067276,
          chatType: "Logger"
        })
      ];
    }

    if (this.isOnlineInvite(message)) {
      const username = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(/ +/g)[2];
      return [
        this.minecraft.broadcastCleanEmbed({ message: ReplaceVariables(this.minecraft.app.messages.onlineInvite, { username }), color: 2067276, chatType: "Guild" }),
        this.minecraft.broadcastCleanEmbed({ message: ReplaceVariables(this.minecraft.app.messages.onlineInvite, { username }), color: 2067276, chatType: "Logger" })
      ];
    }

    if (this.isOfflineInvite(message)) {
      const username = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(/ +/g)[6]!
        .match(/\w+/g)![0];
      return [
        this.minecraft.broadcastCleanEmbed({ message: ReplaceVariables(this.minecraft.app.messages.offlineInvite, { username }), color: 2067276, chatType: "Guild" }),
        this.minecraft.broadcastCleanEmbed({ message: ReplaceVariables(this.minecraft.app.messages.offlineInvite, { username }), color: 2067276, chatType: "Logger" })
      ];
    }

    if (this.isFailedInvite(message)) {
      return [
        this.minecraft.broadcastCleanEmbed({ message: message.replace(/\[(.*?)\]/g, "").trim(), color: 15548997, chatType: "Guild" }),
        this.minecraft.broadcastCleanEmbed({ message: message.replace(/\[(.*?)\]/g, "").trim(), color: 15548997, chatType: "Logger" })
      ];
    }

    if (this.isGuildMuteMessage(message)) {
      const time = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(/ +/g)[7];
      return [
        this.minecraft.broadcastCleanEmbed({ message: ReplaceVariables(this.minecraft.app.messages.guildMuteMessage, { time }), color: 15548997, chatType: "Guild" }),
        this.minecraft.broadcastCleanEmbed({ message: ReplaceVariables(this.minecraft.app.messages.guildMuteMessage, { time }), color: 15548997, chatType: "Logger" })
      ];
    }

    if (this.isGuildUnmuteMessage(message)) {
      return [
        this.minecraft.broadcastCleanEmbed({ message: this.minecraft.app.messages.guildUnmuteMessage, color: 2067276, chatType: "Guild" }),
        this.minecraft.broadcastCleanEmbed({ message: this.minecraft.app.messages.guildUnmuteMessage, color: 2067276, chatType: "Logger" })
      ];
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
      return [
        this.minecraft.broadcastCleanEmbed({
          message: ReplaceVariables(this.minecraft.app.messages.userMuteMessage, { username, time }),
          color: 15548997,
          chatType: "Guild"
        }),
        this.minecraft.broadcastCleanEmbed({
          message: ReplaceVariables(this.minecraft.app.messages.userMuteMessage, { username, time }),
          color: 15548997,
          chatType: "Logger"
        })
      ];
    }

    if (this.isUserUnmuteMessage(message)) {
      const username = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(/ +/g)[3];
      return [
        this.minecraft.broadcastCleanEmbed({ message: ReplaceVariables(this.minecraft.app.messages.userUnmuteMessage, { username }), color: 2067276, chatType: "Guild" }),
        this.minecraft.broadcastCleanEmbed({ message: ReplaceVariables(this.minecraft.app.messages.userUnmuteMessage, { username }), color: 2067276, chatType: "Logger" })
      ];
    }

    if (this.isSetrankFail(message)) {
      return this.minecraft.broadcastCleanEmbed({ message: this.minecraft.app.messages.setrankFailMessage, color: 15548997, chatType: "Guild" });
    }

    if (this.isGuildQuestCompletion(message)) {
      this.minecraft.broadcastHeadedEmbed({ title: "Guild Quest Completion", message: message, color: 15844367, chatType: "Guild" });
    }

    if (this.isAlreadyMuted(message)) {
      return this.minecraft.broadcastCleanEmbed({ message: this.minecraft.app.messages.alreadyMutedMessage, color: 15548997, chatType: "Guild" });
    }

    if (this.isNotInGuild(message)) {
      const username = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(" ")[0];
      return this.minecraft.broadcastCleanEmbed({
        message: ReplaceVariables(this.minecraft.app.messages.notInGuildMessage, { username }),
        color: 15548997,
        chatType: "Guild"
      });
    }

    if (this.isLowestRank(message)) {
      const username = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(" ")[0];
      return this.minecraft.broadcastCleanEmbed({
        message: ReplaceVariables(this.minecraft.app.messages.lowestRankMessage, { username }),
        color: 15548997,
        chatType: "Guild"
      });
    }

    if (this.isAlreadyHasRank(message)) {
      return this.minecraft.broadcastCleanEmbed({ message: this.minecraft.app.messages.alreadyHasRankMessage, color: 15548997, chatType: "Guild" });
    }

    if (this.isTooFast(message)) {
      return console.warn(message);
    }

    if (this.isPlayerNotFound(message)) {
      const username = (message.split(" ")?.[8] ?? "").slice(1, -1);
      return this.minecraft.broadcastCleanEmbed({
        message: ReplaceVariables(this.minecraft.app.messages.playerNotFoundMessage, { username }),
        color: 15548997,
        chatType: "Guild"
      });
    }

    if (this.isGuildLevelUpMessage(message)) {
      const level = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(/ +/g)[5];
      return this.minecraft.broadcastCleanEmbed({
        message: ReplaceVariables(this.minecraft.app.messages.guildLevelUpMessage, { level }),
        color: 16766720,
        chatType: "Guild"
      });
    }

    /* if (this.isPartyMessage(message)) {
      this.minecraft.broadcastCleanEmbed({
        message: `${message}`,
        color: 15548997,
        chatType: 'Guild'
      })
    }*/

    const regex =
      this.minecraft.app.config.discord.other.messageMode === "minecraft"
        ? /^(?<chatType>§[0-9a-fA-F](Guild|Officer)) > (?<rank>§[0-9a-fA-F](?:\[.*?\])?)?\s*(?<username>[^§\s]+)\s*(?:(?<guildRank>§[0-9a-fA-F](?:\[.*?\])?))?\s*§f: (?<message>.*)/
        : /^(?<chatType>\w+) > (?:(?:\[(?<rank>[^\]]+)\] )?(?:(?<username>\w+)(?: \[(?<guildRank>[^\]]+)\])?: )?)?(?<message>.+)$/;

    const match = (this.minecraft.app.config.discord.other.messageMode === "minecraft" ? colouredMessage : message).match(regex);
    if (!match || !match?.groups || !match.groups.message || !match.groups.chatType || !match.groups.username) return;

    if (this.isDiscordMessage(match.groups.message) === false) {
      const { chatType, rank, username, guildRank = "[Member]", message } = match.groups;
      if (message.includes("replying to") && username === this.minecraft.bot.username) {
        return;
      }

      this.minecraft.broadcastMessage({
        fullMessage: colouredMessage,
        chatType: chatType as ChannelNames,
        username,
        rank,
        guildRank,
        message,
        color: HexToDecimal(this.minecraftChatColorToHex(this.getRankColor(colouredMessage)))
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

  isDiscordMessage(message: string): boolean {
    const isDiscordMessage = /^(?<username>(?!https?:\/\/)[^\s»:>]+)\s*[»:>]\s*(?<message>.*)/;
    const match = message.match(isDiscordMessage);
    if (!match?.groups) return false;
    if (match && ["Party", "Guild", "Officer"].includes(match.groups.username || "UNKNOWN")) {
      return false;
    }
    return isDiscordMessage.test(message);
  }

  isCommand(message: string): boolean {
    const regex = new RegExp(`^(?<prefix>[${this.minecraft.app.config.minecraft.bot.prefix}-])(?<command>\\S+)(?:\\s+(?<args>.+))?\\s*$`);

    if (regex.test(message) === false) {
      const getMessage = /^(?<username>(?!https?:\/\/)[^\s»:>]+)\s*[»:>]\s*(?<message>.*)/;
      const match = message.match(getMessage);
      if (match === null || match.groups === undefined || match.groups.message === undefined) return false;
      return regex.test(match.groups.message);
    }
    return regex.test(message);
  }

  getCommandData(message: string): { [key: string]: string } {
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

  isMessageFromBot(username: string): boolean {
    if (!this.minecraft.isBotOnline()) return false;
    return this.minecraft.bot.username === username;
  }

  isAlreadyBlacklistedMessage(message: string): boolean {
    return message.includes("You've already blocked that player! /block remove <player> to unblock them!") && !message.includes(":");
  }

  isBlacklistRemovedMessage(message: string): boolean {
    return message.startsWith("Unblocked") && message.endsWith(".") && !message.includes(":");
  }

  isBlacklistMessage(message: string): boolean {
    return message.startsWith("Blocked") && message.endsWith(".") && !message.includes(":");
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

  isPartyMessage(message: string): boolean {
    return message.includes("has invited you to join their party!") && !message.includes(":");
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

  async tryToUpdateUser(input: string) {
    try {
      let uuid: string | null = input;
      if (this.minecraft.app.config.verification.enabled === false) return;
      if (isUuid(uuid) === false) uuid = await MowojangAPI.getUUID(uuid);
      if (!uuid) return;
      const linkedUser = this.minecraft.app.linked.getUserByUUID(uuid);
      if (!linkedUser) return;
      await linkedUser.updateRoles();
      console.log(`Updated roles for ${uuid}`);
    } catch {
      //
    }
  }
}

export default MessageHandler;
