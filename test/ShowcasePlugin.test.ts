import BridgeEventBus from "../src/private/BridgeEventBus.js";
import ShowcasePlugin from "../examples/showcase-plugin/index.js";
import assert from "node:assert/strict";
import showcasePluginConfig from "../examples/showcase-plugin/config.js";
import test from "node:test";
import type DiscordManager from "../src/discord/DiscordManager.js";
import type MinecraftManager from "../src/minecraft/MinecraftManager.js";
import type ScriptManager from "../src/scripts/ScriptsManager.js";
import type {
  BridgePluginContext,
  DiscordButtonFactory,
  DiscordCommandFactory,
  DiscordModalFactory,
  MinecraftCommandFactory,
  ScriptFactory
} from "../src/plugins/BridgePlugin.js";

function createPluginContext(): {
  readonly context: BridgePluginContext;
  readonly events: BridgeEventBus;
  readonly logs: string[];
  readonly discordCommands: DiscordCommandFactory[];
  readonly minecraftCommands: MinecraftCommandFactory[];
  readonly buttons: DiscordButtonFactory[];
  readonly modals: DiscordModalFactory[];
  readonly scripts: ScriptFactory[];
} {
  const events = new BridgeEventBus();
  const logs: string[] = [];
  const discordCommands: DiscordCommandFactory[] = [];
  const minecraftCommands: MinecraftCommandFactory[] = [];
  const buttons: DiscordButtonFactory[] = [];
  const modals: DiscordModalFactory[] = [];
  const scripts: ScriptFactory[] = [];
  return {
    events,
    logs,
    discordCommands,
    minecraftCommands,
    buttons,
    modals,
    scripts,
    context: {
      events,
      logger: { info: (message) => logs.push(message), warn: (message) => logs.push(message), error: (error) => logs.push(String(error)) },
      registerDiscordCommand: (factory) => discordCommands.push(factory),
      registerMinecraftCommand: (factory) => minecraftCommands.push(factory),
      registerButton: (factory) => buttons.push(factory),
      registerModal: (factory) => modals.push(factory),
      registerScript: (factory) => scripts.push(factory)
    }
  };
}

test("showcase plugin demonstrates every extension registration family", async () => {
  const registration = createPluginContext();
  const plugin = new ShowcasePlugin(registration.context, { ...showcasePluginConfig, enabled: true });
  await plugin.registerExtensions();

  assert.equal(registration.discordCommands.length, 1);
  assert.equal(registration.minecraftCommands.length, 1);
  assert.equal(registration.buttons.length, 1);
  assert.equal(registration.modals.length, 1);
  assert.equal(registration.scripts.length, 1);

  const discord = {} as DiscordManager;
  const minecraft = { application: { config: { minecraft: { commands: { maxMessageLength: 256 } } } } } as unknown as MinecraftManager;
  const scripts = {} as ScriptManager;

  assert.equal(registration.discordCommands[0]?.(discord).data.name, "showcase");
  assert.equal(registration.minecraftCommands[0]?.(minecraft).data.name, "pluginshowcase");
  assert.deepEqual(registration.buttons[0]?.(discord).data.ids, ["showcase:open-modal"]);
  assert.equal(registration.modals[0]?.(discord).data.id, "showcase:modal");
  const showcaseScript = registration.scripts[0]?.(scripts);
  assert.equal(showcaseScript?.id, "showcase-script");
  assert.equal(showcaseScript?.enabled, false);
});

test("showcase plugin subscribes once and disposes every event listener", async () => {
  const registration = createPluginContext();
  const plugin = new ShowcasePlugin(registration.context, { ...showcasePluginConfig, enabled: true });

  await plugin.start();
  await plugin.start();
  await registration.events.publish("minecraft-message", { chatType: "Debug", fullMessage: "debug", message: "first" });
  await registration.events.publish("clean-embed", { chatType: "Guild", message: "second", color: "Blue" });

  assert.equal(registration.logs.filter((message) => message === "Showcase plugin started.").length, 1);
  assert.equal(registration.logs.filter((message) => message.includes("Minecraft message from debug")).length, 1);
  assert.equal(registration.logs.filter((message) => message.includes("Clean embed for Guild")).length, 1);

  await plugin.stop();
  const logsAfterStop = registration.logs.length;
  await registration.events.publish("clean-embed", { chatType: "Guild", message: "ignored", color: "Blue" });
  assert.equal(registration.logs.length, logsAfterStop);
});

test("showcase plugin and all example extensions are disabled by default", async () => {
  const registration = createPluginContext();
  const plugin = new ShowcasePlugin(registration.context);

  await plugin.registerExtensions();
  await plugin.start();

  assert.equal(registration.discordCommands.length, 0);
  assert.equal(registration.minecraftCommands.length, 0);
  assert.equal(registration.buttons.length, 0);
  assert.equal(registration.modals.length, 0);
  assert.equal(registration.scripts.length, 0);
  assert.deepEqual(registration.logs, []);
});
