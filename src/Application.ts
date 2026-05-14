import DiscordManager from "./Discord/DiscordManager.js";
import HypixelAPIReborn from "./Private/HypixelAPIReborn.js";
import HypixelDiscordChatBridgeError from "./Private/Error.js";
import LinkedManager from "./Linked/LinkedManager.js";
import MinecraftManager from "./Minecraft/MinecraftManager.js";
import config from "../config.json" with { type: "json" };
import messages from "../messages.json" with { type: "json" };
import { configUpdateMessage, updateMessage } from "./Private/Logger.js";
import { exec } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import type { Guild } from "hypixel-api-reborn";

class Application {
  readonly config: typeof config;
  readonly messages: typeof messages;
  readonly discord: DiscordManager;
  readonly linked: LinkedManager;
  readonly minecraft: MinecraftManager;

  private exampleConfig: Record<string, any>;
  private configFile: Record<string, any>;
  constructor() {
    this.config = config;
    this.messages = messages;
    this.discord = new DiscordManager(this);
    this.linked = new LinkedManager(this);
    this.minecraft = new MinecraftManager(this);

    this.exampleConfig = JSON.parse(readFileSync("config.example.json").toString());
    this.configFile = JSON.parse(readFileSync("config.json").toString());

    this.migrateConfig();

    for (const [key, value] of Object.entries(this.exampleConfig)) {
      if (this.configFile[key] === undefined) {
        this.configFile[key] = value;
        configUpdateMessage(`${key}: ${JSON.stringify(value)}`);
      }

      if (typeof value === "object") this.checkConfig(this.configFile[key], this.exampleConfig[key]);
    }

    writeFileSync("config.json", JSON.stringify(this.configFile, null, 2));
  }

  connect() {
    this.discord.connect();
    // this.minecraft.connect();
  }

  async stop(): Promise<void> {
    if (this.discord.isClientOnline()) await this.discord.client.destroy();
    if (this.minecraft.isBotOnline()) this.minecraft.bot.end("Shutting Down");
  }

  updateCode() {
    if (this.config.other.autoUpdater === false) return;
    exec("git pull", (error, stdout, stderr) => {
      if (error) return console.error(error);

      // console.log(`Git pull output: ${stdout}`);

      if (stdout === "Already up to date.\n") return;

      updateMessage();
    });
  }

  migrateConfig() {
    this.configFile.verification ??= {};
    const nickname = this.configFile.verification.nickname;
    if (typeof nickname === "string") this.configFile.verification.nickname = { nickname };

    const REQUIREMENT_MAP = {
      bedwarsStar: "bedwarsStars",
      bedwarsFinalKDRatio: "bedwarsFKDR",
      skywarsStar: "skywarsStars",
      skywarsKDRatio: "skywarsKDR",
      duelsWins: "duelsWins",
      duelsWLRatio: "duelsWLR",
      skyblockLevel: "skyblockLevel"
    };

    this.configFile.minecraft ??= {};
    this.configFile.minecraft.guildRequirements ??= {};
    this.configFile.minecraft.guildRequirements.requirements ??= {};
    const oldReq = this.configFile.minecraft.guildRequirements.requirements;

    this.configFile.minecraft.guildRequirements.requirements = Object.fromEntries(
      Object.entries(REQUIREMENT_MAP)
        .map(([newKey, oldKey]) => [newKey, oldReq[oldKey]])
        .filter(([, value]) => value !== -1 && value !== undefined)
    );
  }

  checkConfig(object: Record<string, any>, exampleObject: Record<string, any>) {
    for (const [key, value] of Object.entries(exampleObject)) {
      if (key === "messageFormat" && object[key] && object[key].length <= 2) object[key] = value;

      if (object[key] === undefined) {
        object[key] = value;
        configUpdateMessage(`${key}: ${JSON.stringify(value)}`);
      }

      if (typeof value === "object") this.checkConfig(object[key], exampleObject[key]);
    }
  }

  async getBotGuild(): Promise<Guild> {
    if (!this.minecraft.isBotOnline()) throw new HypixelDiscordChatBridgeError("Bot doesn't seem to be connected to Hypixel. Please try again.");
    return await HypixelAPIReborn.getGuild("player", this.minecraft.bot.username).then((guild) => {
      if (guild === null) throw new HypixelDiscordChatBridgeError("In game Hypixel Guild not found.");
      if (guild.isRaw()) throw new HypixelDiscordChatBridgeError("In game Hypixel Guild not found.");
      return guild;
    });
  }
}

export default Application;
