const Logger = require('../.././Logger')

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;
        
            try {
                Logger.discordMessage(`${interaction.user.username} - [${interaction.commandName}]`)
                await command.execute(interaction, interaction.client, interaction.guild.members.fetch(interaction.user));
            } catch (error) {
                console.log(error)
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
};