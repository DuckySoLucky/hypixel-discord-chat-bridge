const DiscordCommand = require('../../contracts/DiscordCommand')

const { version } = require('../../../package.json')

class HelpCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)

    this.name = 'help'
    this.aliases = ['h', 'info']
    this.description = 'Shows this help menu'
  }

  onCommand(message) {
    let discordCommands = []
    let minecraftCommands = []

    this.discord.messageHandler.command.commands.forEach(command => {
      discordCommands.push(`\`${command.name}\`: ${command.description}`)
    })

    this.discord.app.minecraft.chatHandler.command.commands.forEach(command => {
      minecraftCommands.push(`\`${command.name}\`: ${command.description}`)
    })

    message.channel.send({
      embed: {
        title: 'Help',
        description: ['`< >` = Required arguments', '`[ ]` = Optional arguments'].join('\n'),
        fields: [
          {
            name: 'Discord Commands',
            value: discordCommands.join('\n')
          },
          {
            name: 'Minecraft Commands',
            value: minecraftCommands.join('\n')
          },
          {
            name: `Info`,
            value: [
              `Prefix: \`${this.discord.app.config.discord.prefix}\``,
              `Guild Channel: <#${this.discord.app.config.discord.guildChatChannel}>`,
              `Officer Channel: <#${this.discord.app.config.discord.officerChannel}>`,
              `Logging Channel: <#${this.discord.app.config.discord.loggingChannel}>`,
              `Command Role: <@&${this.discord.app.config.discord.commandRole}>`,
              `Version: \`1.7\``,
            ].join('\n'),
          }
        ],
        color: message.guild.me.displayHexColor,
        footer: {
          text: 'Made by DuckySoLucky'
        },
        timestamp: new Date()
      }
    }).then(helpMessage => {
      helpMessage.delete({ timeout: 30000 })
    })
  }
}

module.exports = HelpCommand
