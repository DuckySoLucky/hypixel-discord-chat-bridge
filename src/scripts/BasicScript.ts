import Embed from "../discord/private/Embed.js";
import prettyMilliseconds from "pretty-ms";
import { ScriptLogState, type ScriptOptions } from "../types/scripts.js";
import { performance } from "node:perf_hooks";
import { runDetached, toError } from "../utils/asyncUtils.js";
import { schedule } from "node-cron";
import type ScriptManager from "./ScriptsManager.js";
import type { Lifecycle } from "../core/Lifecycle.js";
import type { ScheduledTask } from "node-cron";

abstract class BasicScript implements Lifecycle {
  readonly id: string;
  readonly enabled: boolean;
  private interval?: NodeJS.Timeout;
  private cronTask?: ScheduledTask;
  private running: boolean = false;
  private abortController?: AbortController;
  constructor(
    protected readonly scripts: ScriptManager,
    readonly options: ScriptOptions
  ) {
    this.id = options.id;
    this.enabled = options.enabled;
  }

  abstract execute(signal: AbortSignal): Promise<void>;

  async runNow(): Promise<void> {
    await this.runSafely();
  }

  start(): Promise<void> {
    if (!this.enabled) {
      console.scripts(`Script \`${this.id}\` is disabled.`);
      return Promise.resolve();
    }
    if (this.interval || this.cronTask) return Promise.resolve();

    if (this.options.schedule.type === "interval") {
      const { milliseconds } = this.options.schedule;
      console.scripts(`Loaded script \`${this.id}\` - executing every ${milliseconds}ms (${prettyMilliseconds(milliseconds)})`);
      this.interval = setInterval(() => runDetached(this.runSafely()), milliseconds);
    } else {
      const { expression } = this.options.schedule;
      console.scripts(`Loaded script \`${this.id}\` - executing with cron: ${expression}.`);
      this.cronTask = schedule(expression, () => runDetached(this.runSafely()));
    }
    return Promise.resolve();
  }

  stop(): Promise<void> {
    if (this.interval) clearInterval(this.interval);
    this.interval = undefined;
    this.cronTask?.stop();
    this.cronTask = undefined;
    this.abortController?.abort(new Error(`Script \`${this.id}\` stopped.`));
    this.abortController = undefined;
    return Promise.resolve();
  }

  private async runSafely(): Promise<void> {
    if (this.running && this.options.overlap !== "allow") {
      console.scripts(`Skipped script \`${this.id}\` because its previous execution is still running.`);
      return;
    }

    this.running = true;
    this.abortController = new AbortController();
    const start = performance.now();
    try {
      await this.log(`Executing the \`${this.id}\` script.`);
      await this.execute(this.abortController.signal);
      await this.log(`Finished executing the \`${this.id}\` script.`, ScriptLogState.Good);
    } catch (error: unknown) {
      console.error(toError(error));
    } finally {
      const durationMs = performance.now() - start;
      try {
        await this.log(`Duration of the \`${this.id}\` script: ${durationMs.toFixed(2)}ms (${prettyMilliseconds(durationMs)})`, ScriptLogState.Misc);
      } catch (error: unknown) {
        console.error(toError(error));
      }
      this.running = false;
      this.abortController = undefined;
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
