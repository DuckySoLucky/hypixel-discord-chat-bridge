const { toFixed } = require('../../contracts/helperFunctions.js')
const { EmbedBuilder: embedBuilder } = require("discord.js");

module.exports = {
    name: "uptime",
    description: "Shows the uptime of the bot.",

    execute: async (interaction, client) => {
        const uptimeEmbed = new embedBuilder()
            .setColor(0x0099FF)
            .setTitle("🕐 Uptime!")
            .setDescription(`Online since <t:${toFixed(uptime/1000, 0)}:R>`)
            .setFooter({ text: `by DuckySoLucky#5181 | /help [command] for more information`, iconURL: 'https://imgur.com/tgwQJTX.png' })

        interaction.followUp({ embeds: [ uptimeEmbed ] })
    }
}