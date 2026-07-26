import DiscordModal from "../../private/modals/DiscordModal.js";
import DiscordModalData from "../../private/modals/DiscordModalData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import LinkedCommand from "../../commands/verification/linkedCommand.js";
import { CommandFlags, type DiscordManagerWithBot, GuildManagementAction } from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/Embed.js";
import { translate } from "../../../translations/TranslationsManager.js";
import type { ModalSubmitInteraction } from "discord.js";

class MuteUserModal extends DiscordModal<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordModalData("muteUser");
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ModalSubmitInteraction) {
    const linkedCommand = new LinkedCommand(this.discord);
    if (!interaction.isFromMessage()) throw new HypixelDiscordChatBridgeError(translate("linked.errors.user.find"));
    const linked = await linkedCommand.getLinkedFromLinkedEmbed(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError(translate("linked.errors.user.find"));
    const username = await linked.getUsername();
    const time = interaction.fields.getTextInputValue("muteUserTime");
    const { action } = await this.handleGuildManagementAction("mute", username, time);
    if (action === GuildManagementAction.MuteTooLong) {
      throw new HypixelDiscordChatBridgeError(translate("minecraft.responses.cannotMuteMoreThanOneMonthMessage"));
    } else if (action === GuildManagementAction.AlreadyMuted) {
      throw new HypixelDiscordChatBridgeError(translate("minecraft.responses.alreadyMutedMessage"));
    } else if (action === GuildManagementAction.NoPerms) {
      throw new HypixelDiscordChatBridgeError(translate("minecraft.errors.no.permissions.mute"));
    } else if (action === GuildManagementAction.Timeout) {
      throw new HypixelDiscordChatBridgeError(translate("minecraft.errors.timeout.command"));
    } else if (action === GuildManagementAction.NotInGuild) {
      throw new HypixelDiscordChatBridgeError(translate("minecraft.responses.notInGuildMessage", { username }));
    } else if (action === GuildManagementAction.UserMute) {
      return await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(translate("minecraft.responses.userMuteMessage", { username, time }))] });
    } else if (action === GuildManagementAction.GuildMute) {
      return await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(translate("minecraft.responses.guildMuteMessage", { time }))] });
    }
  }
}

export default MuteUserModal;
