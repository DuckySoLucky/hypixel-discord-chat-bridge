import type MinecraftManager from "../MinecraftManager.js";

class StateHandler {
  private readonly minecraft: MinecraftManager;
  private loginAttempts: number;
  constructor(minecraftManager: MinecraftManager) {
    this.minecraft = minecraftManager;
    this.loginAttempts = 0;
  }

  registerEvents() {
    if (!this.minecraft.isBotOnline()) return;
    this.minecraft.bot.on("login", (...args) => this.onLogin(...args));
    this.minecraft.bot.on("end", (...args) => this.onEnd(...args));
    this.minecraft.bot.on("kicked", (...args) => this.onKicked(...args));
    this.minecraft.bot.on("error", (...args) => this.onError(...args));
  }

  onLogin() {
    if (!this.minecraft.isBotOnline()) return;
    console.minecraft(`Client ready, logged in as ${this.minecraft.bot.username}`);
    this.loginAttempts = 0;
  }

  onEnd(reason: string) {
    if (reason && reason === "restart") return;
    const loginDelay = (this.loginAttempts + 1) * 5000;
    console.warn(`Minecraft bot has disconnected! Attempting reconnect in ${loginDelay / 1000} seconds`);
    setTimeout(() => this.minecraft.connect(), loginDelay);
  }

  onKicked(reason: string, loggedIn: boolean) {
    console.warn(`Minecraft bot has been kicked from the server for "${reason}"`);
    this.loginAttempts++;
  }

  onError(error: Error) {
    if (this.isConnectionResetError(error)) return;

    if (this.isConnectionRefusedError(error)) {
      return console.error("Connection refused while attempting to login via the Minecraft client");
    }

    console.warn(error);
  }

  isConnectionResetError(error: any) {
    return error.code && error.code === "ECONNRESET";
  }

  isConnectionRefusedError(error: any) {
    return error.code && error.code === "ECONNREFUSED";
  }
}

export default StateHandler;
