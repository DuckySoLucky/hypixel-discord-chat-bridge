import StateHandler from "../src/minecraft/handlers/StateHandler.js";
import assert from "node:assert/strict";
import test from "node:test";
import type MinecraftManager from "../src/minecraft/MinecraftManager.js";
import type { Client } from "minecraft-protocol";

const originalMinecraftLogger = console.minecraft;
const originalErrorLogger = console.error;

test.before(() => {
  console.minecraft = () => undefined;
  console.error = () => undefined;
});

test.after(() => {
  console.minecraft = originalMinecraftLogger;
  console.error = originalErrorLogger;
});

function createStateHandler(getBotGuild: () => Promise<unknown>): { readonly client: Client; readonly handler: StateHandler; isReady(): boolean } {
  const client = { username: "TestBot" } as Client;
  let ready = false;
  const minecraft = {
    application: { botGuild: undefined, getBotGuild, discord: { getChannel: () => Promise.resolve({ isSendable: () => true, send: () => Promise.resolve() }) } },
    isCurrentClient: (candidate: Client) => candidate === client,
    markReady: (candidate: Client) => {
      if (candidate === client) ready = true;
    }
  } as unknown as MinecraftManager;

  return { client, handler: new StateHandler(minecraft), isReady: () => ready };
}

test("Minecraft startup waits for delayed guild initialization before becoming ready", async () => {
  let resolveGuild: (guild: unknown) => void = () => undefined;
  const guild = new Promise<unknown>((resolve) => {
    resolveGuild = resolve;
  });
  const state = createStateHandler(() => guild);
  const login = state.handler.onLogin(state.client);

  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(state.isReady(), false);

  resolveGuild({});
  await login;
  assert.equal(state.isReady(), true);
});

test("optional guild initialization failure does not leave Minecraft startup pending", async () => {
  const state = createStateHandler(() => Promise.reject(new Error("Hypixel API unavailable")));

  await state.handler.onLogin(state.client);

  assert.equal(state.isReady(), true);
});
