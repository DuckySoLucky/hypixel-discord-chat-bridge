import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import { MinecraftRequestTimeoutError } from "../MinecraftRequestBroker.js";
import type { MinecraftChatChannel } from "../../types/minecraft.js";

const OPERATORS = ["+", "-", "*"] as const;
const CHAT_LINE = /^(?<chatType>Guild|Officer) > (?:\[[^\]]+\] )?(?<username>\w+)(?: \[[^\]]+\])?: (?<message>.+)$/;
const RELAYED_MESSAGE = /^(?<username>(?!https?:\/\/)[^\s»:>]+)\s*[»:>]\s*(?<message>.*)$/;

class QuickMathsCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("quickmaths")
    .setDescription("Solve the equation in less than 10 seconds! Test your math skills!")
    .setAliases(["qm"])
    .setAuthors(["CraftedFury"]);
  protected readonly answerWindowMs: number = 10_000;

  static createEquation(random: () => number = Math.random): { equation: string; answer: number } {
    const operator = OPERATORS[Math.floor(random() * OPERATORS.length)] ?? "+";
    const left = Math.floor(random() * 10);
    const right = Math.floor(random() * 10);

    let answer = left * right;
    if (operator === "+") answer = left + right;
    if (operator === "-") answer = left - right;
    return { equation: `${left} ${operator} ${right}`, answer };
  }

  override async execute(player: string) {
    const { equation, answer } = QuickMathsCommand.createEquation();
    const channel = this.context.channel;

    // listen before asking: send() only resolves once its rate-limit check times out
    const winner = this.minecraft.requestBroker.request({
      description: `Quick maths answer for ${equation}`,
      timeoutMs: this.answerWindowMs,
      signal: this.context.signal,
      matches: (line) => this.parseAnswer(line, channel)?.answer === String(answer),
      map: (line) => this.parseAnswer(line, channel)?.username ?? player
    });
    const question = this.send(`${player} What is ${equation}?`);
    const startTime = Date.now();

    try {
      const username = await winner;
      await this.send(`${username} Correct! It took you ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
    } catch (error) {
      if (!(error instanceof MinecraftRequestTimeoutError)) throw error;
      await this.send(`${player} Time's up! The answer was ${answer}`);
    } finally {
      await question;
    }
  }

  private parseAnswer(line: string, channel: MinecraftChatChannel): { username: string; answer: string } | undefined {
    const groups = line.match(CHAT_LINE)?.groups;
    if (groups?.chatType === undefined || groups.username === undefined || groups.message === undefined) return undefined;
    if ((groups.chatType === "Officer") !== (channel === "officer")) return undefined;
    if (groups.username !== this.minecraft.bot.username) return { username: groups.username, answer: groups.message.trim() };

    // the bot's own lines only count when they relay a Discord message
    if (!this.minecraft.messageHandler.isDiscordMessage(groups.message, groups.username)) return undefined;
    const relayed = groups.message.match(RELAYED_MESSAGE)?.groups;
    if (relayed?.username === undefined || relayed.message === undefined) return undefined;
    return { username: relayed.username, answer: relayed.message.trim() };
  }
}

export default QuickMathsCommand;
