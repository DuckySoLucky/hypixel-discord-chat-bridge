import { delay, generateId } from "../../../utils/miscUtils.js";
import { splitMessage } from "../../../utils/stringUtils.js";
import { translate } from "../../../translations/TranslationsManager.js";
import type MinecraftCommandData from "./MinecraftCommandData.js";
import type { MinecraftManagerWithBot } from "../../../types/minecraft.js";

enum SendErrorType {
  RATE_LIMITED = "rate-limited",
  DUPLICATE_MESSAGE = "duplicate-message"
}

class SendError extends Error {
  constructor(public type: SendErrorType) {
    super(type);
  }
}

class MinecraftCommand<Manager extends MinecraftManagerWithBot = MinecraftManagerWithBot> {
  data!: MinecraftCommandData;
  officer: boolean = false;
  private readonly maxMessageLength: number;
  constructor(protected readonly minecraft: Manager) {
    this.maxMessageLength = this.minecraft.application.config.minecraft.commands.maxMessageLength;
  }

  getArgs(message: string): string[] {
    const args = message.split(" ");
    args.shift();
    return args;
  }

  private hasCommandTimedOut(startTime: number): boolean {
    return Date.now() - startTime > 10_000;
  }

  async send(message: string, maxRetries = 5, isErrorMessage = false) {
    const startTime = Date.now();

    if (message.length > this.maxMessageLength) {
      const msg = splitMessage(message, this.maxMessageLength);
      for (const part of msg) {
        if (this.hasCommandTimedOut(startTime)) return console.error(translate("minecraft.commands.execute.error.timeout"));
        await delay(1000);
        await this.send(part, maxRetries, isErrorMessage);
      }
      return;
    }

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await this.sendMessage(message);
      } catch (error) {
        if (this.hasCommandTimedOut(startTime)) return console.error(translate("minecraft.commands.execute.error.timeout"));
        if (!(error instanceof SendError)) return console.error(error);

        switch (error.type) {
          case SendErrorType.RATE_LIMITED: {
            if (attempt === maxRetries - 1) {
              // eslint-disable-next-line hypixelDiscordChatBridge/enforce-translate
              this.send(translate("minecraft.commands.execute.error.resend", { maxRetries }), 1);
              if (!isErrorMessage) console.error(translate("minecraft.commands.execute.error.resend", { maxRetries }));
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

  private sendMessage(message: string) {
    return new Promise<void>((resolve, reject) => {
      const listener = (data: { positionId: number; formattedMessage: string }) => {
        const rawMessage = this.minecraft.prismarineChat.fromNotch(data.formattedMessage);
        const message = rawMessage.toString();

        if (this.minecraft.messageHandler.isTooFast(message)) {
          this.minecraft.bot.removeListener("systemChat", listener);
          reject(new SendError(SendErrorType.RATE_LIMITED));
        }

        if (this.minecraft.messageHandler.isRepeatMessage(message)) {
          this.minecraft.bot.removeListener("systemChat", listener);
          reject(new SendError(SendErrorType.DUPLICATE_MESSAGE));
        }
      };

      this.minecraft.bot.once("systemChat", listener);
      console.log(message.length);
      this.minecraft.bot.chat(`/${this.officer ? "oc" : "gc"} ${message}`);

      setTimeout(() => {
        this.minecraft.bot.removeListener("systemChat", listener);
        resolve();
      }, 500);
    });
  }

  execute(player: string, message: string): unknown {
    throw new Error("Execute Method not implemented!");
  }
}

export default MinecraftCommand;
