const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");

module.exports = {
  name: `${config.minecraft.guild.guildName}-uptime`,
  description: "Shows the uptime of the bot.",

  execute: async (interaction) => {
    const uptimeEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("🕐 Uptime!")
      .setDescription(`Online since <t:${Math.floor((Date.now() - interaction.client.uptime) / 1000)}:R>`)
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    interaction.followUp({ embeds: [uptimeEmbed] });
  },
};
