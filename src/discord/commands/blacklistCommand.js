process.on('uncaughtException', function (err) {console.log(err.stack)})
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../../../config.json')

module.exports = {
	data: new SlashCommandBuilder()
    .setName("blacklist")
    .setDescription("(Bridge Bot) (Mod) Demotes the given user by one guild rank.")
    .addStringOption(option => option.setName("arg").setDescription("Add or Remove").setRequired(true))
    .addStringOption(option => option.setName("name").setDescription("Minecraft Username").setRequired(true)),

    async execute(interaction, client, member) {
        if ((await member).roles.cache.has(config.discord.commandRole)) {
            const name = interaction.options.getString("name");
            const arg = interaction.options.getString("arg");
            if (arg.toLowerCase() == "add") {
                bot.chat(`/ignore add ${name}`); 
                await interaction.reply({ content: 'Command has been executed successfully.', ephemeral: true })
            } else if (arg.toLowerCase() == "remove") {
                bot.chat(`/ignore remove ${name}`); 
                await interaction.reply({ content: 'Command has been executed successfully.', ephemeral: true })
            } else {
                await interaction.reply({ content: 'Invalid Usage: \`/ignore [add/remove] [name]\`.', ephemeral: true })
            }
        } else {
            await interaction.reply({ content: 'You do not have permission to run this command.', ephemeral: true })
        }
    }
}