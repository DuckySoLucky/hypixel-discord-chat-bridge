process.on('uncaughtException', function (err) {console.log(err.stack)})
const { SlashCommandBuilder } = require('@discordjs/builders')
const config = require('../../../config.json')

module.exports = {
	data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("(Bridge Bot) (Mod) Kick the given user from the Guild.")
    .addStringOption(option => option.setName("name").setDescription("Minecraft Username").setRequired(true))
    .addStringOption(option => option.setName("reason").setDescription("Reason").setRequired(true)),

    async execute(interaction, client, member) {
        if ((await member).roles.cache.has(config.discord.commandRole)) {
            const name = interaction.options.getString("name");
            const reason = interaction.options.getString("reason");
            bot.chat(`/g kick ${name} ${reason}`)
            await interaction.reply({ content: 'Command has been executed successfully.', ephemeral: true });
        } else {
            await interaction.reply({ content: 'You do not have permission to run this command.', ephemeral: true })
        }

    }
}

