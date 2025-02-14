const eventHandler = require("../../contracts/EventHandler.js");

class StateHandler extends eventHandler {
  constructor(minecraft) {
    super();

    this.minecraft = minecraft;
    this.loginAttempts = 0;
    this.exactDelay = 0;
  }

  registerEvents(bot) {
    this.bot = bot;

    this.bot.on("login", (...args) => this.onLogin(...args));
    this.bot.on("end", (...args) => this.onEnd(...args));
    this.bot.on("kicked", (...args) => this.onKicked(...args));
  }

  onLogin() {
    console.minecraft("Client ready, logged in as " + this.bot.username);

    this.loginAttempts = 0;
    this.exactDelay = 0;
  }

  onEnd(reason) {
    if (reason && reason === "restart") {
      return;
    }

    const loginDelay = this.exactDelay > 60000 ? 60000 : (this.loginAttempts + 1) * 50000;
    console.warn(`Minecraft bot has disconnected! Attempting reconnect in ${loginDelay / 1000} seconds`);

    setTimeout(() => this.minecraft.connect(), 2500);
  }

  onKicked(reason) {
    console.warn(`Minecraft bot has been kicked from the server for "${reason}"`);

    this.loginAttempts++;
  }
}

module.exports = StateHandler;
