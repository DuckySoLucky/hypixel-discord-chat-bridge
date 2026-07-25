import BasicScript from "../../BasicScript.js";
import minecraftProtocol from "minecraft-protocol";
import ms, { type StringValue } from "ms";
import type ScriptManager from "../../ScriptsManager.js";

class AlphaPlayerCountTrackerScript extends BasicScript {
  private lastPlayerCount = 0;
  private lastMessageTime = 0;
  private readonly messageCooldown: number;
  private readonly playerThreshold: number;
  constructor(scripts: ScriptManager) {
    super(scripts, {
      id: "alphaPlayerCountTracker",
      enabled: scripts.application.config.minecraft.hypixelAlerts.alphaPlayerCountTracker.enabled,
      interval: scripts.application.config.minecraft.hypixelAlerts.alphaPlayerCountTracker.interval
    });
    this.messageCooldown = ms(scripts.application.config.minecraft.hypixelAlerts.alphaPlayerCountTracker.messageCooldown as StringValue);
    this.playerThreshold = scripts.application.config.minecraft.hypixelAlerts.alphaPlayerCountTracker.playerThreshold;
  }

  override async execute() {
    if (!this.scripts.application.minecraft.isBotOnline()) return;
    const response = await minecraftProtocol.ping({ host: "alpha.hypixel.net", port: 25565, version: "1.8.9" });
    const currentPlayerCount = ("playerCount" in response ? response.playerCount : response.players?.online) ?? 0;
    const currentTime = Date.now();

    if (currentPlayerCount > this.playerThreshold && this.lastPlayerCount <= this.playerThreshold && currentTime - this.lastMessageTime >= this.messageCooldown) {
      this.scripts.application.minecraft.bot.chat(`/gc [ALPHA] Alpha Hypixel is open, current player count: ${currentPlayerCount}`);
      this.lastMessageTime = currentTime;
    }
    this.lastPlayerCount = currentPlayerCount;
  }
}

export default AlphaPlayerCountTrackerScript;
