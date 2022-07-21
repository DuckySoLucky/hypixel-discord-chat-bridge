const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
process.on('uncaughtException', function (err) {console.log(err.stack);});
const config = require('../../../config.json')

module.exports = {
	data: new SlashCommandBuilder()
    .setName("override")
    .setDescription("(Moderator Command) executes commands as the minecraft bot.")
    .addStringOption(option => option.setName("command").setDescription("Command").setRequired(true)),

    async execute(interaction, client, member) {
        if ((await member).roles.cache.has(config.discord.commandRole)) {
            const command = interaction.options.getString("command");
            bot.chat(`/${command}`)
            await interaction.reply({ content: 'Command has been executed successfully.', ephemeral: true });
        } else {
            await interaction.reply({ content: 'You do not have permission to run this command.', ephemeral: true })
        }
    }
}