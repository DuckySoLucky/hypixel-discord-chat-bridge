import type { BroadcastEvent } from "../types/bridge.js";

class CommunicationBridge {
  declare bridge: CommunicationBridge;

  getBridge(): CommunicationBridge {
    return this.bridge;
  }

  setBridge(bridge: CommunicationBridge) {
    this.bridge = bridge;
  }

  broadcastMessage(event: BroadcastEvent) {
    return this.bridge.onBroadcast(event);
  }

  onBroadcast(event: BroadcastEvent) {
    throw new Error("Communication bridge broadcast handling is not implemented yet!");
  }

  broadcastPlayerToggle(event: BroadcastEvent) {
    return this.bridge.onPlayerToggle(event);
  }

  onPlayerToggle(event: BroadcastEvent) {
    throw new Error("Communication bridge broadcast handling is not implemented yet!");
  }

  broadcastCleanEmbed(event: BroadcastEvent) {
    return this.bridge.onBroadcastCleanEmbed(event);
  }

  onBroadcastCleanEmbed(event: BroadcastEvent) {
    throw new Error("Communication bridge broadcast handling is not implemented yet!");
  }

  broadcastHeadedEmbed(event: BroadcastEvent) {
    return this.bridge.onBroadcastHeadedEmbed(event);
  }

  onBroadcastHeadedEmbed(event: BroadcastEvent) {
    throw new Error("Communication bridge broadcast handling is not implemented yet!");
  }
}

export default CommunicationBridge;
