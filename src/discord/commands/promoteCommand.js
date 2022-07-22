const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
process.on('uncaughtException', function (err) {console.log(err.stack);});
const config = require('../../../config.json')

module.exports = {
	data: new SlashCommandBuilder()
    .setName("promote")
    .setDescription("(Moderator Command) Promotes the given user by one guild rank.")
    .addStringOption(option => option.setName("name").setDescription("Username").setRequired(true)),

    async execute(interaction, client, member) {
        if ((await member).roles.cache.has(config.discord.commandRole)) {
            const name = interaction.options.getString("name");
            bot.chat(`/g promote ${name}`)
            await interaction.reply({ content: 'Command has been executed successfully.', ephemeral: true });
        } else {
            await interaction.reply({ content: 'You do not have permission to run this command.', ephemeral: true })
        }
        }
}