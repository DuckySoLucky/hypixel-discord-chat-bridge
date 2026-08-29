import MinecraftCommand from "../src/minecraft/private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../src/minecraft/private/commands/MinecraftCommandData.js";
import assert from "node:assert/strict";
import test from "node:test";
import type { MinecraftManagerWithBot } from "../src/types/minecraft.js";

class ConcurrentCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData().setName("concurrent");
  readonly observations: string[] = [];

  override async execute(): Promise<void> {
    this.observations.push(`before:${this.context.player}:${this.context.channel}`);
    await new Promise((resolve) => setTimeout(resolve, this.context.channel === "guild" ? 15 : 5));
    this.observations.push(`after:${this.context.player}:${this.context.channel}`);
  }
}

const manager = { application: { config: { minecraft: { commands: { maxMessageLength: 256 } } } } } as unknown as MinecraftManagerWithBot;

test("keeps concurrent Minecraft command invocation contexts isolated", async () => {
  const command = new ConcurrentCommand(manager);

  await Promise.all([
    command.run({ player: "GuildPlayer", rawMessage: "!concurrent", args: [], channel: "guild", signal: new AbortController().signal }),
    command.run({ player: "OfficerPlayer", rawMessage: "!concurrent", args: [], channel: "officer", signal: new AbortController().signal })
  ]);

  assert.deepEqual(
    new Set(command.observations),
    new Set(["before:GuildPlayer:guild", "after:GuildPlayer:guild", "before:OfficerPlayer:officer", "after:OfficerPlayer:officer"])
  );
});
