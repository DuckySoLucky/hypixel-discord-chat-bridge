const { ActivityType } = require("discord.js");
const config = require("../../../config.json");
const Logger = require("../../Logger");

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
    const channel = await getChannel("Guild");
    global.bridgeChat = config.discord.guildChatChannel;
    global.uptime = new Date().getTime();

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
    const channel = await getChannel("Guild");
    channel.send({
      embeds: [
        {
          author: { name: `Chat Bridge is Offline` },
          color: 15548997,
        },
      ],
    });
  }
}

async function getChannel(type) {
  if (type == "Officer") {
    return client.channels.fetch(config.discord.officerChannel);
  } else if (type == "Logger") {
    return client.channels.fetch(config.discord.loggingChannel);
  } else if (type == "debugChannel") {
    return client.channels.fetch(config.console.debugChannel);
  } else {
    return client.channels.fetch(config.discord.guildChatChannel);
  }
}

module.exports = StateHandler;
