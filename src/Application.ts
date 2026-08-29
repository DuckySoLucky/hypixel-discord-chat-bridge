import BridgeEventBus from "./private/BridgeEventBus.js";
import DataManager from "./data/DataManager.js";
import DiscordManager from "./discord/DiscordManager.js";
import HypixelDiscordChatBridgeError from "./private/error.js";
import MinecraftManager from "./minecraft/MinecraftManager.js";
import MowojangAPI from "./private/MowojangAPI.js";
import PluginManager from "./plugins/PluginManager.js";
import ScriptManager from "./scripts/ScriptsManager.js";
import messages from "./messages.json" with { type: "json" };
import packageJson from "../package.json" with { type: "json" };
import { Filter } from "bad-words";
import { getGuild } from "./utils/hypixelUtils.js";
import type { Config } from "./types/config.js";
import type { Guild } from "hypixel-api-reborn";
import type { Lifecycle, LifecycleState } from "./core/Lifecycle.js";
import type { MowojangProfile } from "mowojang";

class Application implements Lifecycle {
  readonly package: typeof packageJson;
  readonly messages: typeof messages;
  readonly data: DataManager;
  readonly events: BridgeEventBus;
  readonly discord: DiscordManager;
  readonly minecraft: MinecraftManager;
  readonly plugins: PluginManager;
  readonly scripts: ScriptManager;
  readonly filter: Filter;
  private state: LifecycleState = "idle";
  private extensionsLoaded: boolean = false;
  botGuild?: Guild;
  botGuildMembers?: MowojangProfile[];
  constructor(
    readonly config: Config,
    deployScripts: boolean = true
  ) {
    this.package = packageJson;
    this.messages = messages;
    this.events = new BridgeEventBus();
    this.data = new DataManager(this);
    this.discord = new DiscordManager(this);
    this.minecraft = new MinecraftManager(this);
    this.scripts = new ScriptManager(this, deployScripts);
    this.plugins = new PluginManager(this);

    this.filter = new Filter();
    this.filter.addWords(...(this.config.bridge.filter.customWords ?? []));
  }

  async start(): Promise<void> {
    if (this.state === "running" || this.state === "starting") return;
    this.state = "starting";
    try {
      await this.data.start();
      if (!this.extensionsLoaded) {
        await Promise.all([
          this.discord.commandHandler.loadCommands(),
          this.discord.buttonHandler.loadButtons(),
          this.discord.modalHandler.loadModals(),
          this.minecraft.commandHandler.loadCommands()
        ]);
        await this.plugins.load();
        this.extensionsLoaded = true;
      }
      await this.discord.start();
      await this.minecraft.start();
      await this.plugins.start();
      await this.scripts.start();
      this.state = "running";
    } catch (error: unknown) {
      try {
        await this.stop();
      } catch (shutdownError: unknown) {
        console.error(shutdownError);
      }
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (this.state === "stopping" || this.state === "idle") return;
    this.state = "stopping";
    const errors: unknown[] = [];
    for (const stop of [() => this.scripts.stop(), () => this.plugins.stop(), () => this.minecraft.stop(), () => this.discord.stop(), () => this.data.stop()]) {
      try {
        await stop();
      } catch (error: unknown) {
        errors.push(error);
      }
    }
    this.state = "idle";
    if (errors.length > 0) throw new AggregateError(errors, "Application shutdown failed.");
  }

  async getBotGuild(): Promise<Guild> {
    if (!this.minecraft.hasBot()) throw new HypixelDiscordChatBridgeError(this.messages.minecraftBotOffline);
    this.botGuild = await getGuild("player", this.minecraft.bot.username).then((guild) => {
      if (guild === null) throw new HypixelDiscordChatBridgeError("In game Hypixel Guild not found.");
      return guild;
    });
    this.botGuildMembers = await MowojangAPI.getProfiles(this.botGuild.members.map((member) => member.uuid)).then((data) => {
      if (data.data === null) return undefined;
      return data.data;
    });
    if (this.config.blacklist.enabled && this.config.blacklist.actions.kickFromGuild.enabled) {
      await Promise.all(
        this.botGuild.members.map(async (user) => {
          if (!this.minecraft.hasBot()) return;
          const blacklistUser = await this.data.blacklist.getUserByUUID(user.uuid);
          if (blacklistUser) this.minecraft.bot.chat(`/g kick ${await blacklistUser.getUsername()} ${this.config.blacklist.actions.kickFromGuild.reason}`);
        })
      );
    }
    return this.botGuild;
  }
}

export default Application;
