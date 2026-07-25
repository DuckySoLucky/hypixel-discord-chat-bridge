import DiscordCommand from "../../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../../private/error.js";
import { CommandFlags, type DiscordManagerWithBot, GuildManagementAction } from "../../../../types/discord.js";
import { SuccessEmbed } from "../../../private/Embed.js";
import { replaceVariables } from "../../../../utils/stringUtils.js";
import type { ChatInputCommandInteraction } from "discord.js";

class UnmuteCommand extends DiscordCommand<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("unmute")
      .setDescription("Unmute the given user.")
      .addStringOption((option) => option.setName("guild-member-username").setDescription("Minecraft Username").setRequired(true).setAutocomplete(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const username = interaction.options.getString("guild-member-username", true);
    const { action } = await this.handleGuildManagementAction("unmute", username);
    if (action === GuildManagementAction.NoPerms) {
      throw new HypixelDiscordChatBridgeError("The bot doesn't have perms to unmute");
    } else if (action === GuildManagementAction.Timeout) {
      throw new HypixelDiscordChatBridgeError("Command timed out. Please try again");
    } else if (action === GuildManagementAction.NotInGuild) {
      throw new HypixelDiscordChatBridgeError(replaceVariables(this.discord.application.messages.notInGuildMessage, { username }));
    } else if (action === GuildManagementAction.UserUnmute) {
      return await interaction.followUp({
        embeds: [new SuccessEmbed().setDescription(replaceVariables(this.discord.application.messages.userUnmuteMessage, { username }))]
      });
    } else if (action === GuildManagementAction.GuildUnmute) {
      return await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(this.discord.application.messages.guildUnmuteMessage)] });
    }
  }
}

export default UnmuteCommand;
