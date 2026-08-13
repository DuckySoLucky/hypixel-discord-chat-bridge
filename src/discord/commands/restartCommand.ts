import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandData from "../private/commands/DiscordCommandData.js";
import Embed from "../private/Embed.js";
import { type ChatInputCommandInteractionWithGuild, CommandPermission } from "../../types/discord.js";

class RestartCommand extends DiscordCommand {
  override readonly data = new DiscordCommandData().setName("restart").setDescription("Restarts the bot.");
  override readonly permission = CommandPermission.StaffOnly;

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    await interaction.followUp({
      embeds: [new Embed().setAuthor({ name: "Restarting..." }).setDescription("The bot is restarting. This might take few seconds.").setDevFooter("GeorgeFilos")]
    });
    await this.discord.application.stop();
    await this.discord.application.start();
    console.discord(`The application restart requested by ${interaction.user.username} completed successfully.`);
  }
}

export default RestartCommand;
