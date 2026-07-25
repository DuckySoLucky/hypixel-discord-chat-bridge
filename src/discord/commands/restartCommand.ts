import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandData from "../private/commands/DiscordCommandData.js";
import Embed, { SuccessEmbed } from "../private/Embed.js";
import { CommandFlags, type DiscordManagerWithClient } from "../../types/discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

class RestartCommand extends DiscordCommand {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordCommandData().setName("restart").setDescription("Restarts the bot.");
    this.flags = [CommandFlags.StaffOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    await interaction.followUp({
      embeds: [new Embed().setAuthor({ name: "Restarting..." }).setDescription("The bot is restarting. This might take few seconds.").setDevFooter("GeorgeFilos")]
    });
    this.discord.application
      .stop()
      .then(() =>
        this.discord.application
          .connect()
          .then(() => interaction.followUp({ embeds: [new SuccessEmbed().setDescription("The bot has been restarted successfully.").setDevFooter("GeorgeFilos")] }))
      );
  }
}

export default RestartCommand;
