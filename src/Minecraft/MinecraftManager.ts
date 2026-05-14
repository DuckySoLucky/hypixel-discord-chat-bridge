import CommandHandler from "./Handlers/CommandHandler.js";
import CommunicationBridge from "../Private/CommunicationBridge.js";
import MessageHandler from "./Handlers/MessageHandler.js";
import StateHandler from "./Handlers/StateHandler.js";
import { type Bot, createBot } from "mineflayer";
import { Filter } from "bad-words";
import { ReplaceVariables } from "../Utils/StringUtils.js";
import type Application from "../Application.js";
import type { BroadcastEvent } from "../Types/Bridge.js";
import type { ChatMessage } from "prismarine-chat";
import type { MinecraftManagerWithBot } from "../Types/Minecraft.js";

class MinecraftManager extends CommunicationBridge {
  readonly app: Application;
  readonly stateHandler: StateHandler;
  readonly commandHandler: CommandHandler;
  readonly messageHandler: MessageHandler;
  readonly filter: Filter;
  bot?: Bot;
  constructor(app: Application) {
    super(app.discord);
    this.app = app;
    this.stateHandler = new StateHandler(this);
    this.commandHandler = new CommandHandler(this);
    this.messageHandler = new MessageHandler(this);

    this.filter = new Filter();
    const fileredWords = this.app.config.discord.other.filterWords ?? [];
    this.filter.addWords(...fileredWords);
  }

  connect() {
    this.bot = this.createBotConnection();

    this.stateHandler.registerEvents();
    this.commandHandler.deployCommands();

    this.bot.on("login", () => {
      console.log("Minecraft bot is ready!");
    });
  }

  private createBotConnection() {
    return createBot({
      host: "mc.hypixel.net",
      port: 25565,
      username: "DuckySoLucky",
      auth: "microsoft",
      version: "1.8.9",
      viewDistance: "tiny",
      chatLengthLimit: 256,
      profilesFolder: "./auth-cache"
    });
  }

  isBotOnline(): this is MinecraftManagerWithBot {
    // eslint-disable-next-line no-underscore-dangle
    return this.bot?._client?.chat !== undefined;
  }

  override onBroadcast(event: BroadcastEvent) {
    if (!this.isBotOnline()) return;
    let { channelId, username, message, replyingTo, discordMessage } = event;
    if (channelId === undefined || username === undefined || message === undefined || replyingTo === undefined || discordMessage === undefined) return;
    console.broadcast(`${username}: ${message}`, "Minecraft");
    if (this.bot.player === undefined) return;

    if (channelId === this.app.config.discord.channels.debugChannel && this.app.config.discord.channels.debugMode === true) return this.bot.chat(message);

    if (this.app.config.discord.other.filterMessages) {
      try {
        message = this.filter.clean(message);
        username = this.filter.clean(username);
      } catch {
        // Do nothing
      }
    }

    if (this.app.config.discord.other.stripEmojisFromUsernames) {
      try {
        username = username.replace(/:[\w\-_]+:/g, "");
      } catch {
        // Do nothing
      }
    }

    message = ReplaceVariables(this.app.config.minecraft.bot.messageFormat, { username, message });
    const chat = channelId === this.app.config.discord.channels.officerChannel ? "/oc" : "/gc";
    if (replyingTo) message = message.replace(username, `${username} replying to ${replyingTo}`);

    let successfullySent = false;
    const messageListener = (rawMessage: ChatMessage) => {
      const message = rawMessage.toString();

      if (message.trim().includes(message.trim()) && (this.messageHandler.isGuildMessage(message) || this.messageHandler.isOfficerMessage(message))) {
        this.bot.removeListener("message", messageListener);
        successfullySent = true;
      }
    };

    this.bot.on("message", messageListener);
    this.bot.chat(`${chat} ${message}`);

    setTimeout(() => {
      this.bot.removeListener("message", messageListener);
      if (successfullySent === true) return;
      discordMessage.react("❌");
    }, 500);
  }
}

export default MinecraftManager;
