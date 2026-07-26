import MinecraftRequestBroker, { MinecraftRequestTimeoutError } from "../src/minecraft/MinecraftRequestBroker.js";
import assert from "node:assert/strict";
import test from "node:test";
import { EventEmitter } from "node:events";
import type { Client } from "minecraft-protocol";
import type { PrismarineChatFormatter } from "prismarine-chat";

const formatter = { fromNotch: (message: unknown) => ({ toString: () => String(message) }) } as unknown as PrismarineChatFormatter;

function createClient(): { readonly client: Client; readonly emitter: EventEmitter } {
  const emitter = new EventEmitter();
  return { client: emitter as unknown as Client, emitter };
}

test("ignores unrelated messages and cleans matched requests", async () => {
  const broker = new MinecraftRequestBroker(formatter);
  const { client, emitter } = createClient();
  broker.start(client);
  const result = broker.request({
    description: "guild response",
    timeoutMs: 1_000,
    matches: (message) => message.includes("matched"),
    map: (message) => message.toUpperCase()
  });

  emitter.emit("systemChat", { formattedMessage: "unrelated" });
  assert.equal(broker.pendingCount, 1);
  emitter.emit("systemChat", { formattedMessage: "matched response" });

  assert.equal(await result, "MATCHED RESPONSE");
  assert.equal(broker.pendingCount, 0);
  broker.stop();
});

test("times out once and removes the pending request", async () => {
  const broker = new MinecraftRequestBroker(formatter);
  const { client } = createClient();
  broker.start(client);
  const result = broker.request({ description: "timeout", timeoutMs: 5, matches: () => false, map: String });

  await assert.rejects(result, MinecraftRequestTimeoutError);
  assert.equal(broker.pendingCount, 0);
  broker.stop();
});

test("stopping rejects all pending requests", async () => {
  const broker = new MinecraftRequestBroker(formatter);
  const { client } = createClient();
  broker.start(client);
  const first = broker.request({ description: "first", timeoutMs: 1_000, matches: () => false, map: String });
  const second = broker.request({ description: "second", timeoutMs: 1_000, matches: () => false, map: String });

  broker.stop(new Error("disconnected"));

  await assert.rejects(first, /disconnected/u);
  await assert.rejects(second, /disconnected/u);
  assert.equal(broker.pendingCount, 0);
});
