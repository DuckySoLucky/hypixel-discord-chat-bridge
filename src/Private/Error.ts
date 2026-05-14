class HypixelDiscordChatBridgeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HypixelDiscordChatBridgeError";
  }

  override toString() {
    return this.message;
  }
}

export default HypixelDiscordChatBridgeError;
