const communicationBridge = require("../contracts/CommunicationBridge.js");
const stateHandler = require("./handlers/StateHandler.js");
const errorHandler = require("./handlers/ErrorHandler.js");
const chatHandler = require("./handlers/ChatHandler.js");
const commandHandler = require("./CommandHandler.js");
const config = require("../../config.json");
const mineflayer = require("mineflayer");
const logger = require("../Logger.js");
const filters = require("bad-words");
const filter = new filters();

class MinecraftManager extends communicationBridge {
  constructor(app) {
    super();

    this.app = app;

    this.stateHandler = new stateHandler(this);
    this.errorHandler = new errorHandler(this);
    this.chatHandler = new chatHandler(this, new commandHandler(this));

    require("./other/skyblockNotifier.js");
    require("./other/eventNotifier.js");
  }

  connect() {
    global.bot = this.createBotConnection();
    this.bot = bot;

    this.errorHandler.registerEvents(this.bot);
    this.stateHandler.registerEvents(this.bot);
    this.chatHandler.registerEvents(this.bot);
  }

  createBotConnection() {
    return mineflayer.createBot({
      host: "mc.hypixel.net",
      port: 25565,
      auth: "microsoft",
      version: '1.8.9',
      viewDistance: 'tiny',
      chatLengthLimit: 256,
    });
  }

  async onBroadcast({ channel, username, message, replyingTo }) {
    logger.broadcastMessage(`${username}: ${message}`, "Minecraft");
    bridgeChat = channel;
    if (!this.bot.player) return; 

    if (channel === config.console.debugChannel) {
      return this.bot.chat(message);
    }

    if (channel === config.discord.guildChatChannel) {
      return config.discord.filterMessages ? this.bot.chat(filter.clean(`/gc ${replyingTo? `${username} replying to ${replyingTo} »` : `${username} »`} ${message}`)) : this.bot.chat(`/gc ${replyingTo? `${username} replying to ${replyingTo} »` : `${username} »`} ${message}`)
    }

    if (channel === config.discord.officerChannel) {
      return config.discord.filterMessages ? this.bot.chat(filter.clean(`/oc ${replyingTo? `${username} replying to ${replyingTo} »` : `${username} »`} ${message}`)) : this.bot.chat(`/oc ${replyingTo? `${username} replying to ${replyingTo} »` : `${username} »`} ${message}`)
    }
  }
}

module.exports = MinecraftManager;
