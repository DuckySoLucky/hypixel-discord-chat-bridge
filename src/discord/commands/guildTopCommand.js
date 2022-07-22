const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
process.on('uncaughtException', function (err) {console.log(err.stack);});

module.exports = {
	data: new SlashCommandBuilder()
    .setName("guildtop")
    .setDescription("Top 10 members with the most guild experience.")
    .addStringOption(option => option.setName("time").setDescription("Days").setRequired(false)),

    async execute(interaction, client, member) {
        const time = interaction.options.getString("time");
        bot.chat(`/g top ${time ? time : ''}`)
        await interaction.reply({ content: 'Command has been executed successfully.', ephemeral: true });
    }
}