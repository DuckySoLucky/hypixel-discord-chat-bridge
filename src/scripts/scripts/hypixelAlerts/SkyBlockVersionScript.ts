import BasicScript from "../../BasicScript.js";
import type ScriptManager from "../../ScriptsManager.js";

class SkyBlockVersionScript extends BasicScript {
  private skyblockVersion?: number;
  constructor(scripts: ScriptManager) {
    super(scripts, {
      id: "skyBlockVersion",
      enabled: scripts.application.config.minecraft.hypixelAlerts.skyblockVersion.enabled,
      interval: scripts.application.config.minecraft.hypixelAlerts.skyblockVersion.interval
    });
  }

  override async execute() {
    if (!this.scripts.application.minecraft.isBotOnline()) return;
    const response = await fetch("https://api.hypixel.net/v2/resources/skyblock/skills");
    if (!response.ok) throw new Error(`Hypixel API returned ${response.status} ${response.statusText}`);
    const data = await response.json();
    const currentVersion = data.version;

    if (this.skyblockVersion === undefined) {
      this.skyblockVersion = currentVersion;
      return;
    }

    if (this.skyblockVersion !== currentVersion) {
      this.scripts.application.minecraft.bot.chat(`/gc [HYPIXEL SKYBLOCK] Skyblock version has been updated to ${currentVersion}! Server restarts might occur!`);
    }
    this.skyblockVersion = currentVersion;
  }
}

export default SkyBlockVersionScript;
