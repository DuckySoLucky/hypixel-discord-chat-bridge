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
      host: "mc.hypixel.net",
      port: 25565,
      username: this.app.config.minecraft.username,
      password: this.app.config.minecraft.password,
      version: "1.12.2",
      auth: "microsoft",
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
