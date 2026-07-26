import BlacklistUser from "./BlacklistUser.js";
import Button from "../../discord/private/buttons/Button.js";
import GenericManager from "../GenericManager.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import MowojangAPI from "../../private/MowojangAPI.js";
import { ActionRowBuilder, type BaseMessageOptions, ButtonStyle } from "discord.js";
import { SuccessEmbed } from "../../discord/private/Embed.js";
import { translate } from "../../translations/TranslationsManager.js";
import type DataManager from "../DataManager.js";
import type { BlacklistData, BlacklistedUserData } from "../../types/blacklist.js";

class BlacklistManager extends GenericManager<BlacklistedUserData, BlacklistData, BlacklistUser> {
  constructor(data: DataManager) {
    super(data, "data/blacklist.json", "blacklist", []);
  }

  override parseData(data: BlacklistData): BlacklistUser[] {
    return data.map((user) => new BlacklistUser(user, this));
  }

  async writeUsersParsed(users: BlacklistUser[]): Promise<BlacklistUser[]> {
    return await this.writeData(users.map((user) => user.toJSON()));
  }

  async getUserByBlacklistId(blacklistId: string): Promise<BlacklistUser | undefined> {
    const users = await this.getFullData();
    return users.find((user) => user.blacklistId === blacklistId);
  }

  async getUserByDiscordId(discordId: string): Promise<BlacklistUser | undefined> {
    const users = await this.getFullData();
    return users.find((user) => user.discordId === discordId);
  }

  async getUserByUsername(username: string): Promise<BlacklistUser | undefined> {
    const UUID = await MowojangAPI.getUUID(username);
    if (UUID === null) throw new HypixelDiscordChatBridgeError(translate("api.mowojang.errors.failed.player"));
    return this.getUserByUUID(UUID);
  }

  async getUserByUUID(UUID: string): Promise<BlacklistUser | undefined> {
    const users = await this.getFullData();
    return users.find((user) => user.uuid === UUID);
  }

  async getBlacklistDataResponse(user: BlacklistUser): Promise<BaseMessageOptions> {
    const [player, guildMember] = await Promise.all([user.getHypixelPlayer(), user.isUserInHypixelGuild()]);
    return {
      embeds: [
        new SuccessEmbed()
          .setAuthor({ name: translate("blacklist.embed.author") })
          .setFields(
            { name: translate("discord.embed.generic.fields.reason.name"), value: translate("discord.embed.generic.fields.data.value", { data: user.reason }) },
            { name: translate("blacklist.embed.fields.blacklisted.by.name"), value: translate("discord.format.mention", { id: user.by }) },
            { name: translate("discord.embed.generic.fields.timestamp.name"), value: translate("discord.format.timestamp", { timestamp: user.timestamp }) },
            { name: translate("discord.name"), value: translate("discord.format.mention", { discordId: user.discordId ?? translate("UNKNOWN") }) },
            {
              name: translate("discord.embed.generic.fields.discord.id.name"),
              value: translate("discord.embed.generic.fields.data.value", { discordId: user.discordId ?? translate("UNKNOWN") })
            },
            {
              name: translate("discord.embed.generic.fields.username.name"),
              value: translate("discord.embed.generic.fields.data.value", { data: player?.nickname ?? translate("UNKNOWN") })
            },
            {
              name: translate("discord.embed.generic.fields.username.formatted.name"),
              value: translate("discord.embed.generic.fields.data.value", { data: player?.formattedNickname ?? translate("UNKNOWN") })
            },
            {
              name: translate("discord.embed.generic.fields.uuid.name"),
              value: translate("discord.embed.generic.fields.data.value", { UUID: player?.uuid ?? translate("UNKNOWN") })
            },
            { name: translate("discord.embed.generic.fields.inGuild.name"), value: translate(`discord.embed.generic.fields.inGuild.value.${guildMember !== undefined}`) },
            { name: translate("blacklist.embed.fields.blacklist.id.name"), value: translate("discord.embed.generic.fields.data.value", { data: user.blacklistId }) }
          )
          .setDevFooter("Kathund")
      ],
      components: [
        new ActionRowBuilder<Button>().addComponents(
          new Button().setCustomId("editBlacklistReason").setStyle(ButtonStyle.Secondary),
          new Button().setCustomId("getLinked").setStyle(ButtonStyle.Secondary),
          new Button().setCustomId("unblacklist").setStyle(ButtonStyle.Danger),
          new Button().setCustomId("blacklistRefresh").setStyle(ButtonStyle.Secondary)
        )
      ]
    };
  }
}

export default BlacklistManager;
