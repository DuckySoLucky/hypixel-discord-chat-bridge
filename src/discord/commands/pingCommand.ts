import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandDataBuilder from "../private/commands/DiscordCommandDataBuilder.ts";
import Embed from "../private/Embed.js";
import type { ChatInputCommandInteractionWithGuild } from "../../types/discord.js";

class PingCommand extends DiscordCommand {
  override readonly data = new DiscordCommandDataBuilder().setName("ping").setDescription("Show the latency of the bot.");

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    const clientLatency = Date.now() - interaction.createdTimestamp;
    const apiLatency = interaction.client.ws.ping;

    await interaction.followUp({ embeds: [new Embed().setTitle("🏓 Pong!").setDescription(`Client Latency: \`${clientLatency}ms\`\nAPI Latency: \`${apiLatency}ms\``)] });
  }
}

export default PingCommand;
