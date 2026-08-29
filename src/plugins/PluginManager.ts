import ExtensionRegistry from "../extensions/ExtensionRegistry.js";
import isPluginEntry from "./pluginDiscovery.js";
import { access, mkdir, readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { toError } from "../utils/asyncUtils.js";
import type Application from "../Application.js";
import type BridgePlugin from "./BridgePlugin.js";
import type { BridgePluginContext } from "./BridgePlugin.js";
import type { DiscordManagerWithPlugin } from "../types/discord.js";
import type { Lifecycle } from "../core/Lifecycle.js";
import type { MinecraftManagerWithPlugin } from "../types/minecraft.js";

class PluginManager implements Lifecycle {
  readonly #plugins = new ExtensionRegistry<BridgePlugin<any>>();
  readonly #started = new Set<BridgePlugin<any>>();
  private loaded: boolean = false;

  constructor(readonly application: Application) {}

  private createDiscordManagerWithPlugin<Plugin>(getPlugin: () => Plugin): DiscordManagerWithPlugin<Plugin> {
    return new Proxy(this.application.discord, {
      get: (target, property, receiver) => (property === "plugin" ? getPlugin() : Reflect.get(target, property, receiver)),
      set: (target, property, value, receiver) => (property === "plugin" ? true : Reflect.set(target, property, value, receiver))
    }) as DiscordManagerWithPlugin<Plugin>;
  }

  private createMinecraftManagerWithPlugin<Plugin>(getPlugin: () => Plugin): MinecraftManagerWithPlugin<Plugin> {
    return new Proxy(this.application.minecraft, {
      get: (target, property, receiver) => (property === "plugin" ? getPlugin() : Reflect.get(target, property, receiver)),
      set: (target, property, value, receiver) => (property === "plugin" ? true : Reflect.set(target, property, value, receiver))
    }) as MinecraftManagerWithPlugin<Plugin>;
  }

  private isExtensionModule<Extension, Context>(value: unknown): value is { default: new (context: Context, application: Application) => Extension } {
    return typeof value === "object" && value !== null && typeof Reflect.get(value, "default") === "function";
  }

  async load(): Promise<void> {
    if (this.loaded) return;
    const directoryPath = resolve("plugins");
    try {
      await access(directoryPath);
    } catch {
      this.loaded = true;
      return;
    }

    const directory = new URL(`${pathToFileURL(directoryPath).href}/`);
    const files = await readdir(directory, { recursive: true, encoding: "utf-8" });
    const extension = import.meta.filename.endsWith(".ts") ? ".ts" : ".js";

    const modules: { extension: BridgePlugin<any>; source: string }[] = [];
    for (const file of files.filter((name) => name.endsWith(extension) && isPluginEntry(name))) {
      const source = new URL(file, directory).href;
      try {
        const imported: unknown = await import(source);
        if (!this.isExtensionModule<BridgePlugin<any>, BridgePluginContext<any>>(imported)) {
          throw new Error(`Invalid plugin module: ${source}. A default class export is required.`);
        }

        // eslint-disable-next-line prefer-const
        let pluginInstance: BridgePlugin<any> | undefined;
        const getPlugin = (): BridgePlugin<any> => {
          if (!pluginInstance) throw new Error(`Plugin instance is not initialized for ${source}`);
          return pluginInstance;
        };

        const context: BridgePluginContext<any> = {
          events: this.application.events,
          logger: { info: (message) => console.info(message), warn: (message) => console.warn(message), error: (error) => console.error(error) },
          registerDiscordCommand: (factory) => this.application.discord.commandHandler.registerCommand(factory(this.createDiscordManagerWithPlugin(getPlugin)), "plugin"),
          registerMinecraftCommand: (factory) =>
            this.application.minecraft.commandHandler.registerCommand(factory(this.createMinecraftManagerWithPlugin(getPlugin)), "plugin"),
          registerButton: (factory) => this.application.discord.buttonHandler.registerButton(factory(this.createDiscordManagerWithPlugin(getPlugin)), "plugin"),
          registerModal: (factory) => this.application.discord.modalHandler.registerModal(factory(this.createDiscordManagerWithPlugin(getPlugin)), "plugin"),
          registerScript: (factory) => this.application.scripts.registerScript(factory(this.application.scripts), "plugin")
        };

        const plugin = new imported.default(context, this.application);
        pluginInstance = plugin;
        modules.push({ extension: plugin, source });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to load plugin module ${source}: ${message}`);
      }
    }

    for (const { extension: plugin, source } of modules) {
      this.#plugins.register(plugin.id, plugin, [], source);
      await plugin.registerExtensions();
    }
    this.loaded = true;
  }

  async start(): Promise<void> {
    await this.load();
    for (const plugin of this.#plugins.values()) {
      if (this.#started.has(plugin)) continue;
      await mkdir(`./data/plugins/${plugin.id}/`, { recursive: true });
      await plugin.start();
      this.#started.add(plugin);
    }
    console.other(`Successfully loaded ${this.#started.size} plugin(s).`);
  }

  async stop(): Promise<void> {
    const plugins = [...this.#started].reverse();
    this.#started.clear();
    const results = await Promise.allSettled(plugins.map((plugin) => plugin.stop()));
    for (const result of results) {
      if (result.status === "rejected") console.error(toError(result.reason));
    }
  }

  get plugins(): readonly BridgePlugin<any>[] {
    return this.#plugins.values();
  }
}

export default PluginManager;
