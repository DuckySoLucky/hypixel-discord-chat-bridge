import Command from "../Private/Commands/Command.js";
import CommandData from "../Private/Commands/CommandData.js";
import Embed from "../Private/Embed.js";
import { CommandType, type DiscordManagerWithClient } from "../../Types/Discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

class RestartCommand extends Command {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new CommandData().setName("restart").setDescription("Restarts the bot.");
    this.type = CommandType.Staff;
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.followUp({ embeds: [new Embed().setTitle("Restarting...").setDescription("The bot is restarting. This might take few seconds.")] });
    this.discord.app.stop().then(() => this.discord.app.connect());
    await interaction.followUp({ embeds: [new Embed().setTitle("Success").setDescription("The bot has been restarted successfully.")] });
  }
}

export default RestartCommand;
