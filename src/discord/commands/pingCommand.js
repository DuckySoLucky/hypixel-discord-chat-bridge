const { SlashCommandBuilder } = require("discord.js");
const { Embed } = require("../../contracts/embedHandler.js");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Show the latency of the bot."),

  execute: async (interaction) => {
    const clientLatency = Date.now() - interaction.createdTimestamp;
    const apiLatency = interaction.client.ws.ping;

    const embed = new Embed().setTitle("🏓 Pong!").setDescription(`Client Latency: \`${clientLatency}ms\`\nAPI Latency: \`${apiLatency}ms\``);

    await interaction.followUp({ embeds: [embed] });
  }
};
