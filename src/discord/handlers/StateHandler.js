const config = require("../../../config.json");

class StateHandler {
  constructor(discord) {
    this.discord = discord;
  }

  async onReady() {
    console.discord("Client ready, logged in as " + this.discord.client.user.tag);
    this.discord.client.user.setPresence({
      activities: [{ name: `/help | by @duckysolucky` }]
    });

    global.guild = await client.guilds.fetch(config.discord.bot.serverID);
    console.discord(`Guild ready, successfully fetched ${guild.name}`);

    const channel = await this.getChannel("Guild");
    if (channel === undefined) {
      return console.error(`Channel "Guild" not found!`);
    }

    if (config.verification.autoRoleUpdater.enabled) require("../other/updateUsers.js");
    if (config.statsChannels.enabled) require("../other/statsChannels.js");

    channel.send({
      embeds: [
        {
          author: { name: `Chat Bridge is Online` },
          color: 2067276
        }
      ]
    });
  }

  async onClose() {
    const channel = await this.getChannel("Guild");
    if (channel === undefined) {
      return console.error(`Channel "Guild" not found!`);
    }

    await channel.send({
      embeds: [
        {
          author: { name: `Chat Bridge is Offline` },
          color: 15548997
        }
      ]
    });
  }

  async getChannel(type) {
    if (typeof type !== "string" || type === undefined) {
      console.error(`Channel type must be a string! Received: ${type}`);
      return;
    }

    switch (type.replace(/§[0-9a-fk-or]/g, "").trim()) {
      case "Guild":
        return this.discord.client.channels.cache.get(config.discord.channels.guildChatChannel);
      case "Officer":
        return this.discord.client.channels.cache.get(config.discord.channels.officerChannel);
      case "Logger":
        return this.discord.client.channels.cache.get(config.discord.channels.loggingChannel);
      default:
        return this.discord.client.channels.cache.get(config.discord.channels.debugChannel);
    }
  }
}

module.exports = StateHandler;
