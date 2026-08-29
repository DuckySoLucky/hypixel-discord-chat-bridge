import MessageHandler from "../src/discord/handlers/MessageHandler.js";
import assert from "node:assert/strict";
import test from "node:test";
import type DiscordManager from "../src/discord/DiscordManager.js";
import type { GuildMember, Message, Role } from "discord.js";

function createMessage(content: string, roles: ReadonlyMap<string, Role> = new Map()): Message {
  return {
    content,
    guild: { roles: { cache: new Map() }, members: { cache: new Map() }, channels: { cache: new Map() } },
    mentions: { roles, members: new Map<string, GuildMember>(), channels: new Map() },
    stickers: { size: 0 },
    attachments: { size: 0 }
  } as unknown as Message;
}

test("resolves Discord role mentions before broadcasting to Minecraft", () => {
  const handler = new MessageHandler({} as DiscordManager);
  const role = { id: "1530548906348249168", name: "Guild Member" } as Role;
  const message = createMessage("hello <@&1530548906348249168>", new Map([[role.id, role]]));

  assert.equal(handler.stripDiscordContent(message).trim(), "hello @Guild Member");
});

test("replaces unresolved Discord role mentions with a readable fallback", () => {
  const handler = new MessageHandler({} as DiscordManager);

  assert.equal(handler.stripDiscordContent(createMessage("<@&1530548906348249168>")).trim(), "@unknown-role");
});
