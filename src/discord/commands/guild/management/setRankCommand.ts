import DiscordCommand from "../../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../../private/error.js";
import { CommandFlags, type DiscordManagerWithBot, GuildManagementAction } from "../../../../types/discord.js";
import { SuccessEmbed } from "../../../private/Embed.js";
import { replaceVariables } from "../../../../utils/stringUtils.js";
import type { ChatInputCommandInteraction } from "discord.js";

class SetRankCommand extends DiscordCommand<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("set-rank")
      .setDescription("Set rank of the given user.")
      .addStringOption((option) => option.setName("guild-member-username").setDescription("Minecraft Username").setRequired(true).setAutocomplete(true))
      .addStringOption((option) => option.setName("guild-rank").setDescription("In game rank").setRequired(true).setAutocomplete(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const username = interaction.options.getString("guild-member-username", true);
    const rank = interaction.options.getString("guild-rank", true);
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

export default SetRankCommand;
