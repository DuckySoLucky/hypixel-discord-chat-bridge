import DiscordCommand from "../../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../../private/error.js";
import { CommandFlags, type DiscordManagerWithBot, GuildManagementAction } from "../../../../types/discord.js";
import { SuccessEmbed } from "../../../private/Embed.js";
import { translate } from "../../../../translations/TranslationsManager.js";
import type { ChatInputCommandInteraction } from "discord.js";

class MuteCommand extends DiscordCommand<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("mute")
      .addStringOption((option) => option.setName("guild-member-username").setRequired(true).setAutocomplete(true))
      .addStringOption((option) => option.setName("time").setRequired(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const username = interaction.options.getString("guild-member-username", true);
    const time = interaction.options.getString("time", true);
    const { action } = await this.handleGuildManagementAction("mute", username, time);
    if (action === GuildManagementAction.MuteTooLong) {
      throw new HypixelDiscordChatBridgeError(translate("minecraft.responses.cannotMuteMoreThanOneMonthMessage"));
    } else if (action === GuildManagementAction.AlreadyMuted) {
      throw new HypixelDiscordChatBridgeError(translate("minecraft.responses.alreadyMutedMessage"));
    } else if (action === GuildManagementAction.NoPerms) {
      throw new HypixelDiscordChatBridgeError(translate("minecraft.errors.no.permissions.mute"));
    } else if (action === GuildManagementAction.Timeout) {
      throw new HypixelDiscordChatBridgeError(translate("minecraft.errors.timeout.command"));
    } else if (action === GuildManagementAction.NotInGuild) {
      throw new HypixelDiscordChatBridgeError(translate("minecraft.responses.notInGuildMessage", { username }));
    } else if (action === GuildManagementAction.UserMute) {
      return await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(translate("minecraft.responses.userMuteMessage", { username, time }))] });
    } else if (action === GuildManagementAction.GuildMute) {
      return await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(translate("minecraft.responses.guildMuteMessage", { time }))] });
    }
  }
}

export default MuteCommand;
