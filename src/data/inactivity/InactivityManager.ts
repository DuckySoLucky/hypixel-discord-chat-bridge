import GenericManager from "../GenericManager.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import InactiveUser from "./InactiveUser.js";
import { ActionRowBuilder, type BaseMessageOptions, ButtonStyle } from "discord.js";
import { ButtonBuilder } from "discord.js";
import { type InactiveUserData, type InactivityData, InactivityDataSchema } from "../../types/inactivity.js";
import { InactivityEmbed } from "../../discord/private/EmbedHelper.js";
import type DataManager from "../DataManager.js";

class InactivityManager extends GenericManager<InactiveUserData, InactivityData, InactiveUser> {
  constructor(data: DataManager) {
    super(data, "data/inactivity.json", "inactivity", [], InactivityDataSchema);
  }

  override parseData(data: InactivityData): InactiveUser[] {
    return data.map((user) => new InactiveUser(user, this));
  }

  protected override getId(data: InactiveUser): string {
    return data.inactivityId;
  }

  async writeUsersParsed(users: InactiveUser[]): Promise<InactiveUser[]> {
    return await this.writeData(users.map((user) => user.toJSON()));
  }

  async addUser(user: InactiveUser): Promise<InactiveUser> {
    const users = await this.mutateData((data) => (data.some((item) => item.inactivityId === user.inactivityId) ? data : [...data, user.toJSON()]));
    return users.find((item) => item.inactivityId === user.inactivityId) ?? user;
  }

  async deleteUser(user: InactiveUser): Promise<InactiveUser[]> {
    return await this.mutateData((data) => data.filter((item) => item.inactivityId !== user.inactivityId));
  }

  async getUserByDiscordId(discordId: string): Promise<InactiveUser | undefined> {
    const users = await this.getFullData();
    const user = users.find((user) => user.discordId === discordId);
    if (!user) return undefined;
    if (user.isExpired) {
      await user.delete();
      return undefined;
    }
    return user;
  }

  async getUserById(inactivityId: string): Promise<InactiveUser | undefined> {
    const users = await this.getFullData();
    const user = users.find((user) => user.inactivityId === inactivityId);
    if (!user) return undefined;
    if (user.isExpired) {
      await user.delete();
      return undefined;
    }
    return user;
  }

  async getInactivityDataResponse(user: InactiveUser): Promise<BaseMessageOptions> {
    const linked = await this.data.linked.getUserByDiscordId(user.discordId);
    if (!linked) throw new HypixelDiscordChatBridgeError("User is not verified");
    const player = await linked.getHypixelPlayer();
    return {
      embeds: [new InactivityEmbed(user, player)],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder().setCustomId("editInactivityReason").setLabel("Edit Reason").setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId("getLinked").setLabel("Get Linked Data").setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId("deleteInactivity").setLabel("Delete Inactivity").setStyle(ButtonStyle.Danger)
        )
      ]
    };
  }
}

export default InactivityManager;
