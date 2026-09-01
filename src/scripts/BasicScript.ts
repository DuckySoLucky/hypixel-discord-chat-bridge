import EmbedHelper from "../discord/private/EmbedHelper.js";
import HypixelDiscordChatBridgeError from "../private/error.js";
import prettyMilliseconds from "pretty-ms";
import { ScriptLogState, type ScriptOptions } from "../types/scripts.js";
import { performance } from "node:perf_hooks";
import { runDetached, toError } from "../utils/asyncUtils.js";
import { schedule } from "node-cron";
import type ScriptManager from "./ScriptsManager.js";
import type { Lifecycle } from "../core/Lifecycle.js";
import type { ScheduledTask } from "node-cron";
import type { User } from "discord.js";

abstract class BasicScript implements Lifecycle {
  #user?: User;
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

  async runNow(): Promise<number> {
    return await this.runSafely();
  }

  start(): Promise<void> {
    if (!this.enabled) {
      console.scripts(`Script \`${this.id}\` is disabled.`);
      return Promise.resolve();
    }
    if (this.interval || this.cronTask) return Promise.resolve();

    switch (this.options.schedule.type) {
      case "cron": {
        const { expression } = this.options.schedule;
        console.scripts(`Loaded script \`${this.id}\` - executing with cron: ${expression}.`);
        this.cronTask = schedule(expression, () => runDetached(this.runSafely()));
        break;
      }
      case "interval": {
        const { milliseconds } = this.options.schedule;
        console.scripts(`Loaded script \`${this.id}\` - executing every ${milliseconds}ms (${prettyMilliseconds(milliseconds)})`);
        this.interval = setInterval(() => runDetached(this.runSafely()), milliseconds);
        break;
      }
      case "empty":
      default: {
        console.scripts(`Loaded script \`${this.id}\` - No execute set`);
      }
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

  private async runSafely(): Promise<number> {
    if (this.running && this.options.overlap !== "allow") {
      console.scripts(`Skipped script \`${this.id}\` because its previous execution is still running.`);
      return -1;
    }

    this.running = true;
    this.abortController = new AbortController();
    const start = performance.now();
    try {
      await this.log(`Executing the \`${this.id}\` script.`);
      await this.execute(this.abortController.signal);
      await this.log(`Finished executing the \`${this.id}\` script.`, ScriptLogState.Good);
    } catch (error: unknown) {
      this.scripts.application.logError(toError(error));
    } finally {
      const durationMs = performance.now() - start;
      await this.log(`Duration of the \`${this.id}\` script: ${durationMs.toFixed(2)}ms (${prettyMilliseconds(durationMs)})`, ScriptLogState.Misc);
      this.running = false;
      this.abortController = undefined;
      return durationMs;
    }
  }

  protected async log(message: string, state: ScriptLogState = ScriptLogState.Misc): Promise<void> {
    console.scripts(message);
    const channel = await this.scripts.application.discord.getChannel("Logger-Scripts");
    const embed = new EmbedHelper().setDescription(message).setDevFooter("Kathund");
    if (state === ScriptLogState.Good) embed.setColor("Green");
    else if (state === ScriptLogState.Bad) embed.setColor("Red");
    else if (state === ScriptLogState.Misc) embed.setColor("Blue");
    await channel.send({ content: `Log from script: \`${this.id}\``, embeds: [embed] });
  }

  setUser(user: User): this {
    this.#user = user;
    setTimeout(() => runDetached(this.resetUser()), 15000);
    return this;
  }

  private async resetUser() {
    this.#user = undefined;
  }

  getUser(): User {
    if (this.#user) return this.#user;
    if (!this.scripts.application.discord.isClientOnline()) {
      throw new HypixelDiscordChatBridgeError("The discord bot doesn't seam to be online? Please restart the application");
    }
    return this.scripts.application.discord.client.user;
  }
}

export default BasicScript;
