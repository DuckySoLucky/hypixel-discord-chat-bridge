const EventHandler = require('../../contracts/EventHandler')
const Logger = require('../../Logger')

class StateHandler extends EventHandler {
  constructor(minecraft) {
    super()

    this.minecraft = minecraft
    this.loginAttempts = 0
    this.exactDelay = 0
  }

  registerEvents(bot) {
    this.bot = bot

    this.bot.on('login', (...args) => this.onLogin(...args))
    this.bot.on('end', (...args) => this.onEnd(...args))
    this.bot.on('kicked', (...args) => this.onKicked(...args))
  }

  onLogin() {
    Logger.minecraftMessage('Client ready, logged in as ' + this.bot.username)

    this.loginAttempts = 0
    this.exactDelay = 0
  }

  onEnd() {
    let loginDelay = this.exactDelay
    if (loginDelay == 0) {
      loginDelay = (this.loginAttempts + 1) * 5000

      if (loginDelay > 60000) {
        loginDelay = 60000
      }
    }

    Logger.warnMessage(`Minecraft bot has disconnected! Attempting reconnect in ${loginDelay / 1000} seconds`)

    setTimeout(() => this.minecraft.connect(), loginDelay)
  }

  onKicked(reason) {
    Logger.warnMessage(`Minecraft bot has been kicked from the server for "${reason}"`)

    this.loginAttempts++
  }
}

module.exports = StateHandler
