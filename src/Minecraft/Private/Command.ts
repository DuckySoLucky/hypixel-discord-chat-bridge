import { Delay, GenerateId } from "../../Utils/MiscUtils.js";
import { SplitMessage } from "../../Utils/StringUtils.js";
import type CommandData from "./CommandData.js";
import type { ChatMessage } from "prismarine-chat";
import type { MinecraftManagerWithBot } from "../../Types/Minecraft.js";

class Command<T extends MinecraftManagerWithBot = MinecraftManagerWithBot> {
  protected readonly minecraft: T;
  data!: CommandData;
  officer: boolean = false;
  constructor(minecraft: T) {
    this.minecraft = minecraft;
  }

  getArgs(message: string): string[] {
    const args = message.split(" ");
    args.shift();
    return args;
  }

  async send(message: string, maxRetries: number = 5, isErrorMessage: boolean = false): Promise<void> {
    const startTime = Date.now();
    const maxExecutionTime = 10000;

    if (message.length > 256) {
      const messages = SplitMessage(message, 256);
      for (const msg of messages) {
        await Delay(1000);
        await this.send(msg, maxRetries, isErrorMessage);

        if (Date.now() - startTime > maxExecutionTime) {
          console.error("Message sending timed out after 10 seconds");
          return;
        }
      }
      return;
    }

    try {
      const sendMessage = () => {
        return new Promise<boolean>((resolve, reject) => {
          const listener = (rawMessage: ChatMessage) => {
            const message = rawMessage.toString();

            if (message.includes("You are sending commands too fast!") && !message.includes(":")) {
              this.minecraft.bot.removeListener("message", listener);
              reject(new Error("rate-limited"));
            }

            if (message.includes("You cannot say the same message twice!") && !message.includes(":")) {
              this.minecraft.bot.removeListener("message", listener);
              reject(new Error("duplicate-message"));
            }
          };

          this.minecraft.bot.once("message", listener);
          this.minecraft.bot.chat(`/${this.officer ? "oc" : "gc"} ${message}`);

          setTimeout(() => {
            this.minecraft.bot.removeListener("message", listener);
            resolve(true);
          }, 500);
        });
      };

      for (let i = 0; i < maxRetries; i++) {
        try {
          await sendMessage();
          return;
        } catch (error) {
          if (!(error instanceof Error)) return;
          if (Date.now() - startTime > maxExecutionTime) {
            console.error("Message sending timed out after 10 seconds");
            return;
          }

          if (error.message === "rate-limited") {
            if (i === maxRetries - 1) {
              this.send(`Command failed to send message after ${maxRetries} attempts. Please try again later.`, 1);
              if (!isErrorMessage) console.error(`Command failed to send message after ${maxRetries} attempts due to rate limiting.`);
              return;
            }
            await Delay(2000);
            continue;
          }

          if (error.message === "duplicate-message") {
            await Delay(100);
            const randomId = GenerateId(this.minecraft.app.config.minecraft.bot.messageRepeatBypassLength);
            // -3 for space
            const maxLength = 256 - randomId.length - 3;
            message = `${message.substring(0, maxLength)} - ${randomId}`;
            continue;
          }
          throw error;
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  execute(username: string, message: string): Promise<void> | void {
    throw new Error("Execute Method not implemented!");
  }
}

export default Command;
