const EventHandler = require("../../contracts/EventHandler");
const Logger = require("../.././Logger");

class StateHandler extends EventHandler {
  constructor(minecraft) {
    super();

    this.minecraft = minecraft;
  }

  registerEvents(bot) {
    this.bot = bot;

    this.bot.on("error", (...args) => this.onError(...args));
  }

  onError(error) {
    if (this.isConnectionResetError(error)) return;
  
    if (this.isConnectionRefusedError(error)) {
      return Logger.errorMessage("Connection refused while attempting to login via the Minecraft client");
    }

    Logger.warnMessage(error);
  }

  isConnectionResetError(error) {
    return error.code && error.code == "ECONNRESET";
  }

  isConnectionRefusedError(error) {
    return error.code && error.code == "ECONNREFUSED";
  }
}

module.exports = StateHandler;
