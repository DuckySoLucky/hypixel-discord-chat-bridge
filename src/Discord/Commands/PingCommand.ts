import Command from "../Private/Commands/Command.js";
import CommandData from "../Private/Commands/CommandData.js";
import Embed from "../Private/Embed.js";
import type { ChatInputCommandInteraction } from "discord.js";
import type { DiscordManagerWithClient } from "../../Types/Discord.js";

class PingCommand extends Command {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new CommandData().setName("ping").setDescription("Show the latency of the bot.");
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const clientLatency = Date.now() - interaction.createdTimestamp;
    const apiLatency = interaction.client.ws.ping;

    await interaction.followUp({ embeds: [new Embed().setTitle("🏓 Pong!").setDescription(`Client Latency: \`${clientLatency}ms\`\nAPI Latency: \`${apiLatency}ms\``)] });
  }
}

export default PingCommand;
