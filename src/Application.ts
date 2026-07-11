import DataManager from "./data/DataManager.js";
import DiscordManager from "./discord/DiscordManager.js";
import HypixelAPIReborn from "./private/HypixelAPIReborn.js";
import HypixelDiscordChatBridgeError from "./private/error.js";
import MinecraftManager from "./minecraft/MinecraftManager.js";
import MowojangAPI from "./private/MowojangAPI.js";
import ScriptManager from "./scripts/ScriptsManager.js";
import TranslationsManager, { translate } from "./translations/TranslationsManager.js";
import packageJson from "../package.json" with { type: "json" };
import { Filter } from "bad-words";
import type { Config } from "./types/config.js";
import type { Guild } from "hypixel-api-reborn";
import type { ParsedSession } from "./types/MowojangAPI.js";

class Application {
  readonly package: typeof packageJson;
  readonly data: DataManager;
  readonly discord: DiscordManager;
  readonly minecraft: MinecraftManager;
  readonly scripts: ScriptManager;
  readonly translations: TranslationsManager;
  readonly filter: Filter;
  botGuild?: Guild;
  botGuildMembers?: ParsedSession[];
  constructor(
    readonly config: Config,
    deployScripts: boolean = true
  ) {
    this.package = packageJson;
    this.data = new DataManager(this);
    this.discord = new DiscordManager(this);
    this.minecraft = new MinecraftManager(this);
    this.scripts = new ScriptManager(this, deployScripts);
    this.translations = new TranslationsManager();

    this.filter = new Filter();
    this.filter.addWords(...(this.config.bridge.filter.customWords ?? []));

    this.discord.setBridge(this.minecraft);
    this.minecraft.setBridge(this.discord);
  }

  async connect() {
    await this.discord.connect();
    await this.minecraft.connect();
  }

  async stop() {
    if (this.discord.isClientOnline()) await this.discord.client.destroy();
    if (this.minecraft.isBotOnline()) this.minecraft.bot.end("Shutting Down");
  }

  async getBotGuild(): Promise<Guild> {
    if (!this.minecraft.isBotOnline()) throw new HypixelDiscordChatBridgeError(translate("minecraft.errors.offline"));
    this.botGuild = await HypixelAPIReborn.getGuild("player", this.minecraft.bot.username).then((guild) => {
      if (guild === null) throw new HypixelDiscordChatBridgeError(translate("api.hypixel.errors.failed.guild.not.in", { username: this.minecraft.bot?.username }));
      if (guild.isRaw()) throw new HypixelDiscordChatBridgeError(translate("api.hypixel.errors.failed.parse"));
      return guild;
    });
    this.botGuildMembers = await MowojangAPI.getSessions(this.botGuild.members.map((member) => member.uuid)).then((data) => {
      if (data.data === null) return undefined;
      return data.data.map(({ UUID, username }) => ({ UUID, username }));
    });
    if (this.config.blacklist.enabled && this.config.blacklist.actions.kickFromGuild.enabled) {
      this.botGuild.members.forEach(async (user) => {
        if (!this.minecraft.isBotOnline()) return;
        const blacklistUser = await this.data.blacklist.getUserByUUID(user.uuid);
        if (blacklistUser) this.minecraft.bot.chat(`/g kick ${await blacklistUser.getUsername()} ${this.config.blacklist.actions.kickFromGuild.reason}`);
      });
    }
    return this.botGuild;
  }
}

export default Application;
