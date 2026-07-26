import DiscordModal from "../../private/modals/DiscordModal.js";
import DiscordModalData from "../../private/modals/DiscordModalData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import LinkedCommand from "../../commands/verification/linkedCommand.js";
import { CommandFlags, type DiscordManagerWithBot, GuildManagementAction } from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/Embed.js";
import { translate } from "../../../translations/TranslationsManager.js";
import type { ModalSubmitInteraction } from "discord.js";

class KickUserModal extends DiscordModal<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordModalData("kickUser");
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ModalSubmitInteraction) {
    const linkedCommand = new LinkedCommand(this.discord);
    if (!interaction.isFromMessage()) throw new HypixelDiscordChatBridgeError(translate("linked.errors.user.find"));
    const linked = await linkedCommand.getLinkedFromLinkedEmbed(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError(translate("linked.errors.user.find"));
    const username = await linked.getUsername();
    const reason = interaction.fields.getTextInputValue("kickUserReason");
    const { action } = await this.handleGuildManagementAction("kick", username, reason);
    if (action === GuildManagementAction.NoPerms) {
      throw new HypixelDiscordChatBridgeError(translate("minecraft.errors.no.permissions.message", { action: translate("minecraft.errors.no.permissions.kick") }));
    } else if (action === GuildManagementAction.Timeout) {
      throw new HypixelDiscordChatBridgeError(translate("minecraft.errors.timeout.command"));
    } else if (action === GuildManagementAction.NotInGuild) {
      throw new HypixelDiscordChatBridgeError(translate("minecraft.responses.notInGuildMessage", { username }));
    } else if (action === GuildManagementAction.Kick) {
      await interaction.followUp({
        embeds: [
          new SuccessEmbed()
            .setDescription(translate("minecraft.responses.kickMessage", { username }))
            .setAuthor({ name: "Member Kicked", iconURL: `https://mc-heads.net/avatar/${username}` })
        ]
      });
    }
  }
}

export default KickUserModal;
