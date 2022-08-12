const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
	data: new SlashCommandBuilder()
    .setName("online")
    .setDescription("(Bridge Bot) List of online members."),

    async execute(interaction, client, member) {
        bot.chat(`/g online`)
        await interaction.reply({ content: 'Command has been executed successfully.', ephemeral: true });
    }
}