const DiscordCommand = require('../../contracts/DiscordCommand')
process.on('uncaughtException', function (err) {console.log(err.stack);});

class ListCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)

    this.name = 'guildtop'
    this.aliases = ['gt', 'gtop', 'guildt']
    this.description = 'Top 10 members with the most guild experience.'
  }

  onCommand(message) {
    let args = this.getArgs(message)
    let arg = args.shift()
    this.sendMinecraftMessage(`/g top ${arg ? arg : ''}`)
  }
}

module.exports = ListCommand