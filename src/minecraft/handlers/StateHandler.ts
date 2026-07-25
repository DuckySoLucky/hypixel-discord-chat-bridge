import Embed, { WarningEmbed } from "../../discord/private/Embed.js";
import type MinecraftManager from "../MinecraftManager.js";
import type { PacketMeta } from "minecraft-protocol";

class StateHandler {
  private loginAttempts: number = 0;
  constructor(private readonly minecraft: MinecraftManager) {}

  registerEvents() {
    if (!this.minecraft.isBotOnline()) return;
    this.minecraft.bot.on("login", (...args) => this.onLogin(...args));
    this.minecraft.bot.on("end", (...args) => this.onEnd(...args));
    this.minecraft.bot.on("kicked", (...args) => this.onKicked(...args));
    this.minecraft.bot.on("error", (...args) => this.onError(...args));
  }

  async onLogin(data: any, packetMeta: PacketMeta) {
    if (!this.minecraft.isBotOnline()) return;
    console.minecraft(`Minecraft client ready, logged in as ${this.minecraft.bot.username}`);
    this.loginAttempts = 0;
    if (this.minecraft.application.botGuild === undefined) await this.minecraft.application.getBotGuild();

    const loggerChannel = await this.minecraft.application.discord.getChannel("Logger-Event");
    if (loggerChannel === null || !loggerChannel.isSendable()) return console.error('Channel "Logger-Event" not found!');
    await loggerChannel.send({ embeds: [new Embed().setDescription(`Minecraft client ready, logged in as ${this.minecraft.bot.username}`).setColor("Green")] });
  }

  async onEnd(reason: string) {
    if (reason && reason === "restart") return;
    const loginDelay = (this.loginAttempts + 1) * 5000;
    console.warn(`Minecraft bot has disconnected! Attempting reconnect in ${loginDelay / 1000} seconds`);
    setTimeout(() => this.minecraft.connect(), loginDelay);

    const loggerChannel = await this.minecraft.application.discord.getChannel("Logger-Event");
    if (loggerChannel === null || !loggerChannel.isSendable()) return console.error('Channel "Logger-Event" not found!');
    await loggerChannel.send({ embeds: [new WarningEmbed().setDescription(`Minecraft bot has disconnected! Attempting reconnect in ${loginDelay / 1000} seconds`)] });
  }

  async onKicked(reason: string, packetMeta: PacketMeta) {
    console.warn(`Minecraft bot has been kicked from the server for "${reason}"`);
    this.loginAttempts++;

    const loggerChannel = await this.minecraft.application.discord.getChannel("Logger-Event");
    if (loggerChannel === null || !loggerChannel.isSendable()) return console.error('Channel "Logger-Event" not found!');
    await loggerChannel.send({ embeds: [new WarningEmbed().setDescription(`Minecraft bot has been kicked from the server for "${reason}"`)] });
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
