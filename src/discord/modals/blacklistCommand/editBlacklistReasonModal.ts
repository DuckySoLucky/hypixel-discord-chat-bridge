import BlacklistCommand from "../../commands/blacklistCommand.js";
import DiscordModal from "../../private/modals/DiscordModal.js";
import DiscordModalData from "../../private/modals/DiscordModalData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import { CommandFlags, CommandPermission, type ModalSubmitInteractionWithGuild } from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/EmbedHelper.js";

class EditBlacklistReasonModal extends DiscordModal {
  override readonly data = new DiscordModalData("editBlacklistReason");
  override readonly flags = [CommandFlags.BlacklistCommand];
  override readonly permission = CommandPermission.StaffOnly;

  override async execute(interaction: ModalSubmitInteractionWithGuild) {
    const blacklistCommand = new BlacklistCommand(this.discord);
    if (!interaction.isFromMessage()) throw new HypixelDiscordChatBridgeError("Unable to find the blacklist user");
    const blacklistUser = await blacklistCommand.getBlacklistedFromBlacklistEmbed(interaction.message);
    if (!blacklistUser) throw new HypixelDiscordChatBridgeError("Unable to find the blacklist user");
    const reason = interaction.fields.getTextInputValue("editBlacklistReasonReason") ?? "No reason provided";
    await blacklistUser.updateReason(reason, { alertUser: false, shareUser: false, user: interaction.user });
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription("Reason updated").setDevFooter("Kathund")] });
  }
}

export default EditBlacklistReasonModal;
