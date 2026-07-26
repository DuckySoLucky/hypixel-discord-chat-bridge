import DiscordCommand from "../../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../../private/error.js";
import { CommandFlags, type DiscordManagerWithBot, GuildManagementAction } from "../../../../types/discord.js";
import { SuccessEmbed } from "../../../private/Embed.js";
import { translate } from "../../../../translations/TranslationsManager.js";
import type { ChatInputCommandInteraction } from "discord.js";

class InviteCommand extends DiscordCommand<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData().setName("invite").addStringOption((option) => option.setName("username").setRequired(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const username = interaction.options.getString("username", true);
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

export default InviteCommand;
