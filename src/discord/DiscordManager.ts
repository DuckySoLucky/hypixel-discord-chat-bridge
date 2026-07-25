import ButtonHandler from "./handlers/ButtonHandler.js";
import CommandHandler from "./handlers/CommandHandler.js";
import CommunicationBridge from "../private/CommunicationBridge.js";
import Embed, { ErrorEmbed } from "./private/Embed.js";
import EventHandler from "./handlers/EventHandler.js";
import HypixelDiscordChatBridgeError from "../private/error.js";
import InteractionHandler from "./handlers/InteractionHandler.js";
import MessageHandler from "./handlers/MessageHandler.js";
import ModalHandler from "./handlers/ModalHandler.js";
import StateHandler from "./handlers/StateHandler.js";
import {
  AttachmentBuilder,
  AutocompleteInteraction,
  ButtonInteraction,
  type Channel,
  ChannelType,
  ChatInputCommandInteraction,
  Client,
  Events,
  GatewayIntentBits,
  Guild,
  MessageFlags,
  ModalSubmitInteraction,
  Webhook
} from "discord.js";
import {
  type ChannelName,
  type DiscordManagerWithClient,
  type DiscordManagerWithGuild,
  type GenericChannelName,
  type LoggerChannelName,
  LoggerChannelNames
} from "../types/discord.js";
import { canSendMessages, getApplicationOwners } from "../utils/discordUtils.js";
import { messageToImage } from "../utils/messageToImage.js";
import { removeColorCodes, replaceVariables } from "../utils/stringUtils.js";
import { writeFile } from "node:fs/promises";
import type Application from "../Application.js";
import type { BroadcastEvent } from "../types/bridge.js";

class DiscordManager extends CommunicationBridge {
  readonly buttonHandler: ButtonHandler;
  readonly commandHandler: CommandHandler;
  readonly eventHandler: EventHandler;
  readonly interactionHandler: InteractionHandler;
  readonly messageHandler: MessageHandler;
  readonly stateHandler: StateHandler;
  readonly modalHandler: ModalHandler;
  client?: Client;
  guild?: Guild;
  constructor(readonly application: Application) {
    super();
    this.buttonHandler = new ButtonHandler(this);
    this.commandHandler = new CommandHandler(this);
    this.eventHandler = new EventHandler(this);
    this.interactionHandler = new InteractionHandler(this);
    this.messageHandler = new MessageHandler(this);
    this.stateHandler = new StateHandler(this);
    this.modalHandler = new ModalHandler(this);
  }

  async connect() {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });
    this.client.config = this.application.config;
    this.client.discordManager = this;
    await this.commandHandler.deployCommands();
    this.client.on(Events.ClientReady, () => this.stateHandler.onReady());
    this.client.on(Events.MessageCreate, (message) => this.messageHandler.onMessage(message));
    this.client.on(Events.InteractionCreate, (interaction) => this.interactionHandler.onInteraction(interaction));
    this.client.on(Events.GuildMemberAdd, (member) => this.eventHandler.onGuildMemberAdd(member));
    this.client.on(Events.GuildMemberRemove, (member) => this.eventHandler.onGuildMemberRemove(member));
    this.client.login(this.application.config.discord.token).catch((e) => console.error(e));

    process.on("SIGINT", async () => {
      await this.stateHandler.onClose();
      process.kill(process.pid, "SIGTERM");
    });
  }

  async getWebhook(type: ChannelName): Promise<Webhook | null> {
    const channel = await this.getChannel(type);
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
      await channel.send({
        embeds: [new ErrorEmbed().setDescription("An error occurred while trying to fetch the webhooks. Please make sure the bot has the `MANAGE_WEBHOOKS` permission.")]
      });
      return null;
    }
  }

  override async onBroadcast(event: BroadcastEvent) {
    let { fullMessage, chatType, username, rank, guildRank, message, color = "Green" } = event;
    if (fullMessage === undefined || chatType === undefined || message === undefined) return;

    const mode = chatType === "Debug" ? "text" : this.application.config.bridge.discord.mode;
    message = ["text"].includes(mode) ? fullMessage : message;
    if (message.trim().length === 0) return;

    const channel = await this.getChannel(chatType);
    if (channel === null || !channel.isSendable()) return console.error(`Channel "${chatType.replace(/§[0-9a-fk-or]/g, "").trim()}" not found!`);
    if (chatType === "Debug") return await channel.send({ content: message });

    if (username === undefined || rank === undefined || guildRank === undefined) return;
    console.broadcast(`${username} [${guildRank.replace(/§[0-9a-fk-or]/g, "").replace(/^\[|\]$/g, "")}]: ${message}`, "Discord");

    if (mode === "minecraft") message = replaceVariables(this.application.config.bridge.discord.format, { chatType, username, rank, guildRank, message });

    switch (mode) {
      case "bot": {
        await channel.send({
          embeds: [
            new Embed()
              .setColor(color)
              .setDescription(message)
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
        await channel.send({ files: [new AttachmentBuilder(await messageToImage(message, username), { name: `${username}.png` })] });
        if (message.includes("https://")) {
          const links = message.match(/https?:\/\/[^\s]+/g);
          if (links) channel.send(links.join("\n"));
        }
        break;
      }
      case "text": {
        await channel.send({ content: message });
        break;
      }
      default: {
        throw new HypixelDiscordChatBridgeError("Invalid message mode: must be bot, webhook or minecraft");
      }
    }
  }

  override async onBroadcastCleanEmbed(event: BroadcastEvent) {
    const { chatType, message, color } = event;
    if (chatType === undefined || message === undefined || color === undefined) return;
    console.broadcast(message, "Event");

    const channel = await this.getChannel(chatType);
    if (channel === null || !channel.isSendable()) return console.error(`Channel "${chatType.replace(/§[0-9a-fk-or]/g, "").trim()}" not found!`);
    await channel.send({ embeds: [new Embed().setColor(color).setDescription(message).setFooter(null)] });
  }

  override async onBroadcastHeadedEmbed(event: BroadcastEvent) {
    const { message, title = "", icon = "", color, chatType } = event;
    if (message === undefined || color === undefined || chatType === undefined) return;
    console.broadcast(message, "Event");

    const channel = await this.getChannel(chatType);
    if (channel === null || !channel.isSendable()) return console.error(`Channel "${chatType.replace(/§[0-9a-fk-or]/g, "").trim()}" not found!`);
    await channel.send({ embeds: [new Embed().setColor(color).setDescription(message).setAuthor({ name: title, iconURL: icon }).setFooter(null)] });
  }

  override async onPlayerToggle(event: BroadcastEvent) {
    let { fullMessage, username, message, color, chatType } = event;
    if (fullMessage === undefined || username === undefined || message === undefined || color === undefined || chatType === undefined) return;
    console.broadcast(message, "Event");
    const channel = await this.getChannel(chatType);
    if (channel === null || !channel.isSendable()) return console.error(`Channel "${chatType.replace(/§[0-9a-fk-or]/g, "").trim()}" not found!`);

    switch (this.application.config.bridge.discord.mode) {
      case "bot":
        await channel.send({
          embeds: [
            new Embed()
              .setColor(color)
              .setAuthor({ name: message, iconURL: `https://www.mc-heads.net/avatar/${username}` })
              .setFooter(null)
          ]
        });
        break;
      case "webhook":
        message = this.cleanMessage(message);
        if (message.length === 0) return;
        const webhook = await this.getWebhook("Guild");
        if (webhook === null) return;
        await webhook.send({
          username: username,
          avatarURL: `https://www.mc-heads.net/avatar/${username}`,
          embeds: [new Embed().setColor(color).setDescription(message).setFooter(null)]
        });
        break;
      case "minecraft":
        await channel.send({ files: [new AttachmentBuilder(await messageToImage(fullMessage), { name: `${username}.png` })] });
        break;
      default:
        throw new HypixelDiscordChatBridgeError("Invalid message mode: must be bot or webhook");
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
    return replaceVariables(message, data);
  }

  isGuildReady(): this is DiscordManagerWithGuild {
    return this.guild?.id !== undefined;
  }

  isClientOnline(): this is DiscordManagerWithClient {
    return this.client?.isReady() !== undefined;
  }

  async getChannel(type: ChannelName): Promise<Channel | null> {
    if (!this.isClientOnline()) return null;
    const cleanType = removeColorCodes(type);
    if ((LoggerChannelNames as readonly string[]).includes(cleanType)) return await this.getLoggerChannel(cleanType as LoggerChannelName);
    const configKeyMap: Record<GenericChannelName, keyof typeof this.application.config.bridge.channels> = { Guild: "guild", Officer: "officer", Debug: "debug" };
    if (!(cleanType in configKeyMap)) return null;
    const configKey = configKeyMap[cleanType as GenericChannelName];

    const config = this.application.config.bridge.channels[configKey];
    if (!config || !config.enabled) return null;
    if (config.channel === null) {
      if (!this.isGuildReady()) {
        this.stateHandler.loadGuild();
        throw new HypixelDiscordChatBridgeError("The discord server isn't ready. Please try again later");
      }

      const channel = await this.guild.channels.create({ name: cleanType });
      this.application.config.bridge.channels[configKey].channel = channel.id;
      this.client.config = this.application.config;
      await writeFile("config.json", JSON.stringify(this.application.config, null, 2), "utf-8");
      return channel;
    }

    return await this.client.channels.fetch(config.channel);
  }

  private async getLoggerChannel(type: LoggerChannelName): Promise<Channel | null> {
    if (!this.isClientOnline()) return null;
    const cleanType = removeColorCodes(type);
    const configKeyMap: Record<LoggerChannelName, keyof typeof this.application.config.bridge.channels.logging.channels> = {
      "Logger-Guild": "guild",
      "Logger-Event": "event",
      "Logger-Error": "error",
      "Logger-Blacklist": "blacklist",
      "Logger-Scripts": "scripts",
      "Logger-Inactivity": "inactivity"
    };

    if (!(cleanType in configKeyMap)) return null;
    const configKey = configKeyMap[cleanType as LoggerChannelName];
    const currentChannelId = this.application.config.bridge.channels.logging.channels[configKey];

    if (currentChannelId === null) {
      const parentChannelId = this.application.config.bridge.channels.logging.channel;
      if (!parentChannelId) return null;
      const basicChannel = await this.client.channels.fetch(parentChannelId);
      if (!basicChannel || !basicChannel.isSendable() || basicChannel.type !== ChannelType.GuildText) return null;
      const thread = await basicChannel.threads.create({ name: cleanType });
      await thread.send(`<@&${this.application.config.discord.commands.staffRole}>`);
      this.application.config.bridge.channels.logging.channels[configKey] = thread.id;
      this.client.config = this.application.config;
      await writeFile("config.json", JSON.stringify(this.application.config, null, 2), "utf-8");
      return thread;
    }

    return await this.client.channels.fetch(currentChannelId);
  }

  getErrorEmbed(error: Error | HypixelDiscordChatBridgeError): ErrorEmbed {
    const errorStack = error instanceof Error ? (error.stack ?? error.message) : String(error ?? "Unknown");
    return new ErrorEmbed().setDescription(`\`\`\`${errorStack}\`\`\``);
  }

  async logError(error: Error | HypixelDiscordChatBridgeError) {
    if (error instanceof HypixelDiscordChatBridgeError) return;
    if (!this.isClientOnline()) return;

    try {
      const channel = await this.getChannel("Logger-Error");
      if (!channel || !channel.isSendable()) return;

      const hasPermission = await canSendMessages(channel);
      if (!hasPermission) return;

      const owners = await getApplicationOwners(this.client);
      await channel.send({
        content: `${owners.map((id) => `<@${id}>`).join(" ")} <@&${this.application.config.discord.commands.staffRole}>`,
        embeds: [this.getErrorEmbed(error)]
      });
    } catch (e) {
      console.error(e);
    }
  }

  async handleError(
    error: Error | HypixelDiscordChatBridgeError,
    interaction: ChatInputCommandInteraction | ButtonInteraction | AutocompleteInteraction | ModalSubmitInteraction | null = null
  ) {
    console.error(error);
    await this.logError(error);
    if (!interaction || interaction.isAutocomplete()) return;

    const embed = new ErrorEmbed();
    if (error instanceof HypixelDiscordChatBridgeError) embed.setDescription(`\`\`\`${error.message}\`\`\``);
    else embed.setDescription("This error has been reported to the owner. Please try again later.");

    try {
      if (interaction.replied || interaction.deferred) await interaction.followUp({ embeds: [embed], flags: MessageFlags.Ephemeral });
      else await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      if (!(error instanceof HypixelDiscordChatBridgeError)) await interaction.followUp({ embeds: [this.getErrorEmbed(error)], flags: MessageFlags.Ephemeral });
    } catch (e) {
      console.error(e);
    }
  }
}

export default DiscordManager;
