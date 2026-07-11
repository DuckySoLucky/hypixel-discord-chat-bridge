import Embed from "../discord/private/Embed.js";
import HypixelDiscordChatBridgeError from "../private/error.js";
import ms, { type StringValue } from "ms";
import prettyMilliseconds from "pretty-ms";
import { ScriptLogState, type ScriptOptions } from "../types/scripts.js";
import { performance } from "node:perf_hooks";
import { schedule } from "node-cron";
import { translate } from "../translations/TranslationsManager.js";
import type ScriptManager from "./ScriptsManager.js";
import type { ParseKeys } from "i18next";

class BasicScript {
  id: string;
  enabled: boolean;
  cron?: string;
  interval?: number;
  constructor(
    protected readonly scripts: ScriptManager,
    options: ScriptOptions
  ) {
    const { id, enabled, cron, interval } = options;
    this.id = id;
    this.enabled = enabled;
    const args = { argumentOne: "cron", argumentTwo: "an interval" };
    if (!cron && !interval) throw new HypixelDiscordChatBridgeError(translate("generic.errors.arguments.two.missing", args));
    if (cron && interval) throw new HypixelDiscordChatBridgeError(translate("generic.errors.arguments.two.supply", args));
    this.cron = cron;
    this.interval = interval ? ms(interval as StringValue) : undefined;
    this.init();
  }

  execute(): unknown {
    throw new Error("Execute Method not implemented!");
  }

  private async run() {
    const start = performance.now();
    try {
      this.log("scripts.status.execute.start", { id: this.id });
      await this.execute();
      this.log("scripts.status.execute.finish", { id: this.id });
    } catch (error) {
      console.error(error);
    } finally {
      const durationMs = performance.now() - start;
      this.log("scripts.status.execute.duration", { durationMs: durationMs.toFixed(2), cleanDurationMs: prettyMilliseconds(durationMs) });
    }
  }

  private init() {
    if (!this.enabled) return console.scripts(translate("scripts.status.load.disabled", { id: this.id }));

    if (this.interval) {
      console.scripts(translate("scripts.status.load.interval", { id: this.id, interval: this.interval, cleanInterval: prettyMilliseconds(this.interval) }));
      setInterval(() => this.run(), this.interval);
    }

    if (this.cron) {
      console.scripts(translate("scripts.status.load.cron", { id: this.id, cron: this.cron }));
      schedule(this.cron, () => this.run());
    }
  }

  protected async log(key: ParseKeys, replaces: Record<string, any> = {}, state: ScriptLogState = ScriptLogState.Misc): Promise<void> {
    console.scripts(translate(key, replaces));
    const channel = await this.scripts.application.discord.getChannel("Logger-Scripts");
    if (!channel || !channel.isSendable()) return;
    const embed = new Embed().setDescription(translate(key, replaces)).setDevFooter("Kathund");
    if (state === ScriptLogState.Good) embed.setColor("Green");
    else if (state === ScriptLogState.Bad) embed.setColor("Red");
    else if (state === ScriptLogState.Misc) embed.setColor("Blue");
    await channel.send({ content: translate("scripts.log.event.title", { id: this.id }), embeds: [embed] });
  }
}

export default BasicScript;
