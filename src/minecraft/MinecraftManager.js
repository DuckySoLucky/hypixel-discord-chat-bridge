const CommunicationBridge = require('../contracts/CommunicationBridge')
const StateHandler = require('./handlers/StateHandler')
const ErrorHandler = require('./handlers/ErrorHandler')
const ChatHandler = require('./handlers/ChatHandler')
const CommandHandler = require('./CommandHandler')
const config = require('../../config.json')
const mineflayer = require('mineflayer')
const Filter = require('bad-words'), filter = new Filter();
const Logger = require('../Logger')

class MinecraftManager extends CommunicationBridge {
  constructor(app) {
    super()

    this.app = app

    this.stateHandler = new StateHandler(this)
    this.errorHandler = new ErrorHandler(this)
    this.chatHandler = new ChatHandler(this, new CommandHandler(this))
  }

  connect() {
    global.bot = this.createBotConnection()
    this.bot = bot

    this.errorHandler.registerEvents(this.bot)
    this.stateHandler.registerEvents(this.bot)
    this.chatHandler.registerEvents(this.bot)
  }

  createBotConnection() {
    return mineflayer.createBot({
      host: "mc.hypixel.net",
      port: 25565,
      username: config.minecraft.paswword,
      password: config.minecraft.password,
      version: "1.12.2",
      auth: config.minecraft.auth
    })
  }

  onBroadcast({ channel, username, message, replyingTo  }) { 
    Logger.broadcastMessage(`${username}: ${message}`, 'Minecraft')
    if(config.discord.filterMessages == 'true'){
      if (this.bot.player !== undefined) {
        if (channel == config.discord.officerChannel) {this.bot.chat(filter.clean(`/oc ${replyingTo ? `${username} replying to ${replyingTo} »` : `${username} »`} ${message}`))}
        else { this.bot.chat(filter.clean(`/gc ${replyingTo ? `${username} replying to ${replyingTo} »` : `${username} »`} ${message}`))}
      }
    } else{
      if (this.bot.player !== undefined) {
        if (channel == config.discord.officerChannel) {this.bot.chat(`/oc ${replyingTo ? `${username} replying to ${replyingTo} »` : `${username} »`} ${message}`)}
        else { this.bot.chat(`/gc ${replyingTo ? `${username} replying to ${replyingTo} »` : `${username} »`} ${message}`)}
      }
    }
  }
}

module.exports = MinecraftManager
