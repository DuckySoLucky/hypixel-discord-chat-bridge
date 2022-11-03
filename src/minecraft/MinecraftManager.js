/*eslint-disable */
const CommunicationBridge = require("../contracts/CommunicationBridge.js");
const StateHandler = require("./handlers/StateHandler.js");
const ErrorHandler = require("./handlers/ErrorHandler.js");
const ChatHandler = require("./handlers/ChatHandler.js");
const CommandHandler = require("./CommandHandler.js");
const config = require("../../config.json");
const mineflayer = require("mineflayer");
const Filter = require("bad-words");
const Logger = require("../Logger");
/*eslint-enable */
const filter = new Filter();

class MinecraftManager extends CommunicationBridge {
  constructor(app) {
    super();

    this.app = app;

    this.stateHandler = new StateHandler(this);
    this.errorHandler = new ErrorHandler(this);
    this.chatHandler = new ChatHandler(this, new CommandHandler(this));

    require("./other/eventNotifier.js");
    require("./other/skyblockNotifier.js");
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
    Logger.broadcastMessage(`${username}: ${message}`, "Minecraft");
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
