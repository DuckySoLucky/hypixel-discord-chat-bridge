import BasicScript from "../../BasicScript.js";
import Parser from "rss-parser";
import { delay } from "../../../utils/miscUtils.js";
import type ScriptManager from "../../ScriptsManager.js";

interface IncidentState {
  notified: boolean;
  updates: Set<string>;
}

class HypixelStatusUpdatesScript extends BasicScript {
  private readonly hypixelIncidents: Record<string, IncidentState> = {};
  private readonly parser = new Parser();
  constructor(scripts: ScriptManager) {
    super(scripts, {
      id: "hypixelStatusUpdates",
      enabled: scripts.application.config.minecraft.hypixelAlerts.statusUpdates.enabled,
      interval: scripts.application.config.minecraft.hypixelAlerts.statusUpdates.interval
    });
  }

  override async execute() {
    if (!this.scripts.application.minecraft.isBotOnline()) return;
    const { items: status } = await this.parser.parseURL("https://status.hypixel.net/history.rss");
    const latestIncidents = status.filter(({ pubDate }) => pubDate !== undefined && new Date(pubDate).getTime() + 43200000 > Date.now());

    for (const incident of latestIncidents) {
      const { title, link, contentSnippet } = incident;
      if (title === undefined || link === undefined || contentSnippet === undefined) continue;
      const state = (this.hypixelIncidents[title] ??= { notified: false, updates: new Set<string>() });

      if (!state.notified) {
        state.notified = true;
        this.scripts.application.minecraft.bot.chat(`/gc [HYPIXEL STATUS] ${title} | ${link}`);
        await delay(1500);
      }

      const updates = JSON.stringify(contentSnippet)
        .split("\\n")
        .filter((_, index) => index % 2 !== 0);

      for (const update of updates) {
        if (state.updates.has(update)) continue;
        state.updates.add(update);
        this.scripts.application.minecraft.bot.chat(`/gc [HYPIXEL STATUS] ${title} | ${update}`);
        await delay(1500);
      }
    }
  }
}

export default HypixelStatusUpdatesScript;
