import DiscordModal from "../../private/modals/DiscordModal.js";
import DiscordModalData from "../../private/modals/DiscordModalData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import LinkedCommand from "../../commands/verification/linkedCommand.js";
import { CommandFlags, CommandPermission, type DiscordManagerWithBot, GuildManagementAction, type ModalSubmitInteractionWithGuild } from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/EmbedHelper.ts";
import { replaceVariables } from "../../../utils/stringUtils.js";

class KickUserModal extends DiscordModal<DiscordManagerWithBot> {
  override readonly data = new DiscordModalData("kickUser");
  override readonly flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.StaffOnly;

  override async execute(interaction: ModalSubmitInteractionWithGuild) {
    const linkedCommand = new LinkedCommand(this.discord);
    if (!interaction.isFromMessage()) throw new HypixelDiscordChatBridgeError("Unable to find the linked user");
    const linked = await linkedCommand.getLinkedFromLinkedEmbed(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError("Unable to find the linked user");
    const username = await linked.getUsername();
    const reason = interaction.fields.getTextInputValue("kickUserReason");
    const { action } = await this.handleGuildManagementAction("kick", username, reason);
    if (action === GuildManagementAction.NoPerms) {
      throw new HypixelDiscordChatBridgeError("The bot doesn't have perms to kick");
    } else if (action === GuildManagementAction.Timeout) {
      throw new HypixelDiscordChatBridgeError("Command timed out. Please try again");
    } else if (action === GuildManagementAction.NotInGuild) {
      throw new HypixelDiscordChatBridgeError(replaceVariables(this.discord.application.messages.notInGuildMessage, { username }));
    } else if (action === GuildManagementAction.Kick) {
      await interaction.followUp({
        embeds: [
          new SuccessEmbed()
            .setDescription(replaceVariables(this.discord.application.messages.kickMessage, { username }))
            .setAuthor({ name: "Member Kicked", iconURL: `https://mc-heads.net/avatar/${username}` })
        ]
      });
    }
  }
}

export default KickUserModal;
