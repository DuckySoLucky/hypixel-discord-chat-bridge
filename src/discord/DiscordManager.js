/*eslint-disable */
const {
  Client,
  Collection,
  AttachmentBuilder,
  GatewayIntentBits,
} = require("discord.js");
const CommunicationBridge = require("../contracts/CommunicationBridge.js");
const messageToImage = require("../contracts/messageToImage.js");
const MessageHandler = require("./handlers/MessageHandler.js");
const StateHandler = require("./handlers/StateHandler.js");
const CommandHandler = require("./CommandHandler.js");
const config = require("../../config.json");
const Logger = require(".././Logger.js");
/*eslint-enable */
const path = require("node:path");
const fs = require("fs");
const { kill } = require("node:process");
let channel;

class DiscordManager extends CommunicationBridge {
  constructor(app) {
    super();

    this.app = app;

    this.stateHandler = new StateHandler(this);
    this.messageHandler = new MessageHandler(this);
    this.commandHandler = new CommandHandler(this);
  }

  async connect() {
    global.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.client = client;

    this.client.on("ready", () => this.stateHandler.onReady());
    this.client.on("messageCreate", (message) =>
      this.messageHandler.onMessage(message)
    );
    
    require('./other/updateGuildList.js')

    this.client.login(config.discord.bot.token).catch((error) => {
      Logger.errorMessage(error);
    });

    client.commands = new Collection();
    const commandFiles = fs
      .readdirSync("src/discord/commands")
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      client.commands.set(command.name, command);
    }

    const eventsPath = path.join(__dirname, "events");
    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const event = require(filePath);
      event.once
        ? client.once(event.name, (...args) => event.execute(...args))
        : client.on(event.name, (...args) => event.execute(...args));
    }

    global.guild = await client.guilds.fetch(config.discord.bot.serverID);

    process.on("SIGINT", () => {
      this.stateHandler.onClose().then(() => {
        client.destroy();
        kill(process.pid);
      });
    });
  }

  async getChannel(type) {
    switch (type) {
      case "Officer":
        return this.app.discord.client.channels.cache.get(
          config.discord.channels.officerChannel
        );
      case "Logger":
        return this.app.discord.client.channels.cache.get(
          config.discord.channels.loggingChannel
        );
      case "debugChannel":
        return this.app.discord.client.channels.cache.get(
          config.discord.channels.debugChannel
        );
      default:
        return this.app.discord.client.channels.cache.get(
          config.discord.channels.guildChatChannel
        );
    }
  }

  async getWebhook(discord, type) {
    channel = await this.getChannel(type);
    const webhooks = await channel.fetchWebhooks();

    if (webhooks.size === 0) {
      channel.createWebhook({
        name: "Hypixel Chat Bridge",
        avatar: "https://i.imgur.com/AfFp7pu.png",
      });

      await this.getWebhook(discord, type);
    }

    return webhooks.first();
  }

  async onBroadcast({
    fullMessage,
    username,
    message,
    guildRank,
    chat,
    color = 1752220,
  }) {
    let mode = config.discord.other.messageMode.toLowerCase();
    if (message === undefined) {
      if (config.discord.channels.debugMode === false) {
        return;
      }

      mode = "minecraft";
    }

    if (username !== undefined) {
      Logger.broadcastMessage(`${username} [${guildRank}]: ${message}`, `Discord`);
    }

    channel = await this.getChannel(chat || "Guild");
    if (channel === undefined) return;

    switch (mode) {
      case "bot":
        channel.send({
          embeds: [
            {
              description: message,
              color: this.hexToDec(color),
              timestamp: new Date(),
              footer: {
                text: guildRank,
              },
              author: {
                name: username,
                icon_url: `https://www.mc-heads.net/avatar/${username}`,
              },
            },
          ],
        });
        break;

      case "webhook":
        message = message.replace(/@/g, "");
        this.app.discord.webhook = await this.getWebhook(
          this.app.discord,
          chat
        );
        this.app.discord.webhook.send({
          content: message,
          username: username,
          avatarURL: `https://www.mc-heads.net/avatar/${username}`,
        });
        break;

      case "minecraft":
        await channel.send({
          files: [
            new AttachmentBuilder(messageToImage(fullMessage), {
              name: `${username}.png`,
            }),
          ],
        });

        if (fullMessage.includes("https://")) {
          const link = fullMessage.match(/https?:\/\/[^\s]+/g)[0];
          channel = await this.getChannel(chat);
          await channel.send(link);
        }

        break;

      default:
        throw new Error(
          "Invalid message mode: must be bot, webhook or minecraft"
        );
    }
  }

  async onBroadcastCleanEmbed({ message, color, channel }) {
    Logger.broadcastMessage(message, "Event");
    channel = await this.getChannel(channel);
    channel.send({
      embeds: [
        {
          color: color,
          description: message,
        },
      ],
    });
  }

  async onBroadcastHeadedEmbed({ message, title, icon, color, channel }) {
    Logger.broadcastMessage(message, "Event");
    channel = await this.getChannel(channel);
    channel.send({
      embeds: [
        {
          color: color,
          author: {
            name: title,
            icon_url: icon,
          },
          description: message,
        },
      ],
    });
  }

  async onPlayerToggle({ fullMessage, username, message, color, channel }) {
    Logger.broadcastMessage(message, "Event");
    channel = await this.getChannel(channel);
    switch (config.discord.other.messageMode.toLowerCase()) {
      case "bot":
        channel.send({
          embeds: [
            {
              color: color,
              timestamp: new Date(),
              author: {
                name: `${message}`,
                icon_url: `https://www.mc-heads.net/avatar/${username}`,
              },
            },
          ],
        });
        break;
      case "webhook":
        this.app.discord.webhook = await this.getWebhook(
          this.app.discord,
          channel
        );
        this.app.discord.webhook.send({
          username: username,
          avatarURL: `https://www.mc-heads.net/avatar/${username}`,
          embeds: [
            {
              color: color,
              description: `${username} ${message}`,
            },
          ],
        });

        break;
      case "minecraft":
        await channel.send({
          files: [
            new AttachmentBuilder(messageToImage(fullMessage), {
              name: `${username}.png`,
            }),
          ],
        });
        break;
      default:
        throw new Error("Invalid message mode: must be bot or webhook");
    }
  }

  hexToDec(hex) {
    return parseInt(hex.replace("#", ""), 16);
  }
}

module.exports = DiscordManager;
