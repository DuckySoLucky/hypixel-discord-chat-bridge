import ExtensionRegistry from "../extensions/ExtensionRegistry.js";
import isPluginEntry from "./pluginDiscovery.js";
import loadExtensionModules from "../extensions/moduleLoader.js";
import { access } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { toError } from "../utils/asyncUtils.js";
import type Application from "../Application.js";
import type BridgePlugin from "./BridgePlugin.js";
import type { BridgePluginContext } from "./BridgePlugin.js";
import type { Lifecycle } from "../core/Lifecycle.js";

class PluginManager implements Lifecycle {
  readonly #plugins = new ExtensionRegistry<BridgePlugin>();
  readonly #started = new Set<BridgePlugin>();
  private loaded: boolean = false;

  constructor(readonly application: Application) {}

  async load(): Promise<void> {
    if (this.loaded) return;
    const directoryPath = resolve("plugins");
    try {
      await access(directoryPath);
    } catch {
      this.loaded = true;
      return;
    }

    const context: BridgePluginContext = {
      events: this.application.events,
      logger: { info: (message) => console.info(message), warn: (message) => console.warn(message), error: (error) => console.error(error) },
      registerDiscordCommand: (factory) => this.application.discord.commandHandler.registerCommand(factory(this.application.discord), "plugin"),
      registerMinecraftCommand: (factory) => this.application.minecraft.commandHandler.registerCommand(factory(this.application.minecraft), "plugin"),
      registerButton: (factory) => this.application.discord.buttonHandler.registerButton(factory(this.application.discord), "plugin"),
      registerModal: (factory) => this.application.discord.modalHandler.registerModal(factory(this.application.discord), "plugin"),
      registerScript: (factory) => this.application.scripts.registerScript(factory(this.application.scripts), "plugin")
    };
    const directory = new URL(`${pathToFileURL(directoryPath).href}/`);
    const modules = await loadExtensionModules<BridgePlugin, BridgePluginContext>(directory, context, isPluginEntry);
    for (const { extension: plugin, source } of modules) {
      this.#plugins.register(plugin.metadata.id, plugin, [], source);
      await plugin.registerExtensions();
    }
    this.loaded = true;
  }

  async start(): Promise<void> {
    await this.load();
    for (const plugin of this.#plugins.values()) {
      if (this.#started.has(plugin)) continue;
      await plugin.start();
      this.#started.add(plugin);
    }
    console.other(`Successfully loaded ${this.#started.size} plugins(s).`);
  }

  async stop(): Promise<void> {
    const plugins = [...this.#started].reverse();
    this.#started.clear();
    const results = await Promise.allSettled(plugins.map((plugin) => plugin.stop()));
    for (const result of results) {
      if (result.status === "rejected") console.error(toError(result.reason));
    }
  }

  get plugins(): readonly BridgePlugin[] {
    return this.#plugins.values();
  }
}

export default PluginManager;
