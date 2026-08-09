import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandData from "../private/commands/DiscordCommandData.js";
import Embed from "../private/Embed.js";
import { CommandFlags } from "../../types/discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

class RestartCommand extends DiscordCommand {
  override readonly data = new DiscordCommandData().setName("restart").setDescription("Restarts the bot.");
  override flags = [CommandFlags.StaffOnly];

  override async execute(interaction: ChatInputCommandInteraction) {
    await interaction.followUp({
      embeds: [new Embed().setAuthor({ name: "Restarting..." }).setDescription("The bot is restarting. This might take few seconds.").setDevFooter("GeorgeFilos")]
    });
    await this.discord.application.stop();
    await this.discord.application.start();
    console.discord(`The application restart requested by ${interaction.user.username} completed successfully.`);
  }
}

export default RestartCommand;
