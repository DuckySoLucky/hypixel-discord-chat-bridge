const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");

module.exports = {
  name: "uptime",
  description: "Shows the uptime of the bot.",

  execute: async (interaction) => {
    interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setColor(config.discord.other.colors.event)
          .setTitle("🕐 Uptime!")
          .setDescription(`Online since <t:${Math.floor((Date.now() - interaction.client.uptime) / 1000)}:R>`)
          .setFooter({
            text: `by @duckysolucky | /help [command] for more information`,
            iconURL: "https://imgur.com/tgwQJTX.png",
          }),
      ],
    });
  },
};
