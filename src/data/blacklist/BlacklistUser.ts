import EmbedHelper, { BlacklistEmbed, SuccessEmbed } from "../../discord/private/EmbedHelper.js";
import { toError } from "../../utils/asyncUtils.js";
import GenericData from "../GenericData.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import MowojangAPI from "../../private/MowojangAPI.js";
import { ActionRowBuilder, ButtonBuilder, ComponentType, type GuildMember } from "discord.js";
import { getPlayer } from "../../utils/hypixelUtils.js";
import type BlacklistManager from "./BlacklistManager.js";
import type { BasicBlacklistedUserData, BlacklistDeleteOptions, BlacklistSaveOptions, BlacklistedUserData } from "../../types/blacklist.js";
import type { Guild, GuildMember as HypixelGuildMember, Player } from "hypixel-api-reborn";

class BlacklistUser extends GenericData<BlacklistedUserData, BlacklistManager> {
  readonly blacklistId: string;
  messageId?: string;
  readonly discordId: string | null;
  readonly uuid: string | null;
  readonly reason: string;
  readonly timestamp: number;
  readonly by: string;
  constructor(data: BasicBlacklistedUserData, manager: BlacklistManager) {
    super(manager);
    this.blacklistId = data.blacklistId ?? crypto.randomUUID();
    this.messageId = data.messageId;
    this.discordId = data.discordId;
    this.uuid = data.uuid;
    this.reason = data.reason;
    this.timestamp = data.timestamp ?? Math.floor(Date.now() / 1000);
    this.by = data.by;
  }

  async updateReason(reason: string, saveData: BlacklistSaveOptions): Promise<BlacklistUser> {
    const user = new BlacklistUser({ ...this.toJSON(), reason }, this.manager);
    return await user.save(saveData);
  }

  async save(data: BlacklistSaveOptions): Promise<BlacklistUser> {
    await this.handleSave(data);
    return await this.manager.addUser(this);
  }

  private async handleSave({ alertUser, shareUser, user }: BlacklistSaveOptions): Promise<this> {
    if (!this.manager.data.application.discord.isClientOnline()) {
      throw new HypixelDiscordChatBridgeError("The discord bot doesn't seam to be online? Please restart the application");
    }
    const channel = await this.manager.data.application.discord.getChannel("Logger-Blacklist");
    const blacklistData = await this.manager.getBlacklistDataResponse(this);

    if (this.messageId) {
      await this.refreshMessage();
      return this;
    }

    const message = await channel.send({ ...blacklistData, content: "User has been blacklisted" });
    if (this.discordId && alertUser) {
      const embed = new EmbedHelper()
        .setColor("Red")
        .setAuthor({ name: "You have been blacklisted" })
        .setDescription(this.reason)
        .setFooter({ text: `Blacklisted by @${user.id}`, iconURL: user.avatarURL({ size: 4096 }) || undefined });
      if (!shareUser) embed.setDevFooter("Kathund");
      const send = await this.manager.data.application.discord.client.users.send(this.discordId, { embeds: [embed] }).catch((e: Error) => {
        if (e.name === "DiscordAPIError[50278]") return null;
        throw e;
      });
      if (send === null) throw new HypixelDiscordChatBridgeError("User has DMs off. They have not be alerted about the blacklist");
    }
    this.messageId = message.id;
    return this;
  }

  async delete(data: BlacklistDeleteOptions): Promise<BlacklistUser[]> {
    await this.handleDelete(data);
    return await this.manager.deleteUser(this);
  }

  private async handleDelete({ alertUser, shareUser, user, reason }: BlacklistDeleteOptions): Promise<void> {
    if (!this.manager.data.application.discord.isClientOnline()) {
      throw new HypixelDiscordChatBridgeError("The discord bot doesn't seam to be online? Please restart the application");
    }
    const channel = await this.manager.data.application.discord.getChannel("Logger-Blacklist");
    if (!this.messageId) return;
    const message = await channel.messages.fetch(this.messageId);
    const component = message.components[0];
    if (!component || component.type !== ComponentType.ActionRow) return;
    const fixedButtons = component.components.flatMap((compontent) => {
      if (compontent.type !== ComponentType.Button) return [];
      return [
        new ButtonBuilder()
          .setCustomId(compontent.customId!)
          .setLabel(compontent.label!)
          .setStyle(compontent.style)
          .setDisabled(compontent.customId !== "getLinked")
      ];
    });
    await message.edit({
      content: "",
      embeds: [
        new BlacklistEmbed(this).addFields(
          { name: "\u200B", value: "\u200B" },
          { name: "\u200B", value: "\u200B" },
          { name: "Removed Reason", value: `\`\`\`${reason}\`\`\`` },
          { name: "Removed By", value: `<@${user.id}>` }
        )
      ],
      components: [new ActionRowBuilder<ButtonBuilder>().addComponents(fixedButtons)]
    });
    if (this.discordId && alertUser) {
      const embed = new SuccessEmbed()
        .setAuthor({ name: "You have been removed from the blacklist" })
        .setDescription(this.reason)
        .setFooter({ text: `Removed by @${user.id}`, iconURL: user.avatarURL({ size: 4096 }) || undefined });
      if (!shareUser) embed.setDevFooter("Kathund");
      const send = await this.manager.data.application.discord.client.users.send(this.discordId, { embeds: [embed] }).catch((e: Error) => {
        if (e.name === "DiscordAPIError[50278]") return null;
        throw e;
      });
      if (send === null) throw new HypixelDiscordChatBridgeError("User has DMs off. They have not be alerted about being removed from the blacklist");
    }
  }

  async getUsername(): Promise<string | null> {
    if (!this.uuid) return null;
    const username = await MowojangAPI.getUsername(this.uuid);
    if (username === null) throw new HypixelDiscordChatBridgeError("User doesn't exist");
    return username;
  }

  async getDiscordUser(): Promise<GuildMember | null> {
    if (!this.discordId) return null;
    if (!this.manager.data.application.discord.isClientOnline()) {
      throw new HypixelDiscordChatBridgeError("The discord bot doesn't seam to be online? Please restart the application");
    }
    if (!this.manager.data.application.discord.isGuildReady()) {
      await this.manager.data.application.discord.loadGuild();
      throw new HypixelDiscordChatBridgeError("The discord server isn't ready. Please try again later");
    }

    return await this.manager.data.application.discord.guild.members.fetch(this.discordId).catch((error) => {
      this.manager.data.application.logError(toError(error));
      return null;
    });
  }

  async getHypixelPlayer(): Promise<Player | null> {
    if (!this.uuid) return null;
    return await getPlayer(this.uuid);
  }

  async isUserInHypixelGuild(hypixelGuild: Guild | null = null): Promise<HypixelGuildMember | undefined> {
    if (!this.uuid) return undefined;
    const guild = hypixelGuild ?? (await this.manager.data.application.getBotGuild());
    return guild.members.find((member) => member.uuid === this.uuid);
  }

  async refreshMessage() {
    if (!this.messageId) return;
    const channel = await this.manager.data.application.discord.getChannel("Logger-Blacklist");
    const message = await channel.messages.fetch(this.messageId).catch(() => null);
    if (!message) return;
    const blacklistData = await this.manager.getBlacklistDataResponse(this);
    await message.edit(blacklistData);
  }

  override toJSON(): BlacklistedUserData {
    return {
      blacklistId: this.blacklistId,
      messageId: this.messageId,
      uuid: this.uuid,
      discordId: this.discordId,
      reason: this.reason,
      timestamp: this.timestamp,
      by: this.by
    };
  }
}

export default BlacklistUser;
