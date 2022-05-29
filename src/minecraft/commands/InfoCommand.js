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
    this.description = 'Shows this help menu'
  }

  onCommand(username, message) {
    let temp = this;
    temp.send(`/gc https://imgur.com/a/vVhDzb5`)
  }
}

module.exports = InfoCommand

