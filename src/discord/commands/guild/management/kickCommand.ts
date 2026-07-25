import DiscordCommand from "../../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../../private/error.js";
import { CommandFlags, type DiscordManagerWithBot, GuildManagementAction } from "../../../../types/discord.js";
import { SuccessEmbed } from "../../../private/Embed.js";
import { replaceVariables } from "../../../../utils/stringUtils.js";
import type { ChatInputCommandInteraction } from "discord.js";

class KickCommand extends DiscordCommand<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("kick")
      .setDescription("Kicks the given user to the guild.")
      .addStringOption((option) => option.setName("guild-member-username").setDescription("Minecraft Username").setRequired(true).setAutocomplete(true))
      .addStringOption((option) => option.setName("reason").setDescription("Reason").setRequired(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const username = interaction.options.getString("guild-member-username", true);
    const reason = interaction.options.getString("reason", true);
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
  }
}

export default KickCommand;
