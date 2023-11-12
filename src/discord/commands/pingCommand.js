const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");

module.exports = {
  name: "ping",
  description: "Shows the latency of the bot.",

  execute: async (interaction) => {
    const clientLatency = Date.now() - interaction.createdTimestamp;
    const apiLatency = interaction.client.ws.ping;

    interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setColor(config.discord.other.colors.event)
          .setTitle("🏓 Pong!")
          .setDescription(`Client Latency: \`${clientLatency}ms\`\nAPI Latency: \`${apiLatency}ms\``)
          .setFooter({
            text: `by @duckysolucky | /help [command] for more information`,
            iconURL: "https://imgur.com/tgwQJTX.png",
          }),
      ],
    });
  },
};
