const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require("../../../config.json");
const Logger = require("../../Logger.js");

class StateHandler {
  constructor(discord) {
    this.discord = discord;
  }

  async onReady() {
    Logger.discordMessage("Client ready, logged in as " + this.discord.client.user.tag);
    this.discord.client.user.setPresence({
      activities: [{ name: `/help | by @duckysolucky` }],
    });

    const channel = await this.getChannel("Guild");
    if (channel === undefined) {
      return Logger.errorMessage(`Channel "Guild" not found!`);
    }

    if (config.tickets.enabled === true) {
      const supportChannel = this.discord.client.channels.cache.get(config.tickets.supportChannel);
      if (!supportChannel) {
        return Logger.errorMessage(`Support channel not found!`);
      }
      let messages = await supportChannel.messages.fetch({ limit: 100 });
      messages = messages
        .filter((msg) => msg.author.id === this.discord.client.user.id)
        .sort((a, b) => a.createdTimestamp - b.createdTimestamp);

      if (messages.size !== 1) {
        const supportEmbed = new EmbedBuilder()
          .setColor(3447003)
          .setTitle("Support Ticket System")
          .setDescription('Press "Open a Ticket!" to create a new ticket')
          .setFooter({
            text: `by @kathund. | /help [command] for more information`,
            iconURL: "https://i.imgur.com/uUuZx2E.png",
          });
        return await supportChannel.send({
          embeds: [supportEmbed],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder().setLabel("Open a Ticket!").setCustomId(`ticket.open`).setStyle(ButtonStyle.Primary),
            ),
          ],
        });
      }
    }

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
    if (channel === undefined) {
      return Logger.errorMessage(`Channel "Guild" not found!`);
    }

    await channel.send({
      embeds: [
        {
          author: { name: `Chat Bridge is Offline` },
          color: 15548997,
        },
      ],
    });
  }

  async getChannel(type) {
    if (typeof type !== "string" || type === undefined) {
      return Logger.errorMessage(`Channel type must be a string!`);
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
