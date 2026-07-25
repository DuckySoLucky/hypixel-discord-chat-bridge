import DiscordButton from "../private/buttons/DiscordButton.js";
import DiscordButtonData from "../private/buttons/DiscordButtonData.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import { CommandFlags, type DiscordManagerWithBot, GuildManagementAction } from "../../types/discord.js";
import { SuccessEmbed } from "../private/Embed.js";
import { replaceVariables } from "../../utils/stringUtils.js";
import type { ButtonInteraction } from "discord.js";

class InviteUserFromRequestButton extends DiscordButton<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordButtonData("inviteUserFromRequest");
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ButtonInteraction) {
    const username = this.getUsernameFromJoinRequest(interaction.message);
    if (!username) throw new HypixelDiscordChatBridgeError("Unable to find username");
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
      return await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(replaceVariables(this.discord.application.messages.offlineInvite, { username }))] });
    } else if (action === GuildManagementAction.OfflineInvite) {
      return await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(replaceVariables(this.discord.application.messages.offlineInvite, { username }))] });
    }
  }
}

export default InviteUserFromRequestButton;
