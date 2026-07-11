import DiscordCommand from "../../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../../private/error.js";
import { CommandFlags, type DiscordManagerWithBot, GuildManagementAction } from "../../../../types/discord.js";
import { SuccessEmbed } from "../../../private/Embed.js";
import { translate } from "../../../../translations/TranslationsManager.js";
import type { ChatInputCommandInteraction } from "discord.js";

class UnmuteCommand extends DiscordCommand<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData().setName("unmute").addStringOption((option) => option.setName("guild-member-username").setRequired(true).setAutocomplete(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const username = interaction.options.getString("guild-member-username", true);
    const { action } = await this.handleGuildManagementAction("unmute", username);
    if (action === GuildManagementAction.NoPerms) {
      throw new HypixelDiscordChatBridgeError(translate("minecraft.errors.no.permissions.unmute"));
    } else if (action === GuildManagementAction.Timeout) {
      throw new HypixelDiscordChatBridgeError(translate("minecraft.errors.timeout.command"));
    } else if (action === GuildManagementAction.NotInGuild) {
      throw new HypixelDiscordChatBridgeError(translate("minecraft.responses.notInGuildMessage", { username }));
    } else if (action === GuildManagementAction.UserUnmute) {
      return await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(translate("minecraft.responses.userUnmuteMessage", { username }))] });
    } else if (action === GuildManagementAction.GuildUnmute) {
      return await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(translate("minecraft.responses.guildUnmuteMessage"))] });
    }
  }
}

export default UnmuteCommand;
