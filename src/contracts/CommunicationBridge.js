class CommunicationBridge {
  constructor() {
    this.bridge = null;
    this.bridge_list = [];
  }

  getBridge() {
    return this.bridge;
  }

  setBridge(bridge) {
    if (this.bridge == null) {
      this.bridge = bridge;
    }
    this.bridge_list.push(bridge);
  }

  broadcastMessage(event) {
    this.bridge_list.forEach((bridge_el) => {
      bridge_el.onBroadcast(event);
    });
  }

  broadcastPlayerToggle(event) {
    this.bridge_list.forEach((bridge_el) => {
      bridge_el.onPlayerToggle(event);
    });
  }

  broadcastCleanEmbed(event) {
    this.bridge_list.forEach((bridge_el) => {
      bridge_el.onBroadcastCleanEmbed(event);
    });
  }

  broadcastHeadedEmbed(event) {
    this.bridge_list.forEach((bridge_el) => {
      bridge_el.onBroadcastHeadedEmbed(event);
    });
  }

  connect() {
    throw new Error("Communication bridge connection is not implemented yet!");
  }

  onBroadcast(event) {
    throw new Error("Communication bridge broadcast handling is not implemented yet!");
  }
}

module.exports = CommunicationBridge;
