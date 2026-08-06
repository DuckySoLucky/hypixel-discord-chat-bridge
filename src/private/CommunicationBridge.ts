import type BridgeEventBus from "./BridgeEventBus.js";
import type { BridgeEventMap, CleanEmbedEvent, DiscordToMinecraftMessage, HeadedEmbedEvent, MinecraftToDiscordMessage, PlayerToggleEvent } from "../types/bridge.js";

abstract class CommunicationBridge {
  readonly #bridgeDisposers: (() => void)[] = [];

  constructor(protected readonly events: BridgeEventBus) {}

  broadcastMessage(event: DiscordToMinecraftMessage | MinecraftToDiscordMessage): Promise<void> {
    return "channelId" in event ? this.events.publish("discord-message", event) : this.events.publish("minecraft-message", event);
  }

  broadcastPlayerToggle(event: PlayerToggleEvent): Promise<void> {
    return this.events.publish("player-toggle", event);
  }

  broadcastCleanEmbed(event: CleanEmbedEvent): Promise<void> {
    return this.events.publish("clean-embed", event);
  }

  broadcastHeadedEmbed(event: HeadedEmbedEvent): Promise<void> {
    return this.events.publish("headed-embed", event);
  }

  protected listen<Event extends keyof BridgeEventMap>(event: Event, listener: (payload: BridgeEventMap[Event]) => Promise<void> | void): void {
    this.#bridgeDisposers.push(this.events.on(event, listener));
  }

  protected stopBridgeListeners(): void {
    for (const dispose of this.#bridgeDisposers.splice(0)) dispose();
  }
}

export default CommunicationBridge;
