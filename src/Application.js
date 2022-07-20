const DiscordManager = require('./discord/DiscordManager')
const MinecraftManager = require('./minecraft/MinecraftManager')
const Logger = require('./Logger')

class Application {
  async register() {
    this.log = new Logger()

    this.discord = new DiscordManager(this)
    this.minecraft = new MinecraftManager(this)

    this.discord.setBridge(this.minecraft)
    this.minecraft.setBridge(this.discord)
  }

  async connect() {
    this.discord.connect()
    this.minecraft.connect()
  }
}

module.exports = new Application()
