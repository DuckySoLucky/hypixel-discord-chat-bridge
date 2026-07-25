import DiscordModal from "../../private/modals/DiscordModal.js";
import DiscordModalData from "../../private/modals/DiscordModalData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import LinkedCommand from "../../commands/verification/linkedCommand.js";
import { CommandFlags, type DiscordManagerWithBot, GuildManagementAction } from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/Embed.js";
import { replaceVariables } from "../../../utils/stringUtils.js";
import type { ModalSubmitInteraction } from "discord.js";

class MuteUserModal extends DiscordModal<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordModalData("muteUser");
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ModalSubmitInteraction) {
    const linkedCommand = new LinkedCommand(this.discord);
    if (!interaction.isFromMessage()) throw new HypixelDiscordChatBridgeError("Unable to find the linked user");
    const linked = await linkedCommand.getLinkedFromLinkedEmbed(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError("Unable to find the linked user");
    const username = await linked.getUsername();
    const time = interaction.fields.getTextInputValue("muteUserTime");
    const { action } = await this.handleGuildManagementAction("mute", username, time);
    if (action === GuildManagementAction.MuteTooLong) {
      throw new HypixelDiscordChatBridgeError(this.discord.application.messages.cannotMuteMoreThanOneMonthMessage);
    } else if (action === GuildManagementAction.AlreadyMuted) {
      throw new HypixelDiscordChatBridgeError(this.discord.application.messages.alreadyMutedMessage);
    } else if (action === GuildManagementAction.NoPerms) {
      throw new HypixelDiscordChatBridgeError("The bot doesn't have perms to mute");
    } else if (action === GuildManagementAction.Timeout) {
      throw new HypixelDiscordChatBridgeError("Command timed out. Please try again");
    } else if (action === GuildManagementAction.NotInGuild) {
      throw new HypixelDiscordChatBridgeError(replaceVariables(this.discord.application.messages.notInGuildMessage, { username }));
    } else if (action === GuildManagementAction.UserMute) {
      return await interaction.followUp({
        embeds: [new SuccessEmbed().setDescription(replaceVariables(this.discord.application.messages.userMuteMessage, { username, time }))]
      });
    } else if (action === GuildManagementAction.GuildMute) {
      return await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(replaceVariables(this.discord.application.messages.guildMuteMessage, { time }))] });
    }
  }
}

export default MuteUserModal;
