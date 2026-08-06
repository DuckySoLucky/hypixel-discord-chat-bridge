import type BasicScript from "../scripts/BasicScript.js";
import type BridgeEventBus from "../private/BridgeEventBus.js";
import type DiscordButton from "../discord/private/buttons/DiscordButton.js";
import type DiscordCommand from "../discord/private/commands/DiscordCommand.js";
import type DiscordManager from "../discord/DiscordManager.js";
import type DiscordModal from "../discord/private/modals/DiscordModal.js";
import type MinecraftCommand from "../minecraft/private/commands/MinecraftCommand.js";
import type MinecraftManager from "../minecraft/MinecraftManager.js";
import type ScriptManager from "../scripts/ScriptsManager.js";
import type { Lifecycle } from "../core/Lifecycle.js";

interface BridgePluginMetadata {
  readonly id: string;
  readonly name: string;
  readonly version: string;
}

interface BridgePluginContext {
  readonly events: BridgeEventBus;
  readonly logger: BridgePluginLogger;
  registerDiscordCommand(factory: DiscordCommandFactory): void;
  registerMinecraftCommand(factory: MinecraftCommandFactory): void;
  registerButton(factory: DiscordButtonFactory): void;
  registerModal(factory: DiscordModalFactory): void;
  registerScript(factory: ScriptFactory): void;
}

interface BridgePluginLogger {
  info(message: string): void;
  warn(message: string): void;
  error(error: unknown): void;
}

type DiscordCommandFactory = (discord: DiscordManager) => DiscordCommand<DiscordManager>;
type MinecraftCommandFactory = (minecraft: MinecraftManager) => MinecraftCommand<MinecraftManager>;
type DiscordButtonFactory = (discord: DiscordManager) => DiscordButton<DiscordManager>;
type DiscordModalFactory = (discord: DiscordManager) => DiscordModal<DiscordManager>;
type ScriptFactory = (scripts: ScriptManager) => BasicScript;

abstract class BridgePlugin implements Lifecycle {
  abstract readonly metadata: BridgePluginMetadata;

  constructor(protected readonly context: BridgePluginContext) {}

  abstract registerExtensions(): Promise<void>;
  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;
}

export type {
  BridgePluginContext,
  BridgePluginLogger,
  BridgePluginMetadata,
  DiscordButtonFactory,
  DiscordCommandFactory,
  DiscordModalFactory,
  MinecraftCommandFactory,
  ScriptFactory
};
export default BridgePlugin;
