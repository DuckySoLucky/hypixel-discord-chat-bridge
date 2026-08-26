import CommandHandler from "./handlers/CommandHandler.js";
import CommunicationBridge from "../private/CommunicationBridge.js";
import MessageHandler from "./handlers/MessageHandler.js";
import MinecraftData from "minecraft-data";
import MinecraftRequestBroker, { MinecraftRequestTimeoutError } from "./MinecraftRequestBroker.js";
import PrismarineChat from "prismarine-chat";
import PrismarineRegistry, { type RegistryPc } from "prismarine-registry";
import StateHandler from "./handlers/StateHandler.js";
import ms, { type StringValue } from "ms";
import { type Client, createClient } from "minecraft-protocol";
import { ResourcePackResult } from "../types/minecraft.js";
import { replaceVariables } from "../utils/stringUtils.js";
import { runDetached, toError } from "../utils/asyncUtils.js";
import type Application from "../Application.js";
import type { DiscordToMinecraftMessage } from "../types/bridge.js";
import type { Lifecycle, LifecycleState } from "../core/Lifecycle.js";
import type { MinecraftManagerWithBot } from "../types/minecraft.js";
import type { NBT } from "prismarine-nbt";
import type { PrismarineChatFormatter } from "prismarine-chat";

class MinecraftManager extends CommunicationBridge implements Lifecycle {
  static supportedVersions: string[] = ["1.21.11"];
  static unsupportedVersions: Record<string, { reason: string; disable: boolean }> = {
    "1.8.9": { reason: "1.8.9 is old and outdated. It will no longer be supported please move to 1.21.11 or higher", disable: true }
  };
  readonly stateHandler: StateHandler;
  readonly commandHandler: CommandHandler;
  readonly messageHandler: MessageHandler;
  readonly prismarineRegistry: RegistryPc;
  readonly prismarineChat: PrismarineChatFormatter;
  readonly requestBroker: MinecraftRequestBroker;
  private readonly indexedData;
  private readonly intentionallyClosedClients = new WeakSet<Client>();
  private state: LifecycleState = "idle";
  private reconnectTimer?: NodeJS.Timeout;
  private startPromise?: Promise<void>;
  private resolveStart?: () => void;
  private rejectStart?: (error: Error) => void;
  bot?: Client;
  constructor(readonly application: Application) {
    super(application.events);
    this.stateHandler = new StateHandler(this);
    this.commandHandler = new CommandHandler(this);
    this.messageHandler = new MessageHandler(this);
    this.prismarineRegistry = PrismarineRegistry(this.application.config.minecraft.bot.version) as RegistryPc;
    this.prismarineChat = PrismarineChat(this.prismarineRegistry);
    this.requestBroker = new MinecraftRequestBroker(this.prismarineChat);
    this.indexedData = MinecraftData(this.application.config.minecraft.bot.version);
  }

  async start(): Promise<void> {
    if (this.state === "running") return;
    if (this.startPromise) return this.startPromise;

    this.state = "starting";
    this.stopBridgeListeners();
    this.listen("discord-message", (event) => this.onBroadcast(event));
    const client = this.createBotConnection();
    this.bot = client;
    const startupPromise = new Promise<void>((resolve, reject) => {
      this.resolveStart = resolve;
      this.rejectStart = reject;
    });
    this.startPromise = startupPromise;

    this.listenForRegistry(client);
    this.listenForSettings(client);
    this.listenForResourcePacks(client);
    this.requestBroker.start(client);
    this.stateHandler.registerEvents(client);
    this.messageHandler.registerEvents(client);

    try {
      await startupPromise;
    } catch (error: unknown) {
      this.finishStart();
      this.state = "idle";
      throw toError(error);
    }
  }

  stop(): Promise<void> {
    if (this.state === "stopping") return Promise.resolve();
    this.state = "stopping";
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = undefined;
    this.requestBroker.stop(new Error("Minecraft client is shutting down."));
    this.stopBridgeListeners();

    const client = this.bot;
    this.bot = undefined;
    if (client) {
      this.intentionallyClosedClients.add(client);
      client.end("Application shutdown");
      client.removeAllListeners();
    }

    this.rejectStart?.(new Error("Minecraft startup was cancelled."));
    this.finishStart();
    this.state = "idle";
    return Promise.resolve();
  }

  static validateMinecraftVersion(version: string) {
    const versionData = this.unsupportedVersions[version];

    const isVersionSupported = this.supportedVersions.includes(version);
    if (!isVersionSupported) console.warn(`[minecraft.bot.version] You currently have an unsupported version selected (${version})`);

    if (versionData) {
      console.warn(`[minecraft.bot.version] ${versionData.reason}`);
      console.warn(`[minecraft.bot.version] The currently supported versions are ${this.supportedVersions.join(", ")}`);
      if (versionData.disable) process.exit(1);
    }

    if (!isVersionSupported) {
      console.warn("[minecraft.bot.version] While it may work we cannot guarantee it to work");
      console.warn(`[minecraft.bot.version] The currently supported versions are ${this.supportedVersions.join(", ")}`);
    }
  }

  private createBotConnection() {
    MinecraftManager.validateMinecraftVersion(this.application.config.minecraft.bot.version);
    return createClient({
      host: this.application.config.minecraft.bot.server,
      port: this.application.config.minecraft.bot.port,
      username: "DuckySoLucky",
      auth: "microsoft",
      version: this.application.config.minecraft.bot.version,
      profilesFolder: this.application.config.minecraft.bot.accountsLocation
    });
  }

  // Credit: https://github.com/aidn3/hypixel-guild-discord-bridge/blob/a31353fbd8c37e013c419eec0ba640040d503767/src/instance/minecraft/client-session.ts#L21-L67
  // Thank you aidn for letting me skid your shit

  /*
   * Used to create special minecraft data.
   * Main purpose is to receive signed chat messages
   * and to be able to format them based on how the server decides
   */
  private listenForRegistry(client: Client): void {
    // 1.20.2+
    client.on("registry_data", (packet: { codec?: NBT; id?: string; entries?: unknown[] }) => {
      this.prismarineRegistry.loadDimensionCodec((packet.codec ?? packet) as NBT);
    });
    // older versions
    client.on("login", (packet: { dimensionCodec?: NBT }) => {
      if (packet.dimensionCodec) {
        this.prismarineRegistry.loadDimensionCodec(packet.dimensionCodec);
      }
    });
    client.on("respawn", (packet: { dimensionCodec?: NBT }) => {
      if (packet.dimensionCodec) {
        this.prismarineRegistry.loadDimensionCodec(packet.dimensionCodec);
      }
    });
  }

  private listenForSettings(client: Client): void {
    client.on("state", (newState: string) => {
      // eslint-disable-next-line no-underscore-dangle
      const supportFeature = (client as Client & Record<string, unknown>)._supportFeature as ((name: string) => boolean) | undefined;
      if (newState !== "configuration" || supportFeature?.("hasConfigurationState") !== true) return;

      client.write("settings", {
        locale: "en_us",
        viewDistance: 2,
        chatFlags: 0,
        chatColors: true,
        skinParts: 0,
        mainHand: 1,
        enableTextFiltering: false,
        enableServerListing: true,
        particleStatus: 2
      });
    });
  }

  // Credit: https://github.com/aidn3/hypixel-guild-discord-bridge/commit/618822dac5f7b32718cb8a73b38c692805f4612d
  private listenForResourcePacks(client: Client): void {
    const activeResourcePacks = new Set<string>();

    client.on("add_resource_pack", (data: { uuid: string }) => {
      activeResourcePacks.add(data.uuid);
      this.acceptResourcePackViaUuid(client, data.uuid);
    });
    client.on("resource_pack_send", (data: unknown) => {
      if (this.indexedData.supportFeature("resourcePackUsesUUID")) {
        const typedData = data as { uuid: string; url: string };
        activeResourcePacks.add(typedData.uuid);
        this.acceptResourcePackViaUuid(client, typedData.uuid);
      } else {
        const typedData = data as { hash: string; url: string };
        this.acceptResourcePackViaHash(client, typedData.hash);
      }
    });

    client.on("remove_resource_pack", (data: { uuid?: string }) => {
      if (data.uuid === undefined) {
        activeResourcePacks.clear();
      } else {
        activeResourcePacks.delete(data.uuid);
      }
    });
  }

  private acceptResourcePackViaUuid(client: Client, uuid: string) {
    client.write("resource_pack_receive", { uuid: uuid, result: ResourcePackResult.Accepted });
    client.write("resource_pack_receive", { uuid: uuid, result: ResourcePackResult.SuccessfullyLoaded });
  }

  private acceptResourcePackViaHash(client: Client, hash: string) {
    client.write("resource_pack_receive", { result: ResourcePackResult.Accepted, hash: hash });
    client.write("resource_pack_receive", { result: ResourcePackResult.SuccessfullyLoaded, hash: hash });
  }

  isBotOnline(): this is MinecraftManagerWithBot {
    return this.bot !== undefined && this.state === "running";
  }

  hasBot(): this is MinecraftManagerWithBot {
    return this.bot !== undefined;
  }

  isCurrentClient(client: Client): boolean {
    return this.bot === client;
  }

  markReady(client: Client): void {
    if (!this.isCurrentClient(client) || this.state !== "starting") return;
    this.state = "running";
    this.resolveStart?.();
    this.finishStart();
  }

  handleDisconnect(client: Client, reason: string): boolean {
    if (this.intentionallyClosedClients.delete(client)) return false;
    if (!this.isCurrentClient(client)) return false;
    this.bot = undefined;
    this.requestBroker.stop(new Error(`Minecraft client disconnected: ${reason}`));
    this.rejectStart?.(new Error(`Minecraft client disconnected before becoming ready: ${reason}`));
    this.finishStart();
    this.state = "idle";
    return true;
  }

  scheduleReconnect(delayMs: number): void {
    if (this.state === "stopping" || this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = undefined;
      runDetached(this.start());
    }, delayMs);
  }

  async onBroadcast(event: DiscordToMinecraftMessage): Promise<void> {
    if (!this.isBotOnline()) return;
    let { channelId, username, message, replyingTo, sourceMessage } = event;
    console.broadcast(`${username}: ${message}`, "Minecraft");

    if (channelId === this.application.config.bridge.channels.debug.channel && this.application.config.bridge.channels.debug.enabled === true) {
      this.bot.chat(message);
      return;
    }

    if (this.application.config.bridge.filter.enabled) {
      try {
        message = this.application.filter.clean(message);
        username = this.application.filter.clean(username);
      } catch {
        // Do nothing
      }
    }

    if (this.application.config.bridge.stripEmojisFromUsernames) {
      try {
        username = username.replace(/:[\w\-_]+:/g, "");
      } catch {
        // Do nothing
      }
    }

    if (this.application.config.bridge.stripSpacesFromUsernames) username = username.replaceAll(" ", "");

    message = replaceVariables(this.application.config.bridge.minecraft.format, { username, message });
    const chat = channelId === this.application.config.bridge.channels.officer.channel ? "/oc" : "/gc";
    if (replyingTo) message = message.replace(username, `${username} replying to ${replyingTo}`);

    const outboundContent = message.trim();
    const acknowledgement = this.requestBroker.request({
      description: `Discord bridge message from ${username}`,
      timeoutMs: ms(this.application.config.bridge.timeout as StringValue),
      matches: (inboundContent) => {
        const expectedChannel = this.messageHandler.isGuildMessage(inboundContent) || this.messageHandler.isOfficerMessage(inboundContent);
        return expectedChannel && inboundContent.trim().includes(outboundContent);
      },
      map: () => undefined
    });
    try {
      this.bot.chat(`${chat} ${message}`);
      await acknowledgement;
    } catch (error: unknown) {
      console.error(error);
      if (this.application.config.bridge.messageErrorReactions) await sourceMessage.react("❌");
      if (error instanceof MinecraftRequestTimeoutError) return;
      await this.application.discord.logError(toError(error));
    }
  }

  private finishStart(): void {
    this.startPromise = undefined;
    this.resolveStart = undefined;
    this.rejectStart = undefined;
  }
}

export default MinecraftManager;
