const { SlashCommandBuilder } = require('@discordjs/builders');
process.on('uncaughtException', function (err) {console.log(err.stack);});
const config = require('../../../config.json')

module.exports = {
	data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("(Bridge Bot) (Mod) Mutes the given user for a given amount of time.")
    .addStringOption(option => option.setName("name").setDescription("Minecraft Username").setRequired(true))
    .addStringOption(option => option.setName("time").setDescription("Time").setRequired(true)),

    async execute(interaction, client, member) {
        if ((await member).roles.cache.has(config.discord.commandRole)) {
            const name = interaction.options.getString("name");
            const time = interaction.options.getString("time");
            bot.chat(`/g mute ${name} ${time}`)
            await interaction.reply({ content: 'Command has been executed successfully.', ephemeral: true });
        } else {
            await interaction.reply({ content: 'You do not have permission to run this command.', ephemeral: true })
        }

    }
}

