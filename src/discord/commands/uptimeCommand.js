const { Embed } = require("../../contracts/embedHandler.js");

module.exports = {
  name: "uptime",
  description: "Shows the uptime of the bot.",

  execute: async (interaction) => {
    const uptimeEmbed = new Embed().setDescription(`Online since <t:${Math.floor((Date.now() - interaction.client.uptime) / 1000)}:R>`).setTitle("🕐 Uptime!");

    interaction.followUp({ embeds: [uptimeEmbed] });
  }
};
