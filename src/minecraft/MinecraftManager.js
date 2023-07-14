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
      version: "1.8.9",
      viewDistance: "tiny",
      chatLengthLimit: 256,
    });
  }

  async sendSafeMessage(command, prefix, message, should_clean) {
    let max_length = 250;
    let max_messages = 5;

    if(prefix.length >= max_length){
      this.bot.chat(`/${command} [ERROR] Failed to send message, as prefix is too large.`);
      return false;
    }

    let max_message_allowed = max_length - prefix.length;

    let amount_of_chunks = Math.ceil(message.length / max_message_allowed);

    if(amount_of_chunks > max_messages){
      this.bot.chat(`/${command} [ERROR] Failed to send message, as it is too large.`);
      return false;
    }

    let chunks = [];
    
    for (let i = 0, o = 0; i < amount_of_chunks; ++i, o += max_message_allowed) {
      let message_text = message.substring(o, o+max_message_allowed);
      let final_message = `${prefix} ${message_text}`;
      if(should_clean){
        final_message = filter.clean(final_message);
      }
      chunks[i] = `/${command} ${final_message}`;
    }

    for (let safe_message of chunks) {
      this.bot.chat(safe_message);
      await new Promise(resolve => setTimeout(resolve, 400));
    }
    return true;
  }

  async onBroadcast({ channel, username, message, replyingTo }) {
    Logger.broadcastMessage(`${username}: ${message}`, "Minecraft");
    bridgeChat = channel;
    if (!this.bot.player) return;

    if (channel === config.discord.channels.debugChannel && config.discord.channels.debugMode === true) {
      return this.bot.chat(message);
    }

    const symbol = config.minecraft.bot.messageFormat;

    if (channel === config.discord.channels.guildChatChannel) {
      let prefix = replyingTo
      ? `${username} replying to ${replyingTo}${symbol}`
      : `${username}${symbol}`;

      return this.sendSafeMessage('gc', prefix, message, config.discord.other.filterMessages);
    }

    if (channel === config.discord.channels.officerChannel) {
      let prefix = replyingTo
      ? `${username} replying to ${replyingTo}${symbol}`
      : `${username}${symbol}`;

      return this.sendSafeMessage('oc', prefix, message, config.discord.other.filterMessages);
    }
  }
}

module.exports = MinecraftManager;
