const EventHandler = require('../../contracts/EventHandler')

class StateHandler extends EventHandler {
  constructor(minecraft) {
    super()

    this.minecraft = minecraft
  }

  registerEvents(bot) {
    this.bot = bot

    this.bot.on('error', (...args) => this.onError(...args))
  }

  onError(error) {
    if (this.isConnectionResetError(error)) {
      return
    }

    if (this.isConnectionRefusedError(error)) {
      return this.minecraft.app.log.error('Connection refused while attempting to login via the Minecraft client')
    }

    this.minecraft.app.log.error(error)
  }

  isConnectionResetError(error) {
    return error.hasOwnProperty('code') && error.code == 'ECONNRESET'
  }

  isConnectionRefusedError(error) {
    return error.hasOwnProperty('code') && error.code == 'ECONNREFUSED'
  }
}

module.exports = StateHandler
