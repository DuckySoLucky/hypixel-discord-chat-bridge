const DiscordCommand = require('../../contracts/DiscordCommand')
process.on('uncaughtException', function (err) {console.log(err.stack);});

class ListCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)

    this.name = 'online'
    this.aliases = ['gl', 'g', 'list']
    this.description = 'List of online members.'
  }

  onCommand(message) {
    this.sendMinecraftMessage('/g online')
  }
}

module.exports = ListCommand