import type BridgeEventBus from "../../../src/private/BridgeEventBus.js";
import type { BridgeEventMap, BridgePluginLogger } from "../../../src/plugin-api.js";

class ShowcaseEventLogger {
  readonly #disposers: Array<() => void> = [];

  constructor(
    private readonly events: BridgeEventBus,
    private readonly logger: BridgePluginLogger
  ) {}

  start(): void {
    if (this.#disposers.length > 0) return;
    this.#disposers.push(
      this.events.on("discord-message", (event) => this.onDiscordMessage(event)),
      this.events.on("minecraft-message", (event) => this.onMinecraftMessage(event)),
      this.events.on("player-toggle", (event) => this.onPlayerToggle(event)),
      this.events.on("clean-embed", (event) => this.onCleanEmbed(event)),
      this.events.on("headed-embed", (event) => this.onHeadedEmbed(event))
    );
  }

  stop(): void {
    for (const dispose of this.#disposers.splice(0)) dispose();
  }

  private onDiscordMessage(event: BridgeEventMap["discord-message"]): void {
    this.logger.info(`Discord message from ${event.username}: ${event.message}`);
  }

  private onMinecraftMessage(event: BridgeEventMap["minecraft-message"]): void {
    const author = event.chatType === "Debug" ? "debug" : event.username;
    this.logger.info(`Minecraft message from ${author}: ${event.message}`);
  }

  private onPlayerToggle(event: BridgeEventMap["player-toggle"]): void {
    this.logger.info(`Player toggle for ${event.username}: ${event.message}`);
  }

  private onCleanEmbed(event: BridgeEventMap["clean-embed"]): void {
    this.logger.info(`Clean embed for ${event.chatType}: ${event.message}`);
  }

  private onHeadedEmbed(event: BridgeEventMap["headed-embed"]): void {
    this.logger.info(`Headed embed ${event.title ?? "without title"}: ${event.message}`);
  }
}

export default ShowcaseEventLogger;
