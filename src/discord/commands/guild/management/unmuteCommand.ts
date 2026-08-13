import DiscordCommand from "../../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../../private/error.js";
import {
  type ChatInputCommandInteractionWithGuild,
  CommandFlags,
  CommandPermission,
  type DiscordManagerWithBot,
  GuildManagementAction
} from "../../../../types/discord.js";
import { SuccessEmbed } from "../../../private/Embed.js";
import { replaceVariables } from "../../../../utils/stringUtils.js";

class UnmuteCommand extends DiscordCommand<DiscordManagerWithBot> {
  override readonly data = new DiscordCommandData()
    .setName("unmute")
    .setDescription("Unmute the given user.")
    .addStringOption((option) => option.setName("guild-member-username").setDescription("Minecraft Username").setRequired(true).setAutocomplete(true));
  override readonly flags = [CommandFlags.RequiresMinecraftBot];
  override readonly permission = CommandPermission.StaffOnly;

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    const username = interaction.options.getString("guild-member-username", true);
    const { action } = await this.handleGuildManagementAction("unmute", username);
    if (action === GuildManagementAction.NoPerms) {
      throw new HypixelDiscordChatBridgeError("The bot doesn't have perms to unmute");
    } else if (action === GuildManagementAction.Timeout) {
      throw new HypixelDiscordChatBridgeError("Command timed out. Please try again");
    } else if (action === GuildManagementAction.NotInGuild) {
      throw new HypixelDiscordChatBridgeError(replaceVariables(this.discord.application.messages.notInGuildMessage, { username }));
    } else if (action === GuildManagementAction.UserUnmute) {
      await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(replaceVariables(this.discord.application.messages.userUnmuteMessage, { username }))] });
    } else if (action === GuildManagementAction.GuildUnmute) {
      await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(this.discord.application.messages.guildUnmuteMessage)] });
    }
  }
}

export default UnmuteCommand;
