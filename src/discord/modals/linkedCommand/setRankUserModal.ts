import DiscordModal from "../../private/modals/DiscordModal.js";
import DiscordModalData from "../../private/modals/DiscordModalData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import LinkedCommand from "../../commands/verification/linkedCommand.js";
import { CommandFlags, type DiscordManagerWithBot, GuildManagementAction } from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/Embed.js";
import { replaceVariables } from "../../../utils/stringUtils.js";
import type { ModalSubmitInteraction } from "discord.js";

class SetRankUserModal extends DiscordModal<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordModalData("setRankUser");
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ModalSubmitInteraction) {
    const linkedCommand = new LinkedCommand(this.discord);
    if (!interaction.isFromMessage()) throw new HypixelDiscordChatBridgeError("Unable to find the linked user");
    const linked = await linkedCommand.getLinkedFromLinkedEmbed(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError("Unable to find the linked user");
    const username = await linked.getUsername();
    const rank = interaction.fields.getRadioGroup("setRankUserRank", true);
    const { action, message } = await this.handleGuildManagementAction("setrank", username, rank);
    if (action === GuildManagementAction.NotInGuild) {
      throw new HypixelDiscordChatBridgeError(replaceVariables(this.discord.application.messages.notInGuildMessage, { username }));
    } else if (action === GuildManagementAction.NoPerms) {
      throw new HypixelDiscordChatBridgeError("The bot doesn't have perms to promote");
    } else if (action === GuildManagementAction.Timeout) {
      throw new HypixelDiscordChatBridgeError("Command timed out. Please try again");
    } else if (!message) {
      throw new HypixelDiscordChatBridgeError("No response message received");
    } else if (action === GuildManagementAction.Promote) {
      const rank =
        message
          .replace(/\[(.*?)\]/g, "")
          .trim()
          .split(" to ")
          .pop()
          ?.trim() ?? "";
      await interaction.followUp({
        embeds: [
          new SuccessEmbed()
            .setDescription(replaceVariables(this.discord.application.messages.promotionMessage, { username, rank }))
            .setAuthor({ name: "Member Promoted", iconURL: `https://mc-heads.net/avatar/${username}` })
        ]
      });
    } else if (action === GuildManagementAction.Demote) {
      const rank =
        message
          .replace(/\[(.*?)\]/g, "")
          .trim()
          .split(" to ")
          .pop()
          ?.trim() ?? "";
      await interaction.followUp({
        embeds: [
          new SuccessEmbed()
            .setDescription(replaceVariables(this.discord.application.messages.demotionMessage, { username, rank }))
            .setAuthor({ name: "Member Demote", iconURL: `https://mc-heads.net/avatar/${username}` })
        ]
      });
    }
  }
}

export default SetRankUserModal;
