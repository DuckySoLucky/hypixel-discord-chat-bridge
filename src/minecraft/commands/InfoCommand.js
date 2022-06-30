const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/Hypixel')

process.on('uncaughtException', function (err) {
  console.log(err.stack);
});

class InfoCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'info'
    this.aliases = ['help']
    this.description = 'Shows help menu'
  }

  onCommand(username, message) {
    let temp = this;
    temp.send(`/gc https://cdn.discordapp.com/attachments/582986211912712192/992041335563493406/unknown.png`)
  }
}

module.exports = InfoCommand

