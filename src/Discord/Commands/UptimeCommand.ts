import Command from "../Private/Commands/Command.js";
import CommandData from "../Private/Commands/CommandData.js";
import Embed from "../Private/Embed.js";
import type { ChatInputCommandInteraction } from "discord.js";
import type { DiscordManagerWithClient } from "../../Types/Discord.js";

class UptimeCommand extends Command {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new CommandData().setName("uptime").setDescription("Shows the uptime of the bot.");
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.followUp({
      embeds: [new Embed().setDescription(`Online since <t:${Math.floor((Date.now() - interaction.client.uptime) / 1000)}:R>`).setTitle("🕐 Uptime!")]
    });
  }
}

export default UptimeCommand;
