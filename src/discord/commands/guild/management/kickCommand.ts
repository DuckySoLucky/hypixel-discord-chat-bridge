import DiscordCommand from "../../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../../private/error.js";
import { CommandFlags, type DiscordManagerWithBot, GuildManagementAction } from "../../../../types/discord.js";
import { SuccessEmbed } from "../../../private/Embed.js";
import { translate } from "../../../../translations/TranslationsManager.js";
import type { ChatInputCommandInteraction } from "discord.js";

class KickCommand extends DiscordCommand<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("kick")
      .addStringOption((option) => option.setName("guild-member-username").setRequired(true).setAutocomplete(true))
      .addStringOption((option) => option.setName("reason").setRequired(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const username = interaction.options.getString("guild-member-username", true);
    const reason = interaction.options.getString("reason", true);
    const { action } = await this.handleGuildManagementAction("kick", username, reason);
    if (action === GuildManagementAction.NoPerms) {
      throw new HypixelDiscordChatBridgeError(translate("minecraft.errors.no.permissions.kick"));
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

export default KickCommand;
