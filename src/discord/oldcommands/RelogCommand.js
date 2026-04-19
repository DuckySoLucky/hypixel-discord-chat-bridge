const DiscordCommand = require('../../contracts/DiscordCommand')

const config = require("../../../config.json");

class RelogCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)
    this.permission = "mod"

    this.name = 'relog'
    this.aliases = ['r']
    this.description = 'Relogs the minecraft client after a given period of time'
  }

  onCommand(message) {
    let args = this.getArgs(message)

    if (args.length == 0) {
      return this.relogWithDelay(message)
    }

    let delay = parseInt(args.pop())
    if (isNaN(delay)) {
      return message.reply('Relog delay must be a number between 5 and 300!')
    }

    delay = Math.min(Math.max(delay, 5), 300)

    return this.relogWithDelay(message, delay)
  }

  relogWithDelay(message, delay = 0) {
    
    message.reply(`Stopping the bot in ${delay == 0 ? 5 : delay} seconds.`)
    setTimeout(() => {
        process.exit()
    }, delay * 1000)
  }
}

module.exports = RelogCommand
