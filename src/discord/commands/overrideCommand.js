const { SlashCommandBuilder } = require('@discordjs/builders');
process.on('uncaughtException', function (err) {console.log(err.stack)})
const { MessageEmbed } = require('discord.js')
const config = require('../../../config.json')

module.exports = {
	data: new SlashCommandBuilder()
    .setName("override")
    .setDescription("(Bridge Bot) (Mod) Executes commands as the minecraft bot.")
    .addStringOption(option => option.setName("command").setDescription("Minecraft Command").setRequired(true)),

    async execute(interaction, client, member) {
        if ((await member).roles.cache.has(config.discord.commandRole)) {
            const command = interaction.options.getString("command");
            bot.chat(`/${command}`)
            const commandMessage = new MessageEmbed()
                .setColor('#00FF00')
                .setTitle('Command has been executed successfully')
                .setDescription(`\`/${command}\`\n`)
                .setFooter({ text: 'by DuckySoLucky#5181', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' })
            await interaction.reply({ embeds: [commandMessage], ephemeral: true  })
        } else {
            await interaction.reply({ content: 'You do not have permission to run this command.', ephemeral: true })
        }
    }
}