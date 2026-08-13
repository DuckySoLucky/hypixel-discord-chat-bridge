import DiscordCommand from "../../../private/commands/DiscordCommand.js";
import DiscordCommandDataBuilder from "../../../private/commands/DiscordCommandDataBuilder.ts";
import HypixelDiscordChatBridgeError from "../../../../private/error.js";
import {
  type ChatInputCommandInteractionWithGuild,
  CommandFlags,
  CommandPermission,
  type DiscordManagerWithBot,
  GuildManagementAction
} from "../../../../types/discord.js";
import { SuccessEmbed } from "../../../private/EmbedHelper.ts";
import { replaceVariables } from "../../../../utils/stringUtils.js";

class MuteCommand extends DiscordCommand<DiscordManagerWithBot> {
  override readonly data = new DiscordCommandDataBuilder()
    .setName("mute")
    .setDescription("Mutes the given user for a given amount of time.")
    .addStringOption((option) => option.setName("guild-member-username").setDescription("Minecraft Username").setRequired(true).setAutocomplete(true))
    .addStringOption((option) => option.setName("time").setDescription("Time").setRequired(true));
  override readonly flags = [CommandFlags.RequiresMinecraftBot];
  override readonly permission = CommandPermission.StaffOnly;

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    const username = interaction.options.getString("guild-member-username", true);
    const time = interaction.options.getString("time", true);
    const { action } = await this.handleGuildManagementAction("mute", username, time);
    if (action === GuildManagementAction.MuteTooLong) {
      throw new HypixelDiscordChatBridgeError(this.discord.application.messages.cannotMuteMoreThanOneMonthMessage);
    } else if (action === GuildManagementAction.AlreadyMuted) {
      throw new HypixelDiscordChatBridgeError(this.discord.application.messages.alreadyMutedMessage);
    } else if (action === GuildManagementAction.NoPerms) {
      throw new HypixelDiscordChatBridgeError("The bot doesn't have perms to mute");
    } else if (action === GuildManagementAction.Timeout) {
      throw new HypixelDiscordChatBridgeError("Command timed out. Please try again");
    } else if (action === GuildManagementAction.NotInGuild) {
      throw new HypixelDiscordChatBridgeError(replaceVariables(this.discord.application.messages.notInGuildMessage, { username }));
    } else if (action === GuildManagementAction.UserMute) {
      await interaction.followUp({
        embeds: [new SuccessEmbed().setDescription(replaceVariables(this.discord.application.messages.userMuteMessage, { username, time }))]
      });
    } else if (action === GuildManagementAction.GuildMute) {
      await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(replaceVariables(this.discord.application.messages.guildMuteMessage, { time }))] });
    }
  }
}

export default MuteCommand;
