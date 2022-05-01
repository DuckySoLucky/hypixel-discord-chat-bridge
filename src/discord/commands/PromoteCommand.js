const DiscordCommand = require('../../contracts/DiscordCommand')

class PromoteCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)

    this.name = 'promote'
    this.aliases = ['p', 'up']
    this.description = 'Promotes the given user by one guild rank'
  }

  onCommand(message) {
    let args = this.getArgs(message)
    let user = args.shift()

    this.sendMinecraftMessage(`/g promote ${user ? user : ''}`)
  }
}

module.exports = PromoteCommand
