import Button from "../../discord/private/buttons/Button.js";
import GenericManager from "../GenericManager.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import InactiveUser from "./InactiveUser.js";
import { ActionRowBuilder, type BaseMessageOptions, ButtonStyle } from "discord.js";
import { SuccessEmbed } from "../../discord/private/Embed.js";
import { translate } from "../../translations/TranslationsManager.js";
import type DataManager from "../DataManager.js";
import type { InactiveUserData, InactivityData } from "../../types/inactivity.js";

class InactivityManager extends GenericManager<InactiveUserData, InactivityData, InactiveUser> {
  constructor(data: DataManager) {
    super(data, "data/inactivity.json", "inactivity", []);
  }

  override parseData(data: InactivityData): InactiveUser[] {
    return data.map((user) => new InactiveUser(user, this));
  }

  async writeUsersParsed(users: InactiveUser[]): Promise<InactiveUser[]> {
    return await this.writeData(users.map((user) => user.toJSON()));
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
    if (!linked) throw new HypixelDiscordChatBridgeError(translate("linked.errors.user.missing"));
    const player = await linked.getHypixelPlayer();
    return {
      embeds: [
        new SuccessEmbed()
          .setAuthor({ name: "Found Inactivity" })
          .setFields(
            { name: "Reason", value: `\`\`\`${user.reason}\`\`\`` },
            { name: "Start Time", value: `<t:${user.start}:F> (<t:${user.start}:R>)` },
            { name: "Expire Time", value: `<t:${user.expires}:F> (<t:${user.expires}:R>)` },
            { name: "Discord", value: `<@${user.discordId}>` },
            { name: "Discord ID", value: `\`\`\`${user.discordId}\`\`\`` },
            { name: "Username", value: `\`\`\`${player?.nickname ?? "UNKNOWN"}\`\`\`` },
            { name: "UUID", value: `\`\`\`${player?.uuid ?? "UNKNOWN"}\`\`\`` }
          )
          .setDevFooter("Kathund")
      ],
      components: [
        new ActionRowBuilder<Button>().addComponents(
          new Button().setCustomId("editInactivityReason").setStyle(ButtonStyle.Secondary),
          new Button().setCustomId("getLinked").setStyle(ButtonStyle.Secondary),
          new Button().setCustomId("deleteInactivity").setStyle(ButtonStyle.Danger)
        )
      ]
    };
  }
}

export default InactivityManager;
