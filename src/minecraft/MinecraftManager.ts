import CommandHandler from "./handlers/CommandHandler.js";
import CommunicationBridge from "../private/CommunicationBridge.js";
import MessageHandler from "./handlers/MessageHandler.js";
import MinecraftData from "minecraft-data";
import PrismarineChat from "prismarine-chat";
import PrismarineRegistry, { type RegistryPc } from "prismarine-registry";
import StateHandler from "./handlers/StateHandler.js";
import { type Client, createClient } from "minecraft-protocol";
import { ResourcePackResult } from "../types/minecraft.js";
import { replaceVariables } from "../utils/stringUtils.js";
import type Application from "../Application.js";
import type { BroadcastEvent } from "../types/bridge.js";
import type { MinecraftManagerWithBot } from "../types/minecraft.js";
import type { NBT } from "prismarine-nbt";
import type { PrismarineChatFormatter } from "prismarine-chat";

class MinecraftManager extends CommunicationBridge {
  readonly supportedVersions: string[] = ["1.21.11"];
  readonly unsupportedVersions: Record<string, { reason: string; disable: boolean }> = {
    "1.8.9": { reason: "1.8.9 is old and outdated. It will no longer be supported please move to 1.21.11", disable: true }
  };
  readonly stateHandler: StateHandler;
  readonly commandHandler: CommandHandler;
  readonly messageHandler: MessageHandler;
  readonly prismarineRegistry: RegistryPc;
  readonly prismarineChat: PrismarineChatFormatter;
  private readonly indexedData;
  bot?: Client;
  constructor(readonly application: Application) {
    super();
    this.stateHandler = new StateHandler(this);
    this.commandHandler = new CommandHandler(this);
    this.messageHandler = new MessageHandler(this);
    this.prismarineRegistry = PrismarineRegistry(this.application.config.minecraft.bot.version) as RegistryPc;
    this.prismarineChat = PrismarineChat(this.prismarineRegistry);
    this.indexedData = MinecraftData(this.application.config.minecraft.bot.version);
  }

  async connect() {
    this.bot = this.createBotConnection();
    this.listenForRegistry(this.bot);
    this.listenForSettings(this.bot);
    this.listenForResourcePacks(this.bot);

    this.stateHandler.registerEvents();
    await this.commandHandler.deployCommands();
    this.messageHandler.registerEvents();
  }

  private createBotConnection() {
    const version = this.unsupportedVersions[this.application.config.minecraft.bot.version];
    if (version) {
      console.warn(`[minecraft.bot.version] You currently have an unsupported version selected (${this.application.config.minecraft.bot.version})`);
      console.warn(`[minecraft.bot.version] ${version.reason}`);
      console.warn(`[minecraft.bot.version] The currently supported versions are ${this.supportedVersions.join(", ")}`);
      if (version.disable) process.exit(1);
    }

    if (!this.supportedVersions.includes(this.application.config.minecraft.bot.version)) {
      console.warn(`[minecraft.bot.version] You currently have an unsupported version selected (${this.application.config.minecraft.bot.version})`);
      console.warn("[minecraft.bot.version] While it may work we cannot guarantee it to work");
      console.warn(`[minecraft.bot.version] The currently supported versions are ${this.supportedVersions.join(", ")}`);
    }

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
    return this.bot !== undefined;
  }

  override onBroadcast(event: BroadcastEvent) {
    if (!this.isBotOnline()) return;
    let { channelId, username, message, replyingTo, discordMessage } = event;
    if (channelId === undefined || username === undefined || message === undefined || replyingTo === undefined || discordMessage === undefined) return;
    console.broadcast(`${username}: ${message}`, "Minecraft");

    if (channelId === this.application.config.bridge.channels.debug.channel && this.application.config.bridge.channels.debug.enabled === true) {
      return this.bot.chat(message);
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

    message = replaceVariables(this.application.config.bridge.minecraft.format, { username, message });
    const chat = channelId === this.application.config.bridge.channels.officer.channel ? "/oc" : "/gc";
    if (replyingTo) message = message.replace(username, `${username} replying to ${replyingTo}`);

    let successfullySent = false;
    const messageListener = (data: { positionId: number; formattedMessage: string }) => {
      const chatMessage = this.prismarineChat.fromNotch(data.formattedMessage);
      const receivedMessage = chatMessage.toString();

      if (receivedMessage.trim().includes(message.trim()) && (this.messageHandler.isGuildMessage(receivedMessage) || this.messageHandler.isOfficerMessage(receivedMessage))) {
        this.bot.removeListener("systemChat", messageListener);
        successfullySent = true;
      }
    };

    this.bot.on("systemChat", messageListener);
    this.bot.chat(`${chat} ${message}`);

    setTimeout(() => {
      this.bot.removeListener("systemChat", messageListener);
      if (successfullySent === true) return;
      discordMessage.react("❌");
    }, 500);
  }
}

export default MinecraftManager;
