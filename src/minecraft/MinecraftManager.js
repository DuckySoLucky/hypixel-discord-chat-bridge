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
filter.removeWords("god", "damn");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
      profilesFolder: "./auth-cache",
    });
  }

  async sendSafeMessage(command, prefix, message, should_clean) {
    let max_length = 250;
    let max_messages = 5;

    if (prefix.length >= max_length) {
      this.bot.chat(`/${command} [ERROR] Failed to send message, as prefix is too large.`);
      return false;
    }

    let max_message_allowed = max_length - prefix.length;

    let amount_of_chunks = Math.ceil(message.length / max_message_allowed);

    if (amount_of_chunks > max_messages) {
      this.bot.chat(`/${command} [ERROR] Failed to send message, as it is too large.`);
      return false;
    }

    let chunks = [];

    for (let i = 0, o = 0; i < amount_of_chunks; ++i, o += max_message_allowed) {
      let message_text = message.substring(o, o + max_message_allowed);
      let final_message = `${prefix} ${message_text}`;
      if (should_clean) {
        final_message = filter.clean(final_message);
      }
      chunks[i] = `/${command} ${final_message}`;
    }

    for (let safe_message of chunks) {
      this.bot.chat(safe_message);
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    return true;
  }

  chunkSubstr(str, size) {
    const numChunks = Math.ceil(str.length / size);
    const chunks = new Array(numChunks);

    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
      chunks[i] = str.substr(o, size);
    }

    return chunks;
  }

  async onBroadcast({ channel, username, message, replyingTo, discord }) {
    Logger.broadcastMessage(`${username}: ${message}`, "Minecraft");
    if (this.bot.player === undefined) {
      return;
    }

    if (channel === config.discord.channels.debugChannel && config.discord.channels.debugMode === true) {
      return this.bot.chat(message);
    }

    if (channel === config.discord.replication.channels.debug && config.discord.channels.debugMode === true) {
      return this.bot.chat(message);
    }

    const chat = channel === config.discord.channels.officerChannel ? "/oc" : "/gc";

    if (message.length > 1000) {
      return this.bot.chat(`${chat} [ERROR] Failed to send the message, as it was longer than 1000 symbols!`);
    }

    let chunks = this.chunkSubstr(message, 200);

    for (const index in chunks) {
      let message_chunk = chunks[index];
      if (config.discord.other.filterMessages) {
        try {
          message_chunk = filter.clean(message_chunk);
        } catch (e) {
          message_chunk = chunks[index];
        }
      }
      message_chunk = replaceVariables(config.minecraft.bot.messageFormat, {
        username: username,
        message: message_chunk,
      });

      if (replyingTo) {
        message_chunk = message_chunk.replace(username, `${username} replying to ${replyingTo}`);
      }

      let successfullySent = false;
      const messageListener = (receivedMessage) => {
        receivedMessage = receivedMessage.toString();

        if (
          receivedMessage.includes(message) &&
          (this.chatHandler.isGuildMessage(receivedMessage) || this.chatHandler.isOfficerMessage(receivedMessage))
        ) {
          bot.removeListener("message", messageListener);
          successfullySent = true;
        }
      };

      bot.on("message", messageListener);
      this.bot.chat(`${chat} ${message_chunk}`);
      await delay(1000);

      /*setTimeout(() => {
        bot.removeListener("message", messageListener);
        if (successfullySent === true) {
          return;
        }
  
        discord.react("❌");
      }, 500);*/
    }
  }
}

module.exports = MinecraftManager;
