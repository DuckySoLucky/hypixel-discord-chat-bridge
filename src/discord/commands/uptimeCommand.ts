import BlacklistCommand from "./blacklistCommand.js";
import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandData from "../private/commands/DiscordCommandData.js";
import Embed from "../private/Embed.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { ChatInputCommandInteraction } from "discord.js";
import type { DiscordManagerWithClient } from "../../types/discord.js";

class UptimeCommand extends DiscordCommand {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordCommandData().setName("uptime");
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    await interaction.followUp({
      embeds: [
        new Embed()
          .setDescription(
            translate("discord.commands.uptime.execute.success.embed.description", { timestamp: Math.floor((Date.now() - interaction.client.uptime) / 1000) })
          )
          .setTitle(translate("discord.commands.uptime.execute.success.embed.title"))
      ]
    });

    const channel = await this.discord.getChannel("Logger-Blacklist");
    if (!channel || !channel.isSendable()) return;
    const c = await channel.messages.fetch("1517381048739303595");
    const blacklistCommand = new BlacklistCommand(this.discord);
    const blacklistUser = await blacklistCommand.getBlacklistedFromLinkedEmbed(c);
    if (!blacklistUser) throw new HypixelDiscordChatBridgeError(translate("blacklist.errors.failed.find"));
    await c.edit(await this.discord.application.data.blacklist.getBlacklistDataResponse(blacklistUser));
  }
}

export default UptimeCommand;
