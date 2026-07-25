import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandData from "../private/commands/DiscordCommandData.js";
import Embed from "../private/Embed.js";
import type { ChatInputCommandInteraction } from "discord.js";
import type { DiscordManagerWithClient } from "../../types/discord.js";

class PingCommand extends DiscordCommand {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordCommandData().setName("ping").setDescription("Show the latency of the bot.");
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const clientLatency = Date.now() - interaction.createdTimestamp;
    const apiLatency = interaction.client.ws.ping;

    await interaction.followUp({ embeds: [new Embed().setTitle("🏓 Pong!").setDescription(`Client Latency: \`${clientLatency}ms\`\nAPI Latency: \`${apiLatency}ms\``)] });
  }
}

export default PingCommand;
