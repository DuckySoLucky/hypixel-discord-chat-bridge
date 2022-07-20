const MinecraftCommand = require('../../contracts/MinecraftCommand')
process.on('uncaughtException', function (err) {console.log(err.stack)});

class InfoCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'info'
    this.aliases = ['help']
    this.description = 'Shows help menu'
  }

  onCommand(username, message) {
    let temp = this;
    temp.send(`/gc https://cdn.discordapp.com/attachments/600317865429565490/996120686609305681/unknown.png?size=4096`)
  }
}

module.exports = InfoCommand

