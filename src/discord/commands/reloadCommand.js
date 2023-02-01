const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest')
const config = require('../../config.json')
const { Routes } = require('discord-api-types/v9')


module.exports = {
  name: 'reload',
  description: 'Reloads all the commands',
  execute: async (interaction) => {
    if ((await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.commandRole)) {
        const commands = []
        const _commandFiles = fs.readdirSync(path.join(__dirname,)).filter(file => file.endsWith('.js'));

        for (const file of _commandFiles) {
            delete require.cache[require.resolve(`./${file}`)];
            const command = require(`./${file}`);
            commands.push(command)
        }
        const rest = new REST({ version: '10' }).setToken(config.discord.token)
        rest.put(Routes.applicationGuildCommands(config.discord.clientID, config.discord.serverID), { body: commands }).catch(console.error);
        interaction.reply({ content: 'All commands have been reloaded!', ephemeral: true });
        console.log('All commands have been reloaded!')

    } else {
        interaction.reply({ content: `You do not have permission to run this command!`, ephemeral: true})
    }
  }
};