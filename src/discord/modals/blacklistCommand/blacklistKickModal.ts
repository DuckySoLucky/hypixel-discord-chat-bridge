import BlacklistCommand from "../../commands/blacklistCommand.ts";
import DiscordModal from "../../private/modals/DiscordModal.js";
import DiscordModalData from "../../private/modals/DiscordModalData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import { CommandFlags, CommandPermission, type DiscordManagerWithBot, GuildManagementAction, type ModalSubmitInteractionWithGuild } from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/EmbedHelper.js";
import { replaceVariables } from "../../../utils/stringUtils.js";

class BlacklistKickModal extends DiscordModal<DiscordManagerWithBot> {
  override readonly data = new DiscordModalData("blacklistKick");
  override readonly flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.BlacklistCommand];
  override readonly permission = CommandPermission.StaffOnly;

  override async execute(interaction: ModalSubmitInteractionWithGuild) {
    const blacklistCommand = new BlacklistCommand(this.discord);
    if (!interaction.isFromMessage()) throw new HypixelDiscordChatBridgeError("Unable to find the Blacklist user");
    const blacklistUser = await blacklistCommand.getBlacklistedFromBlacklistEmbed(interaction.message);
    if (!blacklistUser) throw new HypixelDiscordChatBridgeError("Unable to find the blacklist user");
    const username = await blacklistUser.getUsername();
    if (!username) throw new HypixelDiscordChatBridgeError("Could not find a username for this blacklisted user?");
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

    await interaction.message.edit(await this.discord.application.data.blacklist.getBlacklistDataResponse(blacklistUser));
  }
}

export default BlacklistKickModal;
