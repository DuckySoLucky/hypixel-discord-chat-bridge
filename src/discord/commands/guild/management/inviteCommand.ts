import DiscordCommand from "../../../private/commands/DiscordCommand.js";
import DiscordCommandDataBuilder from "../../../private/commands/DiscordCommandDataBuilder.js";
import HypixelDiscordChatBridgeError from "../../../../private/error.js";
import {
  type ChatInputCommandInteractionWithGuild,
  CommandFlags,
  CommandPermission,
  type DiscordManagerWithBot,
  GuildManagementAction
} from "../../../../types/discord.js";
import { SuccessEmbed } from "../../../private/EmbedHelper.js";
import { replaceVariables } from "../../../../utils/stringUtils.js";

class InviteCommand extends DiscordCommand<DiscordManagerWithBot> {
  override readonly data = new DiscordCommandDataBuilder()
    .setName("invite")
    .setDescription("Invites the given user to the guild.")
    .addStringOption((option) => option.setName("username").setDescription("Minecraft Username").setRequired(true));
  override readonly flags = [CommandFlags.RequiresMinecraftBot];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    const username = interaction.options.getString("username", true);
    const { action, message } = await this.handleGuildManagementAction("invite", username);
    if (action === GuildManagementAction.NoPerms) {
      throw new HypixelDiscordChatBridgeError("The bot doesn't have perms to invite");
    } else if (action === GuildManagementAction.Timeout) {
      throw new HypixelDiscordChatBridgeError("Command timed out. Please try again");
    } else if (!message) {
      throw new HypixelDiscordChatBridgeError("No response message received");
    } else if (action === GuildManagementAction.FailedInvite) {
      throw new HypixelDiscordChatBridgeError(message.replace(/\[(.*?)\]/g, "").trim());
    } else if (action === GuildManagementAction.OnlineInvite) {
      await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(replaceVariables(this.discord.application.messages.offlineInvite, { username }))] });
    } else if (action === GuildManagementAction.OfflineInvite) {
      await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(replaceVariables(this.discord.application.messages.offlineInvite, { username }))] });
    }
  }
}

export default InviteCommand;
