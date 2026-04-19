const minecraftCommand = require("../../contracts/minecraftCommand.js");
const config = require("../../../config.json");

class PingCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'discord'
    this.aliases = []
    this.description = 'Discord'
  }

  onCommand(username, message) {
    this.send(`/gc Join our Discord Server! https://discord.gg/wdD9pDHN`)
  }
}

module.exports = PingCommand
