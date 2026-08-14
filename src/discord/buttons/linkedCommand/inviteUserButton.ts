import DiscordButton from "../../private/buttons/DiscordButton.js";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import LinkedCommand from "../../commands/verification/linkedCommand.js";
import { type ButtonInteractionWithGuild, CommandFlags, CommandPermission, type DiscordManagerWithBot, GuildManagementAction } from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/EmbedHelper.js";
import { replaceVariables } from "../../../utils/stringUtils.js";

class InviteUserButton extends DiscordButton<DiscordManagerWithBot> {
  override readonly data = new DiscordButtonData("inviteUser");
  override readonly flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ButtonInteractionWithGuild) {
    const linkedCommand = new LinkedCommand(this.discord);
    const linked = await linkedCommand.getLinkedFromLinkedEmbed(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError("Unable to find the linked user");
    const username = await linked.getUsername();
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

export default InviteUserButton;
