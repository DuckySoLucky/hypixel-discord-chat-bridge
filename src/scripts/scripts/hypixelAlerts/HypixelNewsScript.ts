import BasicScript from "../../BasicScript.js";
import Parser from "rss-parser";
import axios from "axios";
import { delay } from "../../../utils/miscUtils.js";
import { load } from "cheerio";
import type ScriptManager from "../../ScriptsManager.js";

class HypixelNewsScript extends BasicScript {
  private firstTime = true;
  private readonly hypixelUpdates = new Set<string>();
  private readonly parser = new Parser();
  constructor(scripts: ScriptManager) {
    super(scripts, {
      id: "hypixelNews",
      enabled: scripts.application.config.minecraft.hypixelAlerts.hypixelNews.enabled,
      interval: scripts.application.config.minecraft.hypixelAlerts.hypixelNews.interval
    });
    if (this.enabled) this.execute();
  }

  override async execute() {
    if (!this.scripts.application.minecraft.isBotOnline()) return;
    const [{ items: news }, { items: skyblockNews }] = await Promise.all([
      this.parser.parseURL("https://hypixel.net/forums/news-and-announcements.4/index.rss"),
      this.parser.parseURL("https://hypixel.net/forums/skyblock-patch-notes.158/index.rss")
    ]);

    const latestFeed = news.concat(skyblockNews);
    for (const news of latestFeed) {
      const { title, link } = news;
      if (title === undefined || link === undefined) continue;
      if (this.hypixelUpdates.has(title)) continue;
      if (!this.scripts.application.minecraft.isBotOnline()) continue;
      if (this.firstTime) {
        this.hypixelUpdates.add(title);
        continue;
      }

      const isRecent = await this.isRecentPost(link);
      if (!isRecent) continue;
      this.scripts.application.minecraft.bot.chat(`/gc [HYPIXEL UPDATE] ${title} | ${link}`);
      this.hypixelUpdates.add(title);
      await delay(150);
    }

    this.firstTime = false;
  }

  private async isRecentPost(url: string): Promise<boolean> {
    try {
      const response = await axios.get<string>(url, { headers: { "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0" } });
      const $ = load(response.data);
      const timestamp = Number($("time.u-dt").first().attr("data-time"));
      if (!Number.isFinite(timestamp)) return false;
      const now = Math.floor(Date.now() / 1000);
      return timestamp + 12 * 60 * 60 >= now;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

export default HypixelNewsScript;
