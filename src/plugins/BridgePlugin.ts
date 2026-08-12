import { toCamelCase } from "../utils/stringUtils.ts";
import type Application from "../Application.ts";
import type BasicScript from "../scripts/BasicScript.js";
import type BridgeEventBus from "../private/BridgeEventBus.js";
import type DiscordButton from "../discord/private/buttons/DiscordButton.js";
import type DiscordCommand from "../discord/private/commands/DiscordCommand.js";
import type DiscordModal from "../discord/private/modals/DiscordModal.js";
import type MinecraftCommand from "../minecraft/private/commands/MinecraftCommand.js";
import type ScriptManager from "../scripts/ScriptsManager.js";
import type { DiscordManagerWithPlugin } from "../types/discord.js";
import type { Lifecycle } from "../core/Lifecycle.js";
import type { MinecraftManagerWithPlugin } from "../types/minecraft.js";

export interface BridgePluginMetadata {
  readonly name: string;
  readonly description: string;
  readonly version: string;
  readonly author: string;
  readonly link?: string;
}

export interface BridgePluginContext<Plugin> {
  readonly events: BridgeEventBus;
  readonly logger: BridgePluginLogger;
  registerDiscordCommand(factory: DiscordCommandFactory<Plugin>): void;
  registerMinecraftCommand(factory: MinecraftCommandFactory<Plugin>): void;
  registerButton(factory: DiscordButtonFactory<Plugin>): void;
  registerModal(factory: DiscordModalFactory<Plugin>): void;
  registerScript(factory: ScriptFactory): void;
}

export interface BridgePluginLogger {
  info(message: string): void;
  warn(message: string): void;
  error(error: unknown): void;
}

export type DiscordCommandFactory<Plugin> = (discord: DiscordManagerWithPlugin<Plugin>) => DiscordCommand<DiscordManagerWithPlugin<Plugin>>;
export type MinecraftCommandFactory<Plugin> = (minecraft: MinecraftManagerWithPlugin<Plugin>) => MinecraftCommand<MinecraftManagerWithPlugin<Plugin>>;
export type DiscordButtonFactory<Plugin> = (discord: DiscordManagerWithPlugin<Plugin>) => DiscordButton<DiscordManagerWithPlugin<Plugin>>;
export type DiscordModalFactory<Plugin> = (discord: DiscordManagerWithPlugin<Plugin>) => DiscordModal<DiscordManagerWithPlugin<Plugin>>;
export type ScriptFactory = (scripts: ScriptManager) => BasicScript;

export default abstract class BridgePlugin<Plugin> implements Lifecycle {
  abstract readonly metadata: BridgePluginMetadata;

  constructor(
    protected readonly context: BridgePluginContext<Plugin>,
    readonly application: Application
  ) {}

  abstract registerExtensions(): Promise<void>;
  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;

  get id(): string {
    return toCamelCase(this.metadata.name);
  }
}
