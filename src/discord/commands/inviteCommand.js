const { SlashCommandBuilder } = require('@discordjs/builders');
process.on('uncaughtException', function (err) {console.log(err.stack)})
const config = require('../../../config.json')

module.exports = {
	data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("(Bridge Bot) (Mod) Invites the given user to the guild.")
    .addStringOption(option => option.setName("name").setDescription("Minecraft Username").setRequired(true)),

    async execute(interaction, client, member) {
        if ((await member).roles.cache.has(config.discord.commandRole)) {
            const name = interaction.options.getString("name");
            bot.chat(`/g invite ${name}`)
            await interaction.reply({ content: 'Command has been executed successfully.', ephemeral: true });
        } else {
            await interaction.reply({ content: 'You do not have permission to run this command.', ephemeral: true })
        }
    }
}

