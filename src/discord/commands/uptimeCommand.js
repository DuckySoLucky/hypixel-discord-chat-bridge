const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "uptime",
  description: "Shows the uptime of the bot.",

  execute: async (interaction) => {
    const uptimeEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("🕐 Uptime!")
      .setDescription(`Online since <t:${Math.floor((Date.now() - interaction.client.uptime) / 1000)}:R>`)
      .setFooter({
        text: `/help [command] for more information`,
        iconURL: "https://i.imgur.com/vt9IRtV.png",
      });

    interaction.followUp({ embeds: [uptimeEmbed] });
  },
};
