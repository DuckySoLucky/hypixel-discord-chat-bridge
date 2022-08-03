process.on('uncaughtException', function (err) {console.log(err.stack)})
const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const config = require('../../../config.json')
const fs = require('fs')

module.exports = {
	data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows help menu.")
    .addStringOption(option => option.setName("command").setDescription("Get information about a specific command").setRequired(false)),

    async execute(interaction, client, member) {
        const commandName = interaction.options.getString("command")
        if (!commandName) {
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
                .setDescription('() = required argument, [] = optional argument')
                .addFields(
                    { name: '**Minecraft**: ', value: `${minecraftCommands}`, inline: true },
                    { name: '**Discord**: ', value: `${discordCommands}`, inline: true },
                )
                .setFooter({ text: 'by DuckySoLucky#5181 | /help [command] for more information', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' })
            await interaction.reply({ embeds: [helpMenu] })
        } else {
            let options = '', found = false;
            // Discord Commands
            const discordCommandFiles = fs.readdirSync('src/discord/commands').filter(file => file.endsWith('.js'))
            for (const file of discordCommandFiles) {
                const command = require(`./${file}`)
                for (let i = 0; i < command.data.options.length; i++) {
                    if (command.data.name === commandName) {
                        found = true
                        const name = command.data.description
                        if (command.data.options.length <= 1) {
                            options += `${command.data.options[i].name != '' ? `\`[${command.data.options[i].name}]\`:` : ``}${command.data.options[i].description != '' ? ` ${command.data.options[i].description}` : ``}`
                        } else {
                            for (let j = 0; j < command.data.options.length; j++) {
                                options += `${command.data.options[j].name != '' ? `\`[${command.data.options[j].name}]\`:` : ``}${command.data.options[j].description != '' ? ` ${command.data.options[j].description}\n` : ``}`
                            }
                        }
                        const commandData = new MessageEmbed()
                            .setColor(0x0099FF)
                            .setTitle(`**${config.minecraft.prefix}${command.data.name}**`)
                            .setDescription(name + '\n')
                            .addFields(
                                { name: '**Options** ', value: `${options}`, inline: true },
                            )
                            .setFooter({ text: 'by DuckySoLucky#5181 | () = required, [] = optional', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' })
                        await interaction.reply({ embeds: [commandData] })
                        break;
                    }
                }  
            }
            if (found) return
            // Minecraft Commands
            for (let i = 0; i < minecraftCommandList.length; i++) {
                if (minecraftCommandList[i].name === commandName) {
                    found = true;
                    if (minecraftCommandList[i].options.length <= 1) {
                        options += `${minecraftCommandList[i].options != '' ? `\`[${minecraftCommandList[i].options}]\`:` : ``}${minecraftCommandList[i].optionsDescription != '' ? ` ${minecraftCommandList[i].optionsDescription}` : ``}`
                    } else {
                        for (let j = 0; j < minecraftCommandList[i].options.length; j++)  {
                            options += `${minecraftCommandList[i].options[j] != '' ? `\`[${minecraftCommandList[i].options[j]}]\`:` : ``}${minecraftCommandList[i].optionsDescription[j] != '' ? ` ${minecraftCommandList[i].optionsDescription[j]}\n` : ``}`
                        }
                    } 
                    const commandData = new MessageEmbed()
                        .setColor(0x0099FF)
                        .setTitle(`**${config.minecraft.prefix}${minecraftCommandList[i].name}**`)
                        .setDescription(minecraftCommandList[i].description + '\n')
                        .addFields(
                            { name: '**Options** ', value: `${options}`, inline: true },
                        )
                        .setFooter({ text: 'by DuckySoLucky#5181 | () = required, [] = optional', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' })
                    await interaction.reply({ embeds: [commandData] })
                    break;
                }
            }
            if (found) return
            if (!found) {
                const errorEmbed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setTitle('Error')
                    .setDescription(`Command \`${commandName}\` was not found`)
                    .setFooter({ text: 'by DuckySoLucky#5181', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' })
                await interaction.reply({ embeds: [errorEmbed] })
            }

        }
            


    }
}