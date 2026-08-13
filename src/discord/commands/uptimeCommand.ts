import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandDataBuilder from "../private/commands/DiscordCommandDataBuilder.js";
import EmbedHelper from "../private/EmbedHelper.ts";
import type { ChatInputCommandInteractionWithGuild } from "../../types/discord.js";

class UptimeCommand extends DiscordCommand {
  override readonly data = new DiscordCommandDataBuilder().setName("uptime").setDescription("Shows the uptime of the bot.");

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    await interaction.followUp({
      embeds: [new EmbedHelper().setDescription(`Online since <t:${Math.floor((Date.now() - interaction.client.uptime) / 1000)}:R>`).setTitle("🕐 Uptime!")]
    });
  }
}

export default UptimeCommand;
