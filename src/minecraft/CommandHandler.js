const fs = require('fs')
const { Collection } = require('discord.js-light')

class CommandHandler {
  constructor(minecraft) {
    this.minecraft = minecraft

    this.prefix = '!'
    this.commands = new Collection()

    let commandFiles = fs.readdirSync('./src/minecraft/commands').filter(file => file.endsWith('.js'))
    for (const file of commandFiles) {
      const command = new (require(`./commands/${file}`))(minecraft)

      this.commands.set(command.name, command)
    }
  }

  handle(player, message) {
    if (!message.startsWith(this.prefix)) {
      return false
    }

    let args = message.slice(this.prefix.length).trim().split(/ +/)
    let commandName = args.shift().toLowerCase()

    let command = this.commands.get(commandName)
      || this.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

    if (!command) {
      return false
    }

    this.minecraft.app.log.minecraft(`${player} - [${command.name}] ${message}`)
    command.onCommand(player, message)

    return true
  }
}

module.exports = CommandHandler
