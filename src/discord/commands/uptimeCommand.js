const { SlashCommandBuilder } = require("discord.js");
const { Embed } = require("../../contracts/embedHandler.js");

module.exports = {
  data: new SlashCommandBuilder().setName("uptime").setDescription("Shows the uptime of the bot."),

  execute: async (interaction) => {
    const uptimeEmbed = new Embed().setDescription(`Online since <t:${Math.floor((Date.now() - interaction.client.uptime) / 1000)}:R>`).setTitle("🕐 Uptime!");

    interaction.followUp({ embeds: [uptimeEmbed] });
  }
};
