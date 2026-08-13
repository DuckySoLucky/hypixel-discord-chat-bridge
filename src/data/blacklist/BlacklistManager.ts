import BlacklistUser from "./BlacklistUser.js";
import GenericManager from "../GenericManager.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import MowojangAPI from "../../private/MowojangAPI.js";
import { ActionRowBuilder, type BaseMessageOptions, ButtonStyle } from "discord.js";
import { type BlacklistData, BlacklistDataSchema, type BlacklistedUserData } from "../../types/blacklist.js";
import { ButtonBuilder } from "discord.js";
import { SuccessEmbed } from "../../discord/private/EmbedHelper.js";
import type DataManager from "../DataManager.js";

class BlacklistManager extends GenericManager<BlacklistedUserData, BlacklistData, BlacklistUser> {
  constructor(data: DataManager) {
    super(data, "data/blacklist.json", "blacklist", [], BlacklistDataSchema);
  }

  override parseData(data: BlacklistData): BlacklistUser[] {
    return data.map((user) => new BlacklistUser(user, this));
  }

  protected override getId(data: BlacklistUser): string {
    return data.blacklistId;
  }

  async writeUsersParsed(users: BlacklistUser[]): Promise<BlacklistUser[]> {
    return await this.writeData(users.map((user) => user.toJSON()));
  }

  async addUser(user: BlacklistUser): Promise<BlacklistUser> {
    const users = await this.mutateData((data) => {
      return data.some((item) => item.blacklistId === user.blacklistId)
        ? data.map((item) => (item.blacklistId === user.blacklistId ? user.toJSON() : item))
        : [...data, user.toJSON()];
    });

    return users.find((item) => item.blacklistId === user.blacklistId) ?? user;
  }

  async deleteUser(user: BlacklistUser): Promise<BlacklistUser[]> {
    return await this.mutateData((data) => data.filter((item) => item.blacklistId !== user.blacklistId));
  }

  async getUserByDiscordId(discordId: string): Promise<BlacklistUser | undefined> {
    const users = await this.getFullData();
    return users.find((user) => user.discordId === discordId);
  }

  async getUserByUsername(username: string): Promise<BlacklistUser | undefined> {
    const UUID = await MowojangAPI.getUUID(username);
    if (UUID === null) throw new HypixelDiscordChatBridgeError("User doesn't exist");
    return this.getUserByUUID(UUID);
  }

  async getUserByUUID(UUID: string): Promise<BlacklistUser | undefined> {
    const users = await this.getFullData();
    return users.find((user) => user.uuid === UUID);
  }

  async getUserByBlacklistID(ID: string): Promise<BlacklistUser | undefined> {
    const users = await this.getFullData();
    return users.find((user) => user.blacklistId === ID);
  }

  async getBlacklistDataResponse(user: BlacklistUser): Promise<BaseMessageOptions> {
    const [player, guildMember] = await Promise.all([user.getHypixelPlayer(), user.isUserInHypixelGuild()]);
    return {
      embeds: [
        new SuccessEmbed()
          .setAuthor({ name: "Found Blacklist" })
          .setFields(
            { name: "Reason", value: `\`\`\`${user.reason}\`\`\`` },
            { name: "Blacklisted By", value: `<@${user.by}>` },
            { name: "Timestamp", value: `<t:${user.timestamp}:F> (<t:${user.timestamp}:R>)` },
            { name: "Discord", value: `<@${user.discordId ?? "UNKNOWN"}>` },
            { name: "Discord ID", value: `\`\`\`${user.discordId ?? "UNKNOWN"}\`\`\`` },
            { name: "Username", value: `\`\`\`${player?.nickname ?? "UNKNOWN"}\`\`\`` },
            { name: "UUID", value: `\`\`\`${player?.uuid ?? "UNKNOWN"}\`\`\`` },
            { name: "Formatted Username", value: `\`\`\`${player?.formattedNickname ?? "UNKNOWN"}\`\`\`` },
            { name: "Is in Guild", value: guildMember ? ":white_check_mark: Yes" : ":x: No" },
            { name: "Blacklist ID", value: `\`\`\`${user.blacklistId}\`\`\`` }
          )
          .setDevFooter("Kathund")
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder().setCustomId("editBlacklistReason").setLabel("Edit Reason").setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId("getLinked").setLabel("Get Linked Data").setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId("unblacklist").setLabel("Delete Blacklist").setStyle(ButtonStyle.Danger)
        ),
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("blacklistKick")
            .setLabel("Kick user from guild")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(guildMember === undefined),
          new ButtonBuilder().setCustomId("refreshBlacklist").setLabel("Refresh").setStyle(ButtonStyle.Secondary)
        )
      ]
    };
  }
}

export default BlacklistManager;
