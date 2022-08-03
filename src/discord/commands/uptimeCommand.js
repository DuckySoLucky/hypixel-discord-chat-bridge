process.on('uncaughtException', function (err) {console.log(err.stack);});
const { SlashCommandBuilder } = require('@discordjs/builders')  
const { toFixed } = require('../../contracts/helperFunctions')
const { MessageEmbed } = require("discord.js")
const config = require('../../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Shows the uptime of the bot."),

    async execute(interaction, client, member) {
        const uptimeembed = new MessageEmbed()
            .setTitle("Hypixel Bridge Bot | Uptime")
            .setDescription(`🕐 **System Uptime**\n Online since <t:${toFixed(uptime/1000, 0)}:R>`)
            .setColor('#18191c')
        interaction.reply({embeds: [uptimeembed], ephemeral: true })
    }
}