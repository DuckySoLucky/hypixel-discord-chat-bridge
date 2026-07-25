import Embed from "../discord/private/Embed.js";
import HypixelDiscordChatBridgeError from "../private/error.js";
import ms, { type StringValue } from "ms";
import prettyMilliseconds from "pretty-ms";
import { ScriptLogState, type ScriptOptions } from "../types/scripts.js";
import { performance } from "node:perf_hooks";
import { schedule } from "node-cron";
import type ScriptManager from "./ScriptsManager.js";

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
    if (!cron && !interval) throw new HypixelDiscordChatBridgeError("You must specify a cron or an interval.");
    if (cron && interval) throw new HypixelDiscordChatBridgeError("You cannot specify both cron and an interval.");
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
      this.log(`Executing the \`${this.id}\` script.`);
      await this.execute();
      this.log(`Finished executing the \`${this.id}\` script.`);
    } catch (error) {
      console.error(error);
    } finally {
      const durationMs = performance.now() - start;
      this.log(`Duration: ${durationMs.toFixed(2)}ms (${prettyMilliseconds(durationMs)})`);
    }
  }

  private init() {
    if (!this.enabled) return console.scripts(`Script \`${this.id}\` is disabled.`);

    if (this.interval) {
      console.scripts(`Loaded script \`${this.id}\` - executing every ${this.interval}ms (${prettyMilliseconds(this.interval)})`);
      setInterval(() => this.run(), this.interval);
    }

    if (this.cron) {
      console.scripts(`Loaded script \`${this.id}\` - executing with cron: ${this.cron}.`);
      schedule(this.cron, () => this.run());
    }
  }

  protected async log(message: string, state: ScriptLogState = ScriptLogState.Misc): Promise<void> {
    console.scripts(message);
    const channel = await this.scripts.application.discord.getChannel("Logger-Scripts");
    if (!channel || !channel.isSendable()) return;
    const embed = new Embed().setDescription(message).setDevFooter("Kathund");
    if (state === ScriptLogState.Good) embed.setColor("Green");
    else if (state === ScriptLogState.Bad) embed.setColor("Red");
    else if (state === ScriptLogState.Misc) embed.setColor("Blue");
    await channel.send({ content: `Log from script: \`${this.id}\``, embeds: [embed] });
  }
}

export default BasicScript;
