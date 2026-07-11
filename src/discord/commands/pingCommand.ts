import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandData from "../private/commands/DiscordCommandData.js";
import Embed from "../private/Embed.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { ChatInputCommandInteraction } from "discord.js";
import type { DiscordManagerWithClient } from "../../types/discord.js";

class PingCommand extends DiscordCommand {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordCommandData().setName("ping");
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const clientLatency = Date.now() - interaction.createdTimestamp;
    const apiLatency = interaction.client.ws.ping;
    await interaction.followUp({
      embeds: [
        new Embed()
          .setDescription(translate("discord.commands.ping.execute.success.embed.description", { clientLatency, apiLatency }))
          .setTitle(translate("discord.commands.ping.execute.success.embed.title"))
      ]
    });
  }
}

export default PingCommand;
