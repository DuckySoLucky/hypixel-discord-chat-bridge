import ShowcaseButton from "./components/ShowcaseButton.js";
import ShowcaseDiscordCommand from "./commands/ShowcaseDiscordCommand.js";
import ShowcaseEventLogger from "./events/ShowcaseEventLogger.js";
import ShowcaseMinecraftCommand from "./commands/ShowcaseMinecraftCommand.js";
import ShowcaseModal from "./components/ShowcaseModal.js";
import ShowcaseScript from "./scripts/ShowcaseScript.js";
import showcasePluginConfig from "./config.js";
import { type Application, BridgePlugin, type BridgePluginContext } from "hypixel-discord-chat-bridge/plugin-api";
import type { ShowcasePluginConfig } from "./config.js";

class ShowcasePlugin extends BridgePlugin<ShowcasePlugin> {
  override readonly metadata = { name: "Plugin API Showcase", description: "Example plugin for the Plugin API", version: "1.0.0", author: "DuckySoLucky" } as const;
  readonly #eventLogger: ShowcaseEventLogger;
  #started: boolean = false;

  constructor(
    context: BridgePluginContext<ShowcasePlugin>,
    application: Application,
    private readonly config: ShowcasePluginConfig = showcasePluginConfig
  ) {
    super(context, application);
    this.#eventLogger = new ShowcaseEventLogger(context.events, context.logger);
  }

  override registerExtensions(): Promise<void> {
    if (!this.config.enabled) return Promise.resolve();
    this.context.registerDiscordCommand((discord) => new ShowcaseDiscordCommand(discord));
    this.context.registerMinecraftCommand((minecraft) => new ShowcaseMinecraftCommand(minecraft));
    this.context.registerButton((discord) => new ShowcaseButton(discord));
    this.context.registerModal((discord) => new ShowcaseModal(discord));
    this.context.registerScript((scripts) => new ShowcaseScript(scripts, this.context.logger, this.config.scripts.showcase));
    return Promise.resolve();
  }

  override start(): Promise<void> {
    if (!this.config.enabled) return Promise.resolve();
    if (this.#started) return Promise.resolve();
    this.#started = true;
    this.#eventLogger.start();
    this.context.logger.info("Showcase plugin started.");
    return Promise.resolve();
  }

  override stop(): Promise<void> {
    if (!this.config.enabled) return Promise.resolve();
    if (!this.#started) return Promise.resolve();
    this.#started = false;
    this.#eventLogger.stop();
    this.context.logger.info("Showcase plugin stopped.");
    return Promise.resolve();
  }
}

export default ShowcasePlugin;
