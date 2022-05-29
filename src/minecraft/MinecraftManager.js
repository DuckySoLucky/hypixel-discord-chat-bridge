const CommunicationBridge = require('../contracts/CommunicationBridge')
const CommandHandler = require('./CommandHandler')
const StateHandler = require('./handlers/StateHandler')
const ErrorHandler = require('./handlers/ErrorHandler')
const ChatHandler = require('./handlers/ChatHandler')
const mineflayer = require('mineflayer')

class MinecraftManager extends CommunicationBridge {
  constructor(app) {
    super()

    this.app = app

    this.stateHandler = new StateHandler(this)
    this.errorHandler = new ErrorHandler(this)
    this.chatHandler = new ChatHandler(this, new CommandHandler(this))
  }

  connect() {
    this.bot = this.createBotConnection()

    this.errorHandler.registerEvents(this.bot)
    this.stateHandler.registerEvents(this.bot)
    this.chatHandler.registerEvents(this.bot)
  }

  createBotConnection() {
    return mineflayer.createBot({
      host: this.app.config.server.host,
      port: this.app.config.server.port,
      username: this.app.config.minecraft.username,
      password: this.app.config.minecraft.password,
      version: "1.12.2", // 1.12.2 instead of 1.8.9 Because of the Chat expansion
      auth: this.app.config.minecraft.accountType,
    })
  }

  onBroadcast({ channel, username, message, replyingTo  }) { 
    this.app.log.broadcast(`${username}: ${message}`, 'Minecraft')

    if (this.bot.player !== undefined) {
      if (channel == this.app.config.discord.officerChannel) {this.bot.chat(`/oc ${replyingTo ? `${username} replying to ${replyingTo} »` : `${username} »`} ${message}`)}
      else { this.bot.chat(`/gc ${replyingTo ? `${username} replying to ${replyingTo} »` : `${username} »`} ${message}`)}

    }
  }
}

module.exports = MinecraftManager
