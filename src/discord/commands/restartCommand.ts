import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandData from "../private/commands/DiscordCommandData.js";
import Embed, { SuccessEmbed } from "../private/Embed.js";
import { CommandFlags, type DiscordManagerWithClient } from "../../types/discord.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { ChatInputCommandInteraction } from "discord.js";

class RestartCommand extends DiscordCommand {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordCommandData().setName("restart");
    this.flags = [CommandFlags.StaffOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    await interaction.followUp({
      embeds: [
        new Embed()
          .setAuthor({ name: translate("discord.commands.restart.execute.success.restarting.embed.author") })
          .setDescription(translate("discord.commands.restart.execute.success.restarting.embed.description"))
          .setDevFooter("GeorgeFilos")
      ]
    });
    this.discord.application
      .stop()
      .then(() =>
        this.discord.application
          .connect()
          .then(() =>
            interaction.followUp({
              embeds: [new SuccessEmbed().setDescription(translate("discord.commands.restart.execute.success.restarted.embed.description")).setDevFooter("GeorgeFilos")]
            })
          )
      );
  }
}

export default RestartCommand;
