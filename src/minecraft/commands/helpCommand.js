process.on('uncaughtException', function (err) {console.log(err.stack)})
const MinecraftCommand = require('../../contracts/MinecraftCommand')

class helpCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'info'
    this.aliases = ['help']
    this.description = 'Shows help menu'
    this.options = []
    this.optionsDescription = []
  }

  onCommand(username, message) {
    try {
      this.send(`/gc https://imgur.com/vDHV5eS.png`)
    } catch (error) {
      this.send('/gc Something went wrong..')
    }
  }
}

module.exports = helpCommand

