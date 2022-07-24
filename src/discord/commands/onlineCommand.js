const { SlashCommandBuilder } = require('@discordjs/builders');
process.on('uncaughtException', function (err) {console.log(err.stack);});

module.exports = {
	data: new SlashCommandBuilder()
    .setName("online")
    .setDescription("(Bridge Bot) List of online members."),

    async execute(interaction, client, member) {
        bot.chat(`/g online`)
        await interaction.reply({ content: 'Command has been executed successfully.', ephemeral: true });
    }
}