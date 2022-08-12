
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../../../config.json')

module.exports = {
	data: new SlashCommandBuilder()
    .setName("demote")
    .setDescription("(Bridge Bot) (Mod) Demotes the given user by one guild rank.")
    .addStringOption(option => option.setName("name").setDescription("Minecraft Username").setRequired(true)),

    async execute(interaction, client, member) {
        if ((await member).roles.cache.has(config.discord.commandRole)) {
            const name = interaction.options.getString("name");
            bot.chat(`/g demote ${name}`)
            await interaction.reply({ content: 'Command has been executed successfully.', ephemeral: true })
        } else {
            await interaction.reply({ content: 'You do not have permission to run this command.', ephemeral: true })
        }
    }
}