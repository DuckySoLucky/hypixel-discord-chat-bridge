process.on('uncaughtException', function (err) {console.log(err.stack);});
const { SlashCommandBuilder } = require('@discordjs/builders')  
const { toFixed } = require('../../contracts/helperFunctions')
const { MessageEmbed } = require("discord.js")
const config = require('../../../config.json')
const { version } = require('../../../package.json')
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Shows information about bot."),

    async execute(interaction, client, member) {

        let discordCommands = '', minecraftCommands = ''
        const discordCommandFiles = fs.readdirSync('src/discord/commands').filter(file => file.endsWith('.js'))
        for (const file of discordCommandFiles) {
            const command = require(`./${file}`)
            let discordOptions = ''
            for (let i = 0; i < command.data.options.length; i++) {
                if (command.data.options.length < 1) {
                    discordCommands += `- \`${command.data.name}${command.data.options[i].name != '' ? ` [${command.data.options[i].name}]\`\n` : `\`\n`}`
                } else {
                    for (let j = 0; j < command.data.options.length; j++) {
                        discordOptions += ` [${command.data.options[j].name}]`
                    }
                    discordCommands += `- \`${command.data.name}${discordOptions}\`\n`
                    break;
                }
                
            }  
        }
        for (let i = 0; i < minecraftCommandList.length; i++) {
            if (minecraftCommandList[i].options.length < 1) {
                minecraftCommands += `- \`${minecraftCommandList[i].name}${minecraftCommandList[i].options != '' ? ` [${minecraftCommandList[i].options}]\`\n` : `\`\n`}`
            } else {
                let options = ''
                for (let j = 0; j < minecraftCommandList[i].options.length; j++)  {
                    options+= ` [${minecraftCommandList[i].options[j]}]`
                }
                minecraftCommands += `- \`${minecraftCommandList[i].name}${options}\`\n`
            }  
        }

        const helpMenu = new MessageEmbed()
            .setColor(0x0099FF)
            .setTitle('Hypixel Bridge Bot Commands')
            .addFields(
                { name: '**Minecraft Commands**: ', value: `${minecraftCommands}`, inline: true },
                { name: '**Discord Commands**: ', value: `${discordCommands}`, inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: '**Minecraft Information**:', value: `Bot: \`${bot.username}\`\nPrefix: \`${config.minecraft.prefix}\`\nUptime: Online since <t:${toFixed(uptime/1000, 0)}:R>\nVersion: \`${version}\``, inline: true },
                { name: `**Discord Information**`, value: `Guild Channel: <#${config.discord.guildChatChannel}>\nOfficer Channel: <#${config.discord.officerChannel}>\nGuild Logs Channel: <#${config.discord.loggingChannel}>\nCommand Role: <@&${config.discord.commandRole}>\nMessage Mode: \`${config.discord.messageMode}\`\nFilter: \`${config.discord.filterMessages}\`\nJoin Messages: \`${config.discord.joinMessage}\``, inline: true },
            )
            .setFooter({ text: 'by DuckySoLucky#5181 | /help [command] for more information', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' })
        await interaction.reply({ embeds: [helpMenu] })
    }
}