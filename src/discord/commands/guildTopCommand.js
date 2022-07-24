const { SlashCommandBuilder } = require('@discordjs/builders');
process.on('uncaughtException', function (err) {console.log(err.stack);});

module.exports = {
	data: new SlashCommandBuilder()
    .setName("guildtop")
    .setDescription("(Bridge Bot) Top 10 members with the most guild experience.")
    .addStringOption(option => option.setName("time").setDescription("Days Ago").setRequired(false)),

    async execute(interaction, client, member) {
        const time = interaction.options.getString("time");
        bot.chat(`/g top ${time ? time : ''}`)
        await interaction.reply({ content: 'Command has been executed successfully.', ephemeral: true });
    }
}