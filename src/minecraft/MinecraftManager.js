const CommunicationBridge = require("../contracts/CommunicationBridge.js");
const { replaceVariables } = require("../contracts/helperFunctions.js");
const StateHandler = require("./handlers/StateHandler.js");
const ErrorHandler = require("./handlers/ErrorHandler.js");
const ChatHandler = require("./handlers/ChatHandler.js");
const CommandHandler = require("./CommandHandler.js");
const config = require("../../config.json");
const mineflayer = require("mineflayer");
const Logger = require("../Logger.js");
const Filter = require("bad-words");
const filter = new Filter();

class MinecraftManager extends CommunicationBridge {
  constructor(app) {
    super();

    this.app = app;

    this.stateHandler = new StateHandler(this);
    this.errorHandler = new ErrorHandler(this);
    this.chatHandler = new ChatHandler(this, new CommandHandler(this));
  }

  connect() {
    global.bot = this.createBotConnection();
    this.bot = bot;

    this.errorHandler.registerEvents(this.bot);
    this.stateHandler.registerEvents(this.bot);
    this.chatHandler.registerEvents(this.bot);

    require("./other/eventNotifier.js");
    require("./other/skyblockNotifier.js");
  }

  createBotConnection() {
    return mineflayer.createBot({
      host: "mc.hypixel.net",
      port: 25565,
      auth: "microsoft",
      version: "1.8.9",
      viewDistance: "tiny",
      chatLengthLimit: 256,
      profilesFolder: "../../auth-cache",
      username: "MinecraftDiscordBot",
    });
  }

  async onBroadcast({ channel, username, message, replyingTo }) {
    Logger.broadcastMessage(`${username}: ${message}`, "Minecraft");
    if (this.bot.player === undefined) {
      return;
    }

    if (channel === config.discord.channels.debugChannel && config.discord.channels.debugMode === true) {
      return this.bot.chat(message);
    }

    if (config.discord.other.filterMessages) {
      message = filter.clean(message);
    }

    message = replaceVariables(config.minecraft.bot.messageFormat, { username, message });

    const chat = channel === config.discord.channels.officerChannel ? "/oc" : "/gc";

    if (replyingTo) {
      message = message.replace(username, `${username} replying to ${replyingTo}`);
    }

    this.bot.chat(`${chat} ${message}`);
  }
}

module.exports = MinecraftManager;
