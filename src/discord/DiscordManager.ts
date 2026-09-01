import ButtonHandler from "./handlers/ButtonHandler.js";
import CommandHandler from "./handlers/CommandHandler.js";
import CommunicationBridge from "../private/CommunicationBridge.js";
import EmbedHelper, { ErrorEmbed } from "./private/EmbedHelper.js";
import EventHandler from "./handlers/EventHandler.js";
import HypixelDiscordChatBridgeError from "../private/error.js";
import InteractionHandler from "./handlers/InteractionHandler.js";
import MessageHandler from "./handlers/MessageHandler.js";
import ModalHandler from "./handlers/ModalHandler.js";
import StateHandler from "./handlers/StateHandler.js";
import { AttachmentBuilder, type Channel, ChannelType, Client, DiscordjsError, Events, GatewayIntentBits, Guild, MessageFlags, Webhook } from "discord.js";
import {
  type AutocompleteInteractionWithGuild,
  type ButtonInteractionWithGuild,
  type ChannelName,
  type ChatInputCommandInteractionWithGuild,
  type DiscordManagerWithClient,
  type DiscordManagerWithGuild,
  type EmbedHelperField,
  type GenericChannelName,
  type LoggerChannelName,
  LoggerChannelNames,
  type ModalSubmitInteractionWithGuild
} from "../types/discord.js";
import { canSendMessages, getApplicationOwners, parseInteractionType } from "../utils/discordUtils.js";
import { getErrorEmbed, getErrorTypeName } from "../utils/miscUtils.js";
import { messageToImage } from "../utils/minecraftUtils.js";
import { removeColorCodes, replaceVariables } from "../utils/stringUtils.js";
import { safeListener, toError } from "../utils/asyncUtils.js";
import { writeFile } from "node:fs/promises";
import type Application from "../Application.js";
import type { CleanEmbedEvent, HeadedEmbedEvent, MinecraftToDiscordMessage, PlayerToggleEvent } from "../types/bridge.js";
import type { HypixelAPIRebornError } from "hypixel-api-reborn";
import type { Lifecycle, LifecycleState } from "../core/Lifecycle.js";

class DiscordManager extends CommunicationBridge implements Lifecycle {
  readonly buttonHandler: ButtonHandler;
  readonly commandHandler: CommandHandler;
  readonly eventHandler: EventHandler;
  readonly interactionHandler: InteractionHandler;
  readonly messageHandler: MessageHandler;
  readonly stateHandler: StateHandler;
  readonly modalHandler: ModalHandler;
  private state: LifecycleState = "idle";
  private startPromise?: Promise<void>;
  client?: Client;
  guild?: Guild;
  constructor(readonly application: Application) {
    super(application.events);
    this.buttonHandler = new ButtonHandler(this);
    this.commandHandler = new CommandHandler(this);
    this.eventHandler = new EventHandler(this);
    this.interactionHandler = new InteractionHandler(this);
    this.messageHandler = new MessageHandler(this);
    this.stateHandler = new StateHandler(this);
    this.modalHandler = new ModalHandler(this);
  }

  start(): Promise<void> {
    if (this.state === "running") return Promise.resolve();
    if (this.startPromise) return this.startPromise;

    this.state = "starting";
    this.stopBridgeListeners();
    this.listen("minecraft-message", (event) => this.onBroadcast(event));
    this.listen("player-toggle", (event) => this.onPlayerToggle(event));
    this.listen("clean-embed", (event) => this.onBroadcastCleanEmbed(event));
    this.listen("headed-embed", (event) => this.onBroadcastHeadedEmbed(event));
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });
    this.client = client;
    client.config = this.application.config;
    client.discordManager = this;

    const readyPromise = new Promise<void>((resolve, reject) => {
      client.once(
        Events.ClientReady,
        safeListener(async () => {
          try {
            await this.stateHandler.onReady();
            this.state = "running";
            resolve();
          } catch (error: unknown) {
            reject(toError(error));
          }
        }, reject)
      );
    });

    client.on(
      Events.MessageCreate,
      safeListener((message) => this.messageHandler.onMessage(message), this.reportError)
    );
    client.on(
      Events.InteractionCreate,
      safeListener((interaction) => this.interactionHandler.onInteraction(interaction), this.reportError)
    );
    client.on(
      Events.GuildMemberAdd,
      safeListener((member) => this.eventHandler.onGuildMemberAdd(member), this.reportError)
    );
    client.on(
      Events.GuildMemberRemove,
      safeListener((member) => this.eventHandler.onGuildMemberRemove(member), this.reportError)
    );

    this.startPromise = (async () => {
      try {
        await this.commandHandler.deployRegisteredCommands();
        await client.login(this.application.config.discord.token);
        await readyPromise;
      } catch (error: unknown) {
        this.state = "idle";
        client.removeAllListeners();
        await client.destroy().catch(console.error);
        if (this.client === client) this.client = undefined;
        throw toError(error);
      } finally {
        this.startPromise = undefined;
      }
    })();

    return this.startPromise;
  }

  async stop(): Promise<void> {
    if (this.state === "stopping" || this.state === "idle") return;
    this.state = "stopping";
    if (this.isClientOnline()) await this.stateHandler.onClose();
    const client = this.client;
    this.client = undefined;
    this.guild = undefined;
    if (client) {
      client.removeAllListeners();
      await client.destroy();
    }
    this.stopBridgeListeners();
    this.state = "idle";
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

  async onBroadcast(event: MinecraftToDiscordMessage): Promise<void> {
    let { fullMessage, chatType, message } = event;
    const mode = chatType === "Debug" ? "text" : this.application.config.bridge.discord.mode;
    message = ["text"].includes(mode) ? fullMessage : message;
    if (message.trim().length === 0) return;

    const channel = await this.getChannel(chatType);
    if (channel === null || !channel.isSendable()) return console.error(`Channel "${chatType.replace(/§[0-9a-fk-or]/g, "").trim()}" not found!`);
    if (event.chatType === "Debug") {
      await channel.send({ content: message });
      return;
    }

    const { username, rank, guildRank, color = "Green" } = event;
    console.broadcast(`${username} [${guildRank.replace(/§[0-9a-fk-or]/g, "").replace(/^\[|\]$/g, "")}]: ${message}`, "Discord");

    if (mode === "minecraft") message = replaceVariables(this.application.config.bridge.discord.format, { chatType, username, rank, guildRank, message });

    switch (mode) {
      case "bot": {
        await channel.send({
          embeds: [
            new EmbedHelper()
              .setColor(color)
              .setDescription(message)
              .setFooter({ text: guildRank })
              .setAuthor({ name: username, iconURL: `https://www.mc-heads.net/avatar/${username}` })
          ]
        });

        if (message.includes("https://")) {
          const links = message.match(/https?:\/\/[^\s]+/g);
          if (links) await channel.send(links.join("\n"));
        }

        break;
      }
      case "webhook": {
        message = this.cleanMessage(message);
        if (message.length === 0) return;
        const webhook = await this.getWebhook(chatType);
        if (webhook === null) return;
        await webhook.send({ content: message, username: username, avatarURL: `https://www.mc-heads.net/avatar/${username}` });
        break;
      }
      case "minecraft": {
        await channel.send({ files: [new AttachmentBuilder(await messageToImage(message, username), { name: `${username}.png` })] });
        if (message.includes("https://")) {
          const links = message.match(/https?:\/\/[^\s]+/g);
          if (links) await channel.send(links.join("\n"));
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

  async onBroadcastCleanEmbed(event: CleanEmbedEvent): Promise<void> {
    const { chatType, message, color } = event;
    if (chatType === undefined || message === undefined || color === undefined) return;
    console.broadcast(message, "Event");

    const channel = await this.getChannel(chatType);
    if (channel === null || !channel.isSendable()) return console.error(`Channel "${chatType.replace(/§[0-9a-fk-or]/g, "").trim()}" not found!`);
    await channel.send({ embeds: [new EmbedHelper().setColor(color).setDescription(message).setFooter(null)] });
  }

  async onBroadcastHeadedEmbed(event: HeadedEmbedEvent): Promise<void> {
    const { message, title = "", icon = "", color, chatType } = event;
    if (message === undefined || color === undefined || chatType === undefined) return;
    console.broadcast(message, "Event");

    const channel = await this.getChannel(chatType);
    if (channel === null || !channel.isSendable()) return console.error(`Channel "${chatType.replace(/§[0-9a-fk-or]/g, "").trim()}" not found!`);
    await channel.send({ embeds: [new EmbedHelper().setColor(color).setDescription(message).setAuthor({ name: title, iconURL: icon }).setFooter(null)] });
  }

  async onPlayerToggle(event: PlayerToggleEvent): Promise<void> {
    let { fullMessage, username, message, color, chatType } = event;
    if (fullMessage === undefined || username === undefined || message === undefined || color === undefined || chatType === undefined) return;
    console.broadcast(message, "Event");
    const channel = await this.getChannel(chatType);
    if (channel === null || !channel.isSendable()) return console.error(`Channel "${chatType.replace(/§[0-9a-fk-or]/g, "").trim()}" not found!`);

    switch (this.application.config.bridge.discord.mode) {
      case "bot":
        await channel.send({
          embeds: [
            new EmbedHelper()
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
          embeds: [new EmbedHelper().setColor(color).setDescription(message).setFooter(null)]
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

  formatMessage(message: string, data: Readonly<Record<string, import("../utils/stringUtils.js").TemplatePrimitive>>): string {
    return replaceVariables(message, data);
  }

  isGuildReady(): this is DiscordManagerWithGuild {
    return this.guild?.id !== undefined;
  }

  isClientOnline(): this is DiscordManagerWithClient {
    return this.client?.isReady() === true;
  }

  hasClient(): this is DiscordManager & { client: Client } {
    return this.client !== undefined;
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
        await this.stateHandler.loadGuild();
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

  async logError(error: Error | DiscordjsError | HypixelDiscordChatBridgeError | HypixelAPIRebornError, extraData: EmbedHelperField[] = []) {
    if (!this.isClientOnline()) return;

    try {
      const channel = await this.getChannel("Logger-Error");
      if (!channel || !channel.isSendable()) return;

      const hasPermission = await canSendMessages(channel);
      if (!hasPermission) return;
      const owners = await getApplicationOwners(this.client);
      await channel.send({
        content: getErrorTypeName(error) === "Generic Error" ? owners.map((id) => `<@${id}>`).join(" ") : "",
        embeds: [getErrorEmbed(error, extraData)]
      });
    } catch (e) {
      console.error(e);
    }
  }

  async handleError(
    error: Error | DiscordjsError | HypixelDiscordChatBridgeError | HypixelAPIRebornError,
    interaction: ChatInputCommandInteractionWithGuild | ButtonInteractionWithGuild | AutocompleteInteractionWithGuild | ModalSubmitInteractionWithGuild | null = null
  ) {
    console.error(error);
    const extraErrorData: EmbedHelperField[] = [];
    if (interaction) {
      extraErrorData.push({ name: "User", value: `\`@${interaction.user.username}\` (\`${interaction.user.id}\`) <@${interaction.user.id}>` });
      extraErrorData.push({ name: "Interaction Type", value: parseInteractionType(interaction.type) });
      if (interaction.isCommand()) extraErrorData.push({ name: "Command", value: interaction.commandName, smallBlockValue: true });
      if (interaction.isButton()) extraErrorData.push({ name: "Button", value: interaction.customId, smallBlockValue: true });
    }
    await this.logError(error, extraErrorData);
    if (!interaction || interaction.isAutocomplete()) return;

    const embed = new ErrorEmbed();
    if (error instanceof HypixelDiscordChatBridgeError) embed.setDescription(`\`\`\`${error.message}\`\`\``);
    else embed.setDescription("This error has been reported to the owner. Please try again later.");

    try {
      if (interaction.replied || interaction.deferred) await interaction.followUp({ embeds: [embed], flags: MessageFlags.Ephemeral });
      else await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      if (!(error instanceof HypixelDiscordChatBridgeError)) await interaction.followUp({ embeds: [getErrorEmbed(error)], flags: MessageFlags.Ephemeral });
    } catch (e) {
      console.error(e);
    }
  }

  private readonly reportError = (error: unknown): Promise<void> => this.handleError(toError(error));
}

export default DiscordManager;
