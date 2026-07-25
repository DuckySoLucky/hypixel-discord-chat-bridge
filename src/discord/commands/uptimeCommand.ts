import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandData from "../private/commands/DiscordCommandData.js";
import Embed from "../private/Embed.js";
import type { ChatInputCommandInteraction } from "discord.js";
import type { DiscordManagerWithClient } from "../../types/discord.js";

class UptimeCommand extends DiscordCommand {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordCommandData().setName("uptime").setDescription("Shows the uptime of the bot.");
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    await interaction.followUp({
      embeds: [new Embed().setDescription(`Online since <t:${Math.floor((Date.now() - interaction.client.uptime) / 1000)}:R>`).setTitle("🕐 Uptime!")]
    });
  }
}

export default UptimeCommand;
