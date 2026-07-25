import DiscordCommand from "../../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../../private/error.js";
import { CommandFlags, type DiscordManagerWithBot, GuildManagementAction } from "../../../../types/discord.js";
import { SuccessEmbed } from "../../../private/Embed.js";
import { replaceVariables } from "../../../../utils/stringUtils.js";
import type { ChatInputCommandInteraction } from "discord.js";

class MuteCommand extends DiscordCommand<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("mute")
      .setDescription("Mutes the given user for a given amount of time.")
      .addStringOption((option) => option.setName("guild-member-username").setDescription("Minecraft Username").setRequired(true).setAutocomplete(true))
      .addStringOption((option) => option.setName("time").setDescription("Time").setRequired(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction) {
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
      return await interaction.followUp({
        embeds: [new SuccessEmbed().setDescription(replaceVariables(this.discord.application.messages.userMuteMessage, { username, time }))]
      });
    } else if (action === GuildManagementAction.GuildMute) {
      return await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(replaceVariables(this.discord.application.messages.guildMuteMessage, { time }))] });
    }
  }
}

export default MuteCommand;
