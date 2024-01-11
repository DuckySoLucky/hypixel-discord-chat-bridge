const ChatHandler = require("../src/minecraft/handlers/ChatHandler.js");
const { describe, it, expect, beforeEach } = require("@jest/globals");

describe("ChatHandler", () => {
  describe("uncoloredRegex", () => {
    const regex =
      /^(?<chatType>\w+) > (?:(?:\[(?<rank>[^\]]+)\] )?(?:(?<username>\w+)(?: \[(?<guildRank>[^\]]+)\])?: )?)?(?<message>.+)$/;

    it("should match a regular message", () => {
      const message = "Guild > [MVP+] DuckySoLucky [Staff]: Test Message";
      const match = message.match(regex);
      expect(match).toBeTruthy();
      expect(match.groups.chatType).toBe("Guild");
      expect(match.groups.rank).toBe("MVP+");
      expect(match.groups.username).toBe("DuckySoLucky");
      expect(match.groups.guildRank).toBe("Staff");
      expect(match.groups.message).toBe("Test Message");
    });

    it("should match a message with rank but without guild rank", () => {
      const message = "Guild > [MVP+] DuckySoLucky: Test Message";
      const match = message.match(regex);
      expect(match).toBeTruthy();
      expect(match.groups.chatType).toBe("Guild");
      expect(match.groups.rank).toBe("MVP+");
      expect(match.groups.username).toBe("DuckySoLucky");
      expect(match.groups.guildRank).toBeUndefined();
      expect(match.groups.message).toBe("Test Message");
    });

    it("should match a message without rank but with guild rank", () => {
      const message = "Guild > DuckySoLucky [Staff]: Test Message";
      const match = message.match(regex);
      expect(match).toBeTruthy();
      expect(match.groups.chatType).toBe("Guild");
      expect(match.groups.rank).toBeUndefined();
      expect(match.groups.username).toBe("DuckySoLucky");
      expect(match.groups.guildRank).toBe("Staff");
      expect(match.groups.message).toBe("Test Message");
    });

    it("should match a message without rank or guild rank", () => {
      const message = "Guild > DuckySoLucky: Test Message";
      const match = message.match(regex);
      expect(match).toBeTruthy();
      expect(match.groups.chatType).toBe("Guild");
      expect(match.groups.rank).toBeUndefined();
      expect(match.groups.username).toBe("DuckySoLucky");
      expect(match.groups.guildRank).toBeUndefined();
      expect(match.groups.message).toBe("Test Message");
    });
  });

  describe("coloredRegex", () => {
    const regex =
      /^(?<chatType>§[0-9a-fA-F](Guild|Officer)) > (?<rank>§[0-9a-fA-F](?:\[.*?\])?)?\s*(?<username>[^§\s]+)\s*(?:(?<guildRank>§[0-9a-fA-F](?:\[.*?\])?))?\s*§f: (?<message>.*)/;

    it("should match a regular message", () => {
      const message = "§2Guild > §b[MVP§0+§b] DuckySoSkilled §2[Staff]§f: yeeeee";
      const match = message.match(regex);
      expect(match).toBeTruthy();
      expect(match.groups.chatType).toBe("§2Guild");
      expect(match.groups.rank).toBe("§b[MVP§0+§b]");
      expect(match.groups.username).toBe("DuckySoSkilled");
      expect(match.groups.guildRank).toBe("§2[Staff]");
      expect(match.groups.message).toBe("yeeeee");
    });

    it("should match a message with rank but without guild rank", () => {
      const message = "§2Guild > §b[MVP§0+§b] DuckySoSkilled§f: yeeeee";
      const match = message.match(regex);
      expect(match).toBeTruthy();
      expect(match.groups.chatType).toBe("§2Guild");
      expect(match.groups.rank).toBe("§b[MVP§0+§b]");
      expect(match.groups.username).toBe("DuckySoSkilled");
      expect(match.groups.guildRank).toBeUndefined();
      expect(match.groups.message).toBe("yeeeee");
    });

    it("should match a message without rank but with guild rank", () => {
      const message = "§2Guild > §7DuckySoSkilled §2[Staff]§f: yeeeee";
      const match = message.match(regex);
      expect(match).toBeTruthy();
      expect(match.groups.chatType).toBe("§2Guild");
      expect(match.groups.rank).toBe("§7");
      expect(match.groups.username).toBe("DuckySoSkilled");
      expect(match.groups.guildRank).toBe("§2[Staff]");
      expect(match.groups.message).toBe("yeeeee");
    });

    it("should match a message without rank or guild rank", () => {
      const message = "§2Guild > §7DuckySoSkilled§f: yeeeee";
      const match = message.match(regex);
      expect(match).toBeTruthy();
      expect(match.groups.chatType).toBe("§2Guild");
      expect(match.groups.rank).toBe("§7");
      expect(match.groups.username).toBe("DuckySoSkilled");
      expect(match.groups.guildRank).toBeUndefined();
      expect(match.groups.message).toBe("yeeeee");
    });
  });
  let chatHandler;
  beforeEach(() => {
    chatHandler = new ChatHandler();
  });

  describe("isDiscordMessage", () => {
    it("should return true for a valid Discord message", () => {
      const messages = ["DuckySoSkilled » test", "DuckySoSkilled: test", "DuckySoSkilled > test"];
      for (const message of messages) {
        expect(chatHandler.isDiscordMessage(message)).toBe(true);
      }
    });

    it("should return false for an invalid Discord message", () => {
      const messages = ["DuckySoLucky message", "yeah i agree", "bro you're so bad", "test false: message"];
      for (const message of messages) {
        expect(chatHandler.isDiscordMessage(message)).toBe(false);
      }
    });
  });

  describe("isCommand", () => {
    it("!help", () => {
      const message = "!help";
      expect(chatHandler.isCommand(message)).toBe(true);
    });

    it("!skyblock DuckySoSkilled", () => {
      const message = "!skyblock DuckySoSkilled";
      expect(chatHandler.isCommand(message)).toBe(true);
    });

    it("-rtca DeathStreeks", () => {
      const message = "-rtca DeathStreeks";
      expect(chatHandler.isCommand(message)).toBe(true);
    });

    it("-chevent", () => {
      const message = "-chevent";
      expect(chatHandler.isCommand(message)).toBe(true);
    });
  });

  describe("getCommandData", () => {
    it("!skyblock DuckySoSkillled", () => {
      const message = "DuckySoSkilled: !skyblock DuckySoSkilled";
      const match = chatHandler.getCommandData(message);
      expect(match).toBeTruthy();
      expect(match.player).toBe("DuckySoSkilled");
      expect(match.command).toBe("!skyblock DuckySoSkilled");
    });

    it("!nw", () => {
      const message = "DeathStreeks: !nw";
      const match = chatHandler.getCommandData(message);
      expect(match).toBeTruthy();
      expect(match.player).toBe("DeathStreeks");
      expect(match.command).toBe("!nw");
    });

    it("-rtca", () => {
      const message = "15h: -rtca";
      const match = chatHandler.getCommandData(message);
      expect(match).toBeTruthy();
      expect(match.player).toBe("15h");
      expect(match.command).toBe("-rtca");
    });
  });
});
