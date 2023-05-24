/*eslint-disable */
const { ActivityType } = require("discord.js");
const config = require("../../../config.json");
const Logger = require("../../Logger.js");
/*eslint-enable */

class StateHandler {
  constructor(discord) {
    this.discord = discord;
  }

  async onReady() {
    Logger.discordMessage("Client ready, logged in as " + this.discord.client.user.tag);
    this.discord.client.user.setPresence({
      activities: [
        { name: `/help | by DuckySoLucky#5181`, type: ActivityType.Playing },
      ],
    });
    const channel = await this.getChannel("Guild");
    global.bridgeChat = config.discord.channels.guildChatChannel;

    channel.send({
      embeds: [
        {
          author: { name: `Chat Bridge is Online` },
          color: 2067276,
        },
      ],
    });
  }

  async onClose() {
    const channel = await this.getChannel("Guild");
    channel.send({
      embeds: [
        {
          author: { name: `Chat Bridge is Offline` },
          color: 15548997,
        },
      ],
    });
  }

  async getChannel(type) {
    if (type == "Officer") {
      return client.channels.fetch(config.discord.channels.officerChannel);
    } else if (type == "Logger") {
      return client.channels.fetch(config.discord.channels.loggingChannel);
    } else if (type == "debugChannel") {
      return client.channels.fetch(config.discord.channels.debugChannel);
    } else {
      return client.channels.fetch(config.discord.channels.guildChatChannel);
    }
  }
}

module.exports = StateHandler;
