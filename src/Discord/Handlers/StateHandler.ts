import HypixelDiscordChatBridgeError from "../../Private/Error.js";
import type DiscordManager from "../DiscordManager.js";
import type { Channel } from "discord.js";
import type { ChannelNames } from "../../Types/Discord.js";

class StateHandler {
  readonly discord: DiscordManager;
  constructor(discordManager: DiscordManager) {
    this.discord = discordManager;
  }

  async loadGuild() {
    if (!this.discord.isClientOnline()) throw new HypixelDiscordChatBridgeError("The discord bot doesn't seam to be online? Please restart the application");
    this.discord.guild = await this.discord.client.guilds.fetch(this.discord.app.config.discord.bot.serverID);
    console.discord(`Guild ready, successfully fetched ${this.discord.guild.name}`);
  }

  async onReady() {
    if (!this.discord.isClientOnline() || !this.discord.client.user) return;
    console.discord(`Client ready, logged in as ${this.discord.client.user?.username} (${this.discord.client.user?.id})!`);
    this.discord.client.user.setPresence({ activities: [{ name: "/help | by @duckysolucky" }] });

    await this.loadGuild();

    const channel = await this.getChannel("Guild");
    if (channel === null || !channel.isSendable()) return console.error('Channel "Guild" not found!');
    channel.send({ embeds: [{ author: { name: "Chat Bridge is Online" }, color: 2067276 }] });
  }

  async onClose() {
    const channel = await this.getChannel("Guild");
    if (channel === null || !channel.isSendable()) return console.error('Channel "Guild" not found!');
    await channel.send({ embeds: [{ author: { name: "Chat Bridge is Offline" }, color: 15548997 }] });
  }

  async getChannel(type: ChannelNames): Promise<Channel | null> {
    if (!this.discord.isClientOnline()) return null;
    switch (type.replace(/§[0-9a-fk-or]/g, "").trim()) {
      case "Guild":
        return await this.discord.client.channels.fetch(this.discord.app.config.discord.channels.guildChatChannel);
      case "Officer":
        return await this.discord.client.channels.fetch(this.discord.app.config.discord.channels.officerChannel);
      case "Logger":
        return await this.discord.client.channels.fetch(this.discord.app.config.discord.channels.loggingChannel);
      default:
        return await this.discord.client.channels.fetch(this.discord.app.config.discord.channels.debugChannel);
    }
  }
}

export default StateHandler;
