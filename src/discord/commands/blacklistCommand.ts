import BlacklistUser from "../../data/blacklist/BlacklistUser.js";
import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandData from "../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import MowojangAPI from "../../private/MowojangAPI.js";
import { BasicInteractionResponse, CommandFlags, type DiscordManagerWithClient } from "../../types/discord.js";
import { type ChatInputCommandInteraction, Message } from "discord.js";
import { SuccessEmbed } from "../private/Embed.js";
import { translate } from "../../translations/TranslationsManager.js";
import type LinkedUser from "../../data/linked/LinkedUser.js";

class BlacklistCommand extends DiscordCommand {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("blacklist")
      .addSubcommand((option) =>
        option
          .setName("add")
          .addStringOption((option) => option.setName("reason").setRequired(true))
          .addUserOption((option) => option.setName("user"))
          .addStringOption((option) => option.setName("username"))
          .addBooleanOption((option) => option.setName("alert-user"))
          .addBooleanOption((option) => option.setName("share-user"))
      )
      .addSubcommand((option) =>
        option
          .setName("remove")
          .addUserOption((option) => option.setName("user"))
          .addStringOption((option) => option.setName("username"))
          .addStringOption((option) => option.setName("reason"))
          .addBooleanOption((option) => option.setName("alert-user"))
          .addBooleanOption((option) => option.setName("share-user"))
      )
      .addSubcommand((option) =>
        option
          .setName("get")
          .addUserOption((option) => option.setName("user"))
          .addStringOption((option) => option.setName("username"))
      );
    this.flags = [CommandFlags.StaffOnly, CommandFlags.BlacklistCommand];
    this.response = BasicInteractionResponse.Ephemeral;
  }

  async getBlacklistedFromLinkedEmbed(message: Message): Promise<BlacklistUser | undefined> {
    if (message.author.id !== message.client.user.id) return undefined;
    const embed = message.embeds[0];
    if (embed === undefined) return undefined;
    const field = embed.fields.find((field) => field.name === translate("blacklist.embed.fields.blacklist.id.name"));
    if (field === undefined) return undefined;
    return await this.discord.application.data.blacklist.getUserByBlacklistId(field.value.replaceAll("`", ""));
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand(true);
    const user = interaction.options.getUser("user");
    const username = interaction.options.getString("username");
    const reason = interaction.options.getString("reason") ?? translate("generic.no.reason");
    if (!user && !username) throw new HypixelDiscordChatBridgeError(translate("generic.errors.arguments.two.missing", { argumentOne: "user", argumentTwo: "username" }));
    const alertUser = interaction.options.getBoolean("alert-user") ?? this.discord.application.config.blacklist.notifications.onBlacklistChange.enabled;
    const shareUser = interaction.options.getBoolean("share-user") ?? this.discord.application.config.blacklist.notifications.onBlacklistChange.shareBlacklister;

    switch (subcommand) {
      case "add": {
        let linked: LinkedUser | undefined;
        if (user) {
          linked = await this.discord.application.data.linked.getUserByDiscordId(user.id);
          const blacklistUser = await this.discord.application.data.blacklist.getUserByDiscordId(user.id);
          if (blacklistUser) throw new HypixelDiscordChatBridgeError(translate("blacklist.errors.already.blacklisted"));
        }
        if (username) {
          linked = await this.discord.application.data.linked.getUserByUsername(username);
          const blacklistUser = await this.discord.application.data.blacklist.getUserByUsername(username);
          if (blacklistUser) throw new HypixelDiscordChatBridgeError(translate("blacklist.errors.already.blacklisted"));
        }
        const discordId = user ? user.id : null;
        const uuid = linked ? linked.uuid : username ? await MowojangAPI.getUUID(username) : null;
        await new BlacklistUser({ discordId, uuid, reason, by: interaction.user.id }, this.discord.application.data.blacklist).save({
          alertUser,
          shareUser,
          user: interaction.user
        });
        await interaction.followUp({ embeds: [new SuccessEmbed().setDescription("User has been blacklisted").setDevFooter("Kathund")] });
        break;
      }
      case "remove": {
        if (user && username) throw new HypixelDiscordChatBridgeError(translate("generic.errors.arguments.two.supply", { argumentOne: "user", argumentTwo: "username" }));
        const blacklistUser = username
          ? await this.discord.application.data.blacklist.getUserByUsername(username)
          : await this.discord.application.data.blacklist.getUserByDiscordId(user!.id);
        if (!blacklistUser) throw new HypixelDiscordChatBridgeError(translate("blacklist.errors.not.blacklisted"));
        await blacklistUser.delete({ alertUser, shareUser, user: interaction.user, reason });
        await interaction.followUp({ embeds: [new SuccessEmbed().setDescription("User has been unblacklisted").setDevFooter("Kathund")] });
        break;
      }
      case "get": {
        if (user && username) throw new HypixelDiscordChatBridgeError(translate("generic.errors.arguments.two.supply", { argumentOne: "user", argumentTwo: "username" }));
        const blacklistUser = username
          ? await this.discord.application.data.blacklist.getUserByUsername(username)
          : await this.discord.application.data.blacklist.getUserByDiscordId(user!.id);
        if (!blacklistUser) throw new HypixelDiscordChatBridgeError(translate("blacklist.errors.not.blacklisted"));
        await interaction.followUp(await this.discord.application.data.blacklist.getBlacklistDataResponse(blacklistUser));
        break;
      }
      default: {
        throw new HypixelDiscordChatBridgeError(translate("discord.errors.interaction.command.unknown.subcommand"));
      }
    }
  }
}

export default BlacklistCommand;
