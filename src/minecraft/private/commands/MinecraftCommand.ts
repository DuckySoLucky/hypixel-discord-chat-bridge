import ms, { type StringValue } from "ms";
import { AsyncLocalStorage } from "node:async_hooks";
import { MinecraftRequestTimeoutError } from "../../MinecraftRequestBroker.js";
import { delay, generateId } from "../../../utils/miscUtils.js";
import { splitMessage } from "../../../utils/stringUtils.js";
import { toError } from "../../../utils/asyncUtils.js";
import type MinecraftCommandData from "./MinecraftCommandData.js";
import type MinecraftManager from "../../MinecraftManager.js";
import type { MinecraftCommandContext, MinecraftManagerWithBot } from "../../../types/minecraft.js";

enum SendErrorType {
  RATE_LIMITED = "rate-limited",
  DUPLICATE_MESSAGE = "duplicate-message"
}

class SendError extends Error {
  constructor(public type: SendErrorType) {
    super(type);
  }
}

abstract class MinecraftCommand<Manager extends MinecraftManager = MinecraftManagerWithBot> {
  abstract readonly data: MinecraftCommandData;
  private readonly invocationStorage = new AsyncLocalStorage<MinecraftCommandContext>();
  private readonly maxMessageLength: number;
  constructor(protected readonly minecraft: Manager) {
    this.maxMessageLength = this.minecraft.application.config.minecraft.commands.maxMessageLength;
  }

  getArgs(message: string = this.context.rawMessage): string[] {
    const args = message.split(" ");
    args.shift();
    return args;
  }

  async run(context: Omit<MinecraftCommandContext, "reply">): Promise<void> {
    const invocationContext: MinecraftCommandContext = { ...context, reply: (message) => this.sendForContext(context, message) };
    await this.invocationStorage.run(invocationContext, async () => {
      await this.execute(invocationContext.player, invocationContext.rawMessage);
    });
  }

  private hasCommandTimedOut(startTime: number): boolean {
    return Date.now() - startTime > 10_000;
  }

  send(message: string, maxRetries = 5, isErrorMessage = false): Promise<void> {
    return this.sendForContext(this.context, message, maxRetries, isErrorMessage);
  }

  private async sendForContext(context: Pick<MinecraftCommandContext, "channel" | "signal">, message: string, maxRetries = 5, isErrorMessage = false): Promise<void> {
    const startTime = Date.now();

    if (message.length > this.maxMessageLength) {
      const msg = splitMessage(message, this.maxMessageLength);
      for (const part of msg) {
        if (this.hasCommandTimedOut(startTime)) return console.error("Message sending timed out after 10 seconds");
        await delay(1000);
        await this.send(part, maxRetries, isErrorMessage);
      }
      return;
    }

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await this.sendMessage(context, message);
      } catch (error) {
        if (this.hasCommandTimedOut(startTime)) return console.error("Message sending timed out after 10 seconds");
        if (!(error instanceof SendError)) return this.logError(error);

        switch (error.type) {
          case SendErrorType.RATE_LIMITED: {
            if (attempt === maxRetries - 1) {
              await this.sendForContext(context, `Command failed to send message after ${maxRetries} attempts. Please try again later.`, 1, true);
              if (!isErrorMessage) console.error(`Command failed to send message after ${maxRetries} attempts due to rate limiting.`);
              return;
            }
            await delay(2000);
            break;
          }
          case SendErrorType.DUPLICATE_MESSAGE: {
            await delay(100);
            const randomId = generateId(this.minecraft.application.config.minecraft.commands.messageRepeatBypassLength);
            // -3 for space
            const maxLength = this.maxMessageLength - randomId.length - 3;
            message = `${message.substring(0, maxLength)} - ${randomId}`;
            break;
          }
          default: {
            break;
          }
        }
      }
    }
  }

  private async sendMessage(context: Pick<MinecraftCommandContext, "channel" | "signal">, message: string): Promise<void> {
    if (!this.minecraft.isBotOnline()) throw new Error("Minecraft client is not ready.");
    const response = this.minecraft.requestBroker.request({
      description: `Minecraft command response for ${message}`,
      timeoutMs: ms(this.minecraft.application.config.minecraft.commands.timeout as StringValue),
      signal: context.signal,
      matches: (responseMessage) => this.minecraft.messageHandler.isTooFast(responseMessage) || this.minecraft.messageHandler.isRepeatMessage(responseMessage),
      map: (responseMessage) => {
        if (this.minecraft.messageHandler.isTooFast(responseMessage)) throw new SendError(SendErrorType.RATE_LIMITED);
        throw new SendError(SendErrorType.DUPLICATE_MESSAGE);
      }
    });
    this.minecraft.bot.chat(`/${context.channel === "officer" ? "oc" : "gc"} ${message}`);
    try {
      await response;
    } catch (error: unknown) {
      if (error instanceof MinecraftRequestTimeoutError) return;
      throw error;
    }
  }

  abstract execute(username: string, message: string): Promise<void> | void;

  protected get context(): MinecraftCommandContext {
    const context = this.invocationStorage.getStore();
    if (!context) throw new Error(`Minecraft command \`${this.data.name}\` is not running inside an invocation context.`);
    return context;
  }

  protected logError(error: unknown) {
    this.minecraft.application.logError(toError(error), [
      { name: "Source", value: "Minecraft Command" },
      { name: "Command", value: this.data.name, smallBlockValue: true },
      { name: "Channel", value: this.context.channel, smallBlockValue: true },
      { name: "Player", value: this.context.player, smallBlockValue: true },
      { name: "Raw Messaage", value: this.context.rawMessage, blockValue: true }
    ]);
  }
}

export default MinecraftCommand;
