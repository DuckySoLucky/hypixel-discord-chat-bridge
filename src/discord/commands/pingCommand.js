const { EmbedBuilder: embedBuilder } = require("discord.js")

module.exports = {
  name: "ping",
  description: "Shows the latency of the bot.",

  execute: async (interaction, client) => {
    const embed = new embedBuilder()
      .setColor(0x0099FF)
      .setTitle("🏓 Pong!")
      .setDescription(`Latency: ${client.ws.ping}ms`)
      .setFooter({ text: `by DuckySoLucky#5181 | /help [command] for more information`, iconURL: 'https://imgur.com/tgwQJTX.png' })
      
    interaction.followUp({ embeds: [embed] })
  },
};