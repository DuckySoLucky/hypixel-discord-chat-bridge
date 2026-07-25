import DiscordButton from "../../private/buttons/DiscordButton.js";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import LinkedCommand from "../../commands/verification/linkedCommand.js";
import { CommandFlags, type DiscordManagerWithBot, GuildManagementAction } from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/Embed.js";
import { replaceVariables } from "../../../utils/stringUtils.js";
import type { ButtonInteraction } from "discord.js";

class UnmuteUserButton extends DiscordButton<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordButtonData("unmuteUser");
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ButtonInteraction) {
    const linkedCommand = new LinkedCommand(this.discord);
    const linked = await linkedCommand.getLinkedFromLinkedEmbed(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError("Unable to find the linked user");
    const username = await linked.getUsername();
    const { action } = await this.handleGuildManagementAction("unmute", username);
    if (action === GuildManagementAction.NoPerms) {
      throw new HypixelDiscordChatBridgeError("The bot doesn't have perms to unmute");
    } else if (action === GuildManagementAction.Timeout) {
      throw new HypixelDiscordChatBridgeError("Command timed out. Please try again");
    } else if (action === GuildManagementAction.NotInGuild) {
      throw new HypixelDiscordChatBridgeError(replaceVariables(this.discord.application.messages.notInGuildMessage, { username }));
    } else if (action === GuildManagementAction.UserUnmute) {
      return await interaction.followUp({
        embeds: [new SuccessEmbed().setDescription(replaceVariables(this.discord.application.messages.userUnmuteMessage, { username }))]
      });
    } else if (action === GuildManagementAction.GuildUnmute) {
      return await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(this.discord.application.messages.guildUnmuteMessage)] });
    }
  }
}

export default UnmuteUserButton;
