import MinecraftRequestBroker from "../src/minecraft/MinecraftRequestBroker.js";
import PrismarineChat from "prismarine-chat";
import PrismarineRegistry, { type RegistryPc } from "prismarine-registry";
import QuickMathsCommand from "../src/minecraft/commands/quickMathsCommand.js";
import assert from "node:assert/strict";
import loadExtensionModules from "../src/extensions/moduleLoader.js";
import test from "node:test";
import { EventEmitter } from "node:events";
import type MinecraftCommand from "../src/minecraft/private/commands/MinecraftCommand.js";
import type { Client } from "minecraft-protocol";
import type { MinecraftChatChannel, MinecraftManagerWithBot } from "../src/types/minecraft.js";

const BOT = "BridgeBot";
const VERSION = "26.1.2";

class FastQuickMathsCommand extends QuickMathsCommand {
  protected override readonly answerWindowMs = 300;
}

// mirrors MessageHandler: only the bot's own lines can be relayed Discord messages ("{username} » {message}")
const messageHandler = {
  isTooFast: () => false,
  isRepeatMessage: () => false,
  isDiscordMessage: (message: string, sender: string) => sender === BOT && /^[^\s»:>]+\s*[»:>]/.test(message)
};

// chat lines reach the command as systemChat packets through the real request broker and chat parser
function createBridge() {
  const emitter = new EventEmitter();
  const sent: string[] = [];
  const say = (line: string) => emitter.emit("systemChat", { formattedMessage: JSON.stringify({ text: line }) });
  const bot = {
    username: BOT,
    chat(message: string) {
      sent.push(message);
      // Hypixel echoes guild and officer chat back to the sender
      const echo = message.match(/^\/(?<channel>gc|oc) (?<text>.+)$/)?.groups;
      if (echo?.text !== undefined) setImmediate(() => say(`${echo.channel === "oc" ? "Officer" : "Guild"} > [VIP] ${BOT} [Bot]: ${echo.text}`));
    }
  };
  const manager = {
    application: {
      config: { minecraft: { bot: { version: VERSION }, commands: { maxMessageLength: 256, timeout: "100ms", messageRepeatBypassLength: 4 } } },
      logError: () => Promise.resolve()
    },
    bot,
    hasBot: () => true,
    isBotOnline: () => true
  } as unknown as MinecraftManagerWithBot;
  const requestBroker = new MinecraftRequestBroker(PrismarineChat(PrismarineRegistry(VERSION) as RegistryPc));
  requestBroker.start(emitter as unknown as Client);
  Object.assign(manager, { requestBroker, messageHandler });
  return { manager, sent, say, stop: () => requestBroker.stop() };
}

function startGame(command: QuickMathsCommand, player: string, channel: MinecraftChatChannel): Promise<void> {
  return command.run({ player, rawMessage: "!qm", args: [], channel, signal: new AbortController().signal });
}

function answerOf(sent: readonly string[]): number {
  const question = sent[0]?.match(/What is (?<left>\d) (?<operator>[-+*]) (?<right>\d)\?$/)?.groups;
  assert.ok(question?.left !== undefined && question.right !== undefined, `no question asked: ${JSON.stringify(sent)}`);
  const left = Number(question.left);
  const right = Number(question.right);
  if (question.operator === "+") return left + right;
  if (question.operator === "-") return left - right;
  return left * right;
}

test("asks in guild chat and names the first player to answer correctly", async () => {
  const { manager, sent, say, stop } = createBridge();
  const game = startGame(new FastQuickMathsCommand(manager), "Asker", "guild");
  assert.match(sent[0] ?? "", /^\/gc Asker What is \d [-+*] \d\?$/);
  const answer = answerOf(sent);

  say(`Guild > [MVP+] Guesser [Member]: ${answer + 1}`);
  say(`Officer > [MVP+] Officer [Officer]: ${answer}`);
  say(`Guild > Winner [Member]: ${answer}`);
  say(`Guild > [MVP++] Late [Member]: ${answer}`);
  await game;
  stop();

  assert.match(sent.at(-1) ?? "", /^\/gc Winner Correct! It took you \d+\.\ds$/);
});

test("accepts an answer relayed from Discord by the bot", async () => {
  const { manager, sent, say, stop } = createBridge();
  const game = startGame(new FastQuickMathsCommand(manager), "Asker", "guild");
  const answer = answerOf(sent);

  say(`Guild > [VIP] ${BOT} [Bot]: DiscordUser » ${answer}`);
  await game;
  stop();

  assert.match(sent.at(-1) ?? "", /^\/gc DiscordUser Correct! It took you \d+\.\ds$/);
});

test("plays in officer chat when started there", async () => {
  const { manager, sent, say, stop } = createBridge();
  const game = startGame(new FastQuickMathsCommand(manager), "Asker", "officer");
  assert.match(sent[0] ?? "", /^\/oc Asker What is /);
  const answer = answerOf(sent);

  say(`Guild > [MVP+] GuildMember [Member]: ${answer}`);
  say(`Officer > [MVP+] OfficerMember [Officer]: ${answer}`);
  await game;
  stop();

  assert.match(sent.at(-1) ?? "", /^\/oc OfficerMember Correct! /);
});

test("reveals the answer when nobody gets it in time", async () => {
  const { manager, sent, say, stop } = createBridge();
  const game = startGame(new FastQuickMathsCommand(manager), "Asker", "guild");
  const answer = answerOf(sent);

  say(`Guild > [MVP+] Guesser [Member]: ${answer + 1}`);
  await game;
  stop();

  assert.equal(sent.at(-1), `/gc Asker Time's up! The answer was ${answer}`);
});

test("accepts a negative answer typed in chat", async (t) => {
  // operator "-", then 1 and 4: "1 - 4" = -3
  const rolls = [0.5, 0.15, 0.45];
  t.mock.method(Math, "random", () => rolls.shift() ?? 0);
  const { manager, sent, say, stop } = createBridge();
  const game = startGame(new FastQuickMathsCommand(manager), "Asker", "guild");
  assert.equal(sent[0], "/gc Asker What is 1 - 4?");

  say("Guild > [MVP+] Winner [Member]: -3");
  await game;
  stop();

  assert.match(sent.at(-1) ?? "", /^\/gc Winner Correct! /);
});

test("only asks single-digit +, - and * equations with whole answers", () => {
  const seen = new Set<string>();
  for (let operator = 0; operator < 3; operator++) {
    for (let left = 0; left < 10; left++) {
      for (let right = 0; right < 10; right++) {
        const rolls = [(operator + 0.5) / 3, (left + 0.5) / 10, (right + 0.5) / 10];
        const { equation, answer } = QuickMathsCommand.createEquation(() => rolls.shift() ?? 0);
        assert.match(equation, /^\d [-+*] \d$/);
        assert.equal(answerOf([`/gc Asker What is ${equation}?`]), answer, equation);
        assert.ok(Number.isInteger(answer), `${equation} = ${answer}`);
        seen.add(equation);
      }
    }
  }
  assert.equal(seen.size, 300);
});

test("is registered from the commands folder under its name and alias", async () => {
  const { manager, stop } = createBridge();
  stop();
  const modules = await loadExtensionModules<MinecraftCommand, MinecraftManagerWithBot>(
    new URL("../src/minecraft/commands/", import.meta.url),
    manager,
    (file) => file === "quickMathsCommand.ts"
  );

  assert.equal(modules.length, 1);
  const command = modules[0]?.extension;
  assert.ok(command instanceof QuickMathsCommand);
  assert.equal(command.data.name, "quickmaths");
  assert.deepEqual(command.data.aliases, ["qm"]);
});
