class EventHandler {
  registerEvents(bot) {
    throw new Error("Event Handler registerEvents is not implemented yet!");
  }
  send(message) {
    if (this.minecraft.bot.player !== undefined) {
      this.minecraft.bot.chat(message);
    }
  }
}

module.exports = EventHandler;
