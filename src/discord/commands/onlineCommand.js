const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
process.on('uncaughtException', function (err) {console.log(err.stack);});

module.exports = {
	data: new SlashCommandBuilder()
    .setName("online")
    .setDescription("List of online members."),

    async execute(interaction, client, member) {
        bot.chat(`/g online`)
        await interaction.reply({ content: 'Command has been executed successfully.', ephemeral: true });
    }
}