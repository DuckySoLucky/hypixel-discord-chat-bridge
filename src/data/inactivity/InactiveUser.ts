import Embed from "../../discord/private/Embed.js";
import GenericData from "../GenericData.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import { ActionRowBuilder, ButtonBuilder, ComponentType, type GuildMember } from "discord.js";
import type InactivityManager from "./InactivityManager.js";
import type { BasicInactiveUserData, InactiveUserData, InactivityData } from "../../types/inactivity.js";

class InactiveUser extends GenericData<InactiveUserData, InactivityData, InactivityManager> {
  readonly inactivityId: string;
  messageId?: string;
  readonly discordId: string;
  readonly reason: string;
  readonly start: number;
  readonly duration: number;
  constructor(data: BasicInactiveUserData, manager: InactivityManager) {
    super(manager);
    this.inactivityId = data.inactivityId ?? crypto.randomUUID();
    this.messageId = data.messageId;
    this.discordId = data.discordId;
    this.reason = data.reason;
    this.start = data.start ?? Math.floor(Date.now() / 1000);
    this.duration = data.duration;
  }

  override async save(): Promise<typeof this> {
    const inactivity = await this.manager.getFullData();
    const user = await this.manager.getData(this);
    if (user) return user;
    await this.handleSave();
    inactivity.push(this);
    await this.manager.writeUsersParsed(inactivity);
    return this;
  }

  private async handleSave(): Promise<this> {
    if (!this.manager.data.application.discord.isClientOnline()) {
      throw new HypixelDiscordChatBridgeError("The discord bot doesn't seam to be online? Please restart the application");
    }
    const channel = await this.manager.data.application.discord.getChannel("Logger-Inactivity");
    if (!channel || !channel.isSendable()) return this;
    const inactivityData = await this.manager.getInactivityDataResponse(this);
    const message = await channel.send(inactivityData);
    this.messageId = message.id;
    return this;
  }

  override async delete(): Promise<InactiveUser[]> {
    const inactivity = await this.manager.getFullData();
    const updated = inactivity.filter((u) => u.inactivityId !== this.inactivityId);
    await this.handleDelete();
    return await this.manager.writeUsersParsed(updated);
  }

  private async handleDelete(): Promise<void> {
    if (!this.manager.data.application.discord.isClientOnline()) {
      throw new HypixelDiscordChatBridgeError("The discord bot doesn't seam to be online? Please restart the application");
    }
    const channel = await this.manager.data.application.discord.getChannel("Logger-Inactivity");
    if (!channel || !channel.isSendable()) return;
    if (!this.messageId) return;
    const message = await channel.messages.fetch(this.messageId);
    const embeds = message.embeds.map((embed) => new Embed(embed.toJSON()).setColor("Red"));
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
    await message.edit({ content: ":warning: This inactivity has expired", embeds, components: [new ActionRowBuilder<ButtonBuilder>().addComponents(fixedButtons)] });
  }

  async getDiscordUser(): Promise<GuildMember | null> {
    if (!this.discordId) return null;
    if (!this.manager.data.application.discord.isClientOnline()) {
      throw new HypixelDiscordChatBridgeError("The discord bot doesn't seam to be online? Please restart the application");
    }
    if (!this.manager.data.application.discord.isGuildReady()) {
      this.manager.data.application.discord.stateHandler.loadGuild();
      throw new HypixelDiscordChatBridgeError("The discord server isn't ready. Please try again later");
    }

    return await this.manager.data.application.discord.guild.members.fetch(this.discordId).catch((e) => {
      console.error(e);
      return null;
    });
  }

  get expires(): number {
    return this.start + this.duration;
  }

  get isExpired(): boolean {
    return this.expires <= Math.floor(Date.now() / 1000);
  }

  override toJSON(): InactiveUserData {
    return { inactivityId: this.inactivityId, messageId: this.messageId, discordId: this.discordId, reason: this.reason, start: this.start, duration: this.duration };
  }
}

export default InactiveUser;
