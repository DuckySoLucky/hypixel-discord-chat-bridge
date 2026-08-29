import DiscordButton from "../../private/buttons/DiscordButton.js";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import LinkedCommand from "../../commands/verification/linkedCommand.js";
import { type ButtonInteractionWithGuild, CommandFlags, CommandPermission, type DiscordManagerWithBot, GuildManagementAction } from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/EmbedHelper.js";
import { replaceVariables } from "../../../utils/stringUtils.js";

class DemoteUserButton extends DiscordButton<DiscordManagerWithBot> {
  override readonly data = new DiscordButtonData("demoteUser");
  override readonly flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ButtonInteractionWithGuild) {
    const linkedCommand = new LinkedCommand(this.discord);
    const linked = await linkedCommand.getLinkedFromLinkedEmbed(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError("Unable to find the linked user");
    const username = await linked.getUsername();
    const { action, message } = await this.handleGuildManagementAction("demote", username);
    if (action === GuildManagementAction.NotInGuild) {
      throw new HypixelDiscordChatBridgeError(replaceVariables(this.discord.application.messages.notInGuildMessage, { username }));
    } else if (action === GuildManagementAction.NoPerms) {
      throw new HypixelDiscordChatBridgeError("The bot doesn't have perms to demote");
    } else if (action === GuildManagementAction.Timeout) {
      throw new HypixelDiscordChatBridgeError("Command timed out. Please try again");
    } else if (!message) {
      throw new HypixelDiscordChatBridgeError("No response message received");
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

export default DemoteUserButton;
