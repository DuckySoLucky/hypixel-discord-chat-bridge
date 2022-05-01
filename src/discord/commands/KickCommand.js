const DiscordCommand = require('../../contracts/DiscordCommand')

class KickCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)

    this.name = 'kick'
    this.aliases = ['k']
    this.description = 'Kicks the given user from the guild'
  }

  onCommand(message) {
    let args = this.getArgs(message)
    let user = args.shift()
    let reason = args.join(' ')

    this.sendMinecraftMessage(`/g kick ${user ? user : ''} ${reason ? reason : ''}`)
  }
}

module.exports = KickCommand
