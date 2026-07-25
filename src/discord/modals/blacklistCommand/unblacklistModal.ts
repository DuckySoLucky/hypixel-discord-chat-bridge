import BlacklistCommand from "../../commands/blacklistCommand.js";
import DiscordModal from "../../private/modals/DiscordModal.js";
import DiscordModalData from "../../private/modals/DiscordModalData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import { CommandFlags, type DiscordManagerWithClient } from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/Embed.js";
import type { ModalSubmitInteraction } from "discord.js";

class UnblacklistModal extends DiscordModal {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordModalData("unblacklist");
    this.flags = [CommandFlags.StaffOnly, CommandFlags.BlacklistCommand];
  }

  override async execute(interaction: ModalSubmitInteraction) {
    const blacklistCommand = new BlacklistCommand(this.discord);
    if (!interaction.isFromMessage()) throw new HypixelDiscordChatBridgeError("Unable to find the blacklist user");
    const blacklistUser = await blacklistCommand.getBlacklistedFromLinkedEmbed(interaction.message);
    if (!blacklistUser) throw new HypixelDiscordChatBridgeError("Unable to find the blacklist user");
    const reason = interaction.fields.getTextInputValue("unblacklistReason") ?? "No reason provided";
    const alertUser = this.discord.application.config.blacklist.notifications.onBlacklistChange.enabled;
    const shareUser = this.discord.application.config.blacklist.notifications.onBlacklistChange.shareBlacklister;
    await blacklistUser.delete({ alertUser, shareUser, user: interaction.user, reason: reason.length > 0 ? reason : "No reason provided" });
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription("User has been unblacklisted").setDevFooter("Kathund")] });
  }
}

export default UnblacklistModal;
