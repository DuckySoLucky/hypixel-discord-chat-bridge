import CommandHandler from "./Handlers/CommandHandler.js";
import CommunicationBridge from "../Private/CommunicationBridge.js";
import DiscordUtils from "./Private/DiscordUtils.js";
import Embed, { BasicEmbed, ErrorEmbed } from "./Private/Embed.js";
import HypixelDiscordChatBridgeError from "../Private/Error.js";
import InteractionHandler from "./Handlers/InteractionHandler.js";
import MessageHandler from "./Handlers/MessageHandler.js";
import MessageToImage from "../Utils/MessageToImage.js";
import StateHandler from "./Handlers/StateHandler.js";
import { AttachmentBuilder, ChannelType, Client, Events, GatewayIntentBits, Guild, Webhook } from "discord.js";
import { HexToDecimal } from "../Utils/ColorUtils.js";
import { ReplaceVariables } from "../Utils/StringUtils.js";
import type Application from "../Application.js";
import type { BroadcastEvent } from "../Types/Bridge.js";
import type { ChannelNames, DiscordManagerWithClient, DiscordManagerWithGuild } from "../Types/Discord.js";

class DiscordManager extends CommunicationBridge {
  readonly app: Application;
  readonly commandHandler: CommandHandler;
  readonly interactionHandler: InteractionHandler;
  readonly messageHandler: MessageHandler;
  readonly stateHandler: StateHandler;
  readonly utils: DiscordUtils;
  client?: Client;
  guild?: Guild;
  constructor(app: Application) {
    super(app.minecraft);
    this.app = app;
    this.commandHandler = new CommandHandler(this);
    this.interactionHandler = new InteractionHandler(this);
    this.messageHandler = new MessageHandler(this);
    this.stateHandler = new StateHandler(this);
    this.utils = new DiscordUtils(this);
  }

  async connect(): Promise<void> {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });
    await this.commandHandler.deployCommands();
    this.client.on(Events.ClientReady, () => this.stateHandler.onReady());
    this.client.on(Events.MessageCreate, (message) => this.messageHandler.onMessage(message));
    this.client.on(Events.InteractionCreate, (interaction) => this.interactionHandler.onInteraction(interaction));
    this.client.login(this.app.config.discord.bot.token).catch((e) => console.error(e));

    process.on("SIGINT", async () => {
      await this.stateHandler.onClose();
      process.kill(process.pid, "SIGTERM");
    });
  }

  async getWebhook(type: ChannelNames): Promise<Webhook | null> {
    const channel = await this.stateHandler.getChannel(type);
    if (channel === null || !channel.isSendable() || channel.type !== ChannelType.GuildText) throw new HypixelDiscordChatBridgeError(`Channel "${type}" not found!`);
    try {
      const webhooks = await channel.fetchWebhooks();

      if (webhooks.size === 0) {
        await channel.createWebhook({ name: "Hypixel Chat Bridge", avatar: "https://imgur.com/tgwQJTX.png" });
        return await this.getWebhook(type);
      }

      const hook = webhooks.first();
      if (hook === undefined) {
        throw new HypixelDiscordChatBridgeError("An error occurred while trying to fetch the webhooks. Please make sure the bot has the `MANAGE_WEBHOOKS` permission.");
      }
      return hook;
    } catch (error) {
      console.error(error);
      channel.send({
        embeds: [new ErrorEmbed().setDescription("An error occurred while trying to fetch the webhooks. Please make sure the bot has the `MANAGE_WEBHOOKS` permission.")]
      });
      return null;
    }
  }

  override async onBroadcast(event: BroadcastEvent) {
    let { fullMessage, chat, chatType, username, rank, guildRank, message, color = 1752220 } = event;
    if (
      fullMessage === undefined ||
      chat === undefined ||
      chatType === undefined ||
      username === undefined ||
      rank === undefined ||
      guildRank === undefined ||
      message === undefined
    ) {
      return;
    }

    const mode = chatType === "Debug" ? this.app.config.discord.channels.debugChannelMessageMode.toLowerCase() : this.app.config.discord.other.messageMode.toLowerCase();
    message = ["text"].includes(mode) ? fullMessage : message;
    if (message !== undefined && chat !== "debugChannel") {
      console.broadcast(`${username} [${guildRank.replace(/§[0-9a-fk-or]/g, "").replace(/^\[|\]$/g, "")}]: ${message}`, "Discord");
    }

    if (mode === "minecraft") message = ReplaceVariables(this.app.config.discord.other.messageFormat, { chatType, username, rank, guildRank, message });
    const channel = await this.stateHandler.getChannel(chatType);
    if (channel === null || !channel.isSendable()) return console.error(`Channel "${chatType.replace(/§[0-9a-fk-or]/g, "").trim()}" not found!`);

    switch (mode) {
      case "bot": {
        await channel.send({
          embeds: [
            new Embed()
              .setDescription(message)
              .setColor(HexToDecimal(color))
              .setFooter({ text: guildRank })
              .setAuthor({ name: username, iconURL: `https://www.mc-heads.net/avatar/${username}` })
          ]
        });

        if (message.includes("https://")) {
          const links = message.match(/https?:\/\/[^\s]+/g);
          if (links) channel.send(links.join("\n"));
        }

        break;
      }
      case "webhook": {
        message = this.cleanMessage(message);
        if (message.length === 0) return;
        const webhook = await this.getWebhook(chatType);
        if (webhook === null) return;
        webhook.send({ content: message, username: username, avatarURL: `https://www.mc-heads.net/avatar/${username}` });
        break;
      }
      case "minecraft": {
        if (fullMessage.length === 0) return;
        await channel.send({ files: [new AttachmentBuilder(await MessageToImage(message, username), { name: `${username}.png` })] });
        if (message.includes("https://")) {
          const links = message.match(/https?:\/\/[^\s]+/g);
          if (links) channel.send(links.join("\n"));
        }
        break;
      }
      case "text": {
        if (message.trim().length === 0) return;
        await channel.send({ content: message });
        break;
      }
      default: {
        throw new Error("Invalid message mode: must be bot, webhook or minecraft");
      }
    }
  }

  override async onBroadcastCleanEmbed(event: BroadcastEvent) {
    const { chatType, message, color } = event;
    if (chatType === undefined || message === undefined || color === undefined) return;
    console.broadcast(message, "Event");

    const channel = await this.stateHandler.getChannel(chatType);
    if (channel === null || !channel.isSendable()) return console.error(`Channel "${chatType.replace(/§[0-9a-fk-or]/g, "").trim()}" not found!`);
    channel.send({ embeds: [new BasicEmbed().setColor(color).setDescription(message)] });
    channel.send({ embeds: [{ color: color, description: message }] });
  }

  override async onBroadcastHeadedEmbed(event: BroadcastEvent) {
    const { message, title = "", icon = "", color, chatType } = event;
    if (message === undefined || color === undefined || chatType === undefined) return;
    console.broadcast(message, "Event");

    const channel = await this.stateHandler.getChannel(chatType);
    if (channel === null || !channel.isSendable()) return console.error(`Channel "${chatType.replace(/§[0-9a-fk-or]/g, "").trim()}" not found!`);
    channel.send({ embeds: [new BasicEmbed().setColor(color).setDescription(message).setAuthor({ name: title, iconURL: icon })] });
  }

  override async onPlayerToggle(event: BroadcastEvent) {
    let { fullMessage, username, message, color, chatType } = event;
    if (fullMessage === undefined || username === undefined || message === undefined || color === undefined || chatType === undefined) return;
    console.broadcast(message, "Event");
    const channel = await this.stateHandler.getChannel(chatType);
    if (channel === null || !channel.isSendable()) return console.error(`Channel "${chatType.replace(/§[0-9a-fk-or]/g, "").trim()}" not found!`);

    switch (this.app.config.discord.other.messageMode.toLowerCase()) {
      case "bot":
        await channel.send({ embeds: [new Embed().setColor(color).setAuthor({ name: message, iconURL: `https://www.mc-heads.net/avatar/${username}` })] });
        break;
      case "webhook":
        message = this.cleanMessage(message);
        if (message.length === 0) return;
        const webhook = await this.getWebhook("Guild");
        if (webhook === null) return;
        webhook.send({
          username: username,
          avatarURL: `https://www.mc-heads.net/avatar/${username}`,
          embeds: [new BasicEmbed().setColor(color).setDescription(message)]
        });
        break;
      case "minecraft":
        await channel.send({ files: [new AttachmentBuilder(await MessageToImage(fullMessage), { name: `${username}.png` })] });
        break;
      default:
        throw new Error("Invalid message mode: must be bot or webhook");
    }
  }

  cleanMessage(message: string) {
    return message
      .split("\n")
      .map((part) => {
        part = part.trim();
        return part.length === 0 ? "" : part.replace(/@(everyone|here)/gi, "").trim() + " ";
      })
      .join("");
  }

  formatMessage(message: string, data: Record<string, any>) {
    return ReplaceVariables(message, data);
  }

  isGuildReady(): this is DiscordManagerWithGuild {
    return this.guild?.id !== undefined;
  }

  isClientOnline(): this is DiscordManagerWithClient {
    return this.client?.isReady() !== undefined;
  }
}

export default DiscordManager;
