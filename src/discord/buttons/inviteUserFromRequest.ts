import DiscordButton from "../private/buttons/DiscordButton.js";
import DiscordButtonData from "../private/buttons/DiscordButtonData.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import { CommandFlags, type DiscordManagerWithBot, GuildManagementAction } from "../../types/discord.js";
import { SuccessEmbed } from "../private/Embed.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { ButtonInteraction } from "discord.js";

class InviteUserFromRequestButton extends DiscordButton<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordButtonData("inviteUserFromRequest");
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ButtonInteraction) {
    const username = this.getUsernameFromJoinRequest(interaction.message);
    if (!username) throw new HypixelDiscordChatBridgeError(translate("linked.errors.user.username"));
    const { action, message } = await this.handleGuildManagementAction("invite", username);
    if (action === GuildManagementAction.NoPerms) {
      throw new HypixelDiscordChatBridgeError(translate("minecraft.errors.no.permissions.invite"));
    } else if (action === GuildManagementAction.Timeout) {
      throw new HypixelDiscordChatBridgeError(translate("minecraft.errors.timeout.command"));
    } else if (!message) {
      throw new HypixelDiscordChatBridgeError(translate("minecraft.errors.no.response"));
    } else if (action === GuildManagementAction.FailedInvite) {
      // eslint-disable-next-line hypixelDiscordChatBridge/enforce-translate
      throw new HypixelDiscordChatBridgeError(message.replace(/\[(.*?)\]/g, "").trim());
    } else if (action === GuildManagementAction.OnlineInvite) {
      return await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(translate("minecraft.responses.offlineInvite", { username }))] });
    } else if (action === GuildManagementAction.OfflineInvite) {
      return await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(translate("minecraft.responses.offlineInvite", { username }))] });
    }
  }
}

export default InviteUserFromRequestButton;
