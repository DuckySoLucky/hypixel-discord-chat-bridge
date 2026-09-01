import EmbedHelper, { WarningEmbed } from "../../discord/private/EmbedHelper.js";
import { hasErrorCode, safeListener, toError } from "../../utils/asyncUtils.js";
import type MinecraftManager from "../MinecraftManager.js";
import type { Client } from "minecraft-protocol";

class StateHandler {
  private loginAttempts: number = 0;
  constructor(private readonly minecraft: MinecraftManager) {}

  registerEvents(client: Client): void {
    client.on(
      "login",
      safeListener(() => this.onLogin(client), this.reportError)
    );
    client.on(
      "end",
      safeListener((reason: string) => this.onEnd(client, reason), this.reportError)
    );
    client.on(
      "kicked",
      safeListener((reason: string) => this.onKicked(reason), this.reportError)
    );
    client.on("error", this.onError);
  }

  async onLogin(client: Client): Promise<void> {
    if (!this.minecraft.isCurrentClient(client)) return;
    console.minecraft(`Minecraft client ready, logged in as ${client.username}`);
    this.loginAttempts = 0;
    try {
      if (this.minecraft.application.botGuild === undefined) await this.minecraft.application.getBotGuild();

      const loggerChannel = await this.minecraft.application.discord.getChannel("Logger-Event");
      await loggerChannel.send({ embeds: [new EmbedHelper().setDescription(`Minecraft client ready, logged in as ${client.username}`).setColor("Green")] });
    } catch (error: unknown) {
      this.reportError(error);
    } finally {
      this.minecraft.markReady(client);
    }
  }

  async onEnd(client: Client, reason: string): Promise<void> {
    if (!this.minecraft.handleDisconnect(client, reason)) return;
    const loginDelay = (this.loginAttempts + 1) * 5000;
    console.warn(`Minecraft bot has disconnected! Attempting reconnect in ${loginDelay / 1000} seconds`);
    this.minecraft.scheduleReconnect(loginDelay);

    const loggerChannel = await this.minecraft.application.discord.getChannel("Logger-Event");
    await loggerChannel.send({ embeds: [new WarningEmbed().setDescription(`Minecraft bot has disconnected! Attempting reconnect in ${loginDelay / 1000} seconds`)] });
  }

  async onKicked(reason: string): Promise<void> {
    console.warn(`Minecraft bot has been kicked from the server for "${reason}"`);
    this.loginAttempts++;

    const loggerChannel = await this.minecraft.application.discord.getChannel("Logger-Event");
    await loggerChannel.send({ embeds: [new WarningEmbed().setDescription(`Minecraft bot has been kicked from the server for "${reason}"`)] });
  }

  readonly onError = (error: Error): void => {
    if (hasErrorCode(error, "ECONNRESET")) return;
    if (hasErrorCode(error, "ECONNREFUSED")) return console.error("Connection refused while attempting to login via the Minecraft client");

    this.reportError(error);
  };

  private readonly reportError = (error: unknown): Promise<void> => this.minecraft.application.logError(toError(error));
}

export default StateHandler;
