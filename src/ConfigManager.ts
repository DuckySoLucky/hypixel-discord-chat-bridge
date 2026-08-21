import HypixelDiscordChatBridgeError from "./private/error.js";
import MinecraftManager from "./minecraft/MinecraftManager.js";
import { Config, ConfigChangeType, type JsonObject, type JsonValue, type MigrationMap } from "./types/config.js";
import { displayBigMessage } from "./private/logger.js";
import { getNestedValue } from "./utils/miscUtils.js";
import { mkdir, readFile, writeFile } from "node:fs/promises";

class ConfigManager {
  private versions: Record<number, MigrationMap>;
  private hasConfigChanged: boolean;
  constructor(private shouldBackupConfig: boolean = true) {
    this.versions = {
      2: {
        "discord.bot.serverID": { key: "discord.serverId", change: ConfigChangeType.Move },
        "discord.bot.token": { key: "discord.token", change: ConfigChangeType.Move },
        "discord.channels.allowedBots": { key: "bridge.discord.allowedBots", change: ConfigChangeType.Move },
        "discord.channels.debugChannel": { key: "bridge.channels.debug.channel", change: ConfigChangeType.Move },
        "discord.channels.debugChannelMessageMode": { key: "bridge.channels.debug.mode", change: ConfigChangeType.Move },
        "discord.channels.debugMode": { key: "bridge.channels.debug.enabled", change: ConfigChangeType.Move },
        "discord.channels.guildChatChannel": { key: "bridge.channels.guild.channel", change: ConfigChangeType.Move },
        "discord.channels.officerChannel": { key: "bridge.channels.officer.channel", change: ConfigChangeType.Move },
        "discord.channels.loggingChannel": { key: "bridge.channels.logging.channel", change: ConfigChangeType.Move },
        "discord.commands.checkPerms": { key: "discord.commands.checkPermissions", change: ConfigChangeType.Move },
        "discord.commands.commandRole": { key: "discord.commands.staffRole", change: ConfigChangeType.Move },
        "discord.commands.users": { key: "discord.commands.adminUsers", change: ConfigChangeType.Move },
        "discord.commands.blacklistRoles": { change: ConfigChangeType.Delete },
        "discord.other.autoLimbo": { key: "minecraft.autoLimbo", change: ConfigChangeType.Move },
        "discord.other.filterMessages": { key: "bridge.filter.enabled", change: ConfigChangeType.Move },
        "discord.other.filterWords": { key: "bridge.filter.customWords", change: ConfigChangeType.Move },
        "discord.other.messageMode": { key: "bridge.discord.mode", change: ConfigChangeType.Move },
        "discord.other.messageFormat": { key: "bridge.discord.format", change: ConfigChangeType.Move },
        "discord.other.stripEmojisFromUsernames": { key: "bridge.stripEmojisFromUsernames", change: ConfigChangeType.Move },
        "discord.other.joinMessage": { change: ConfigChangeType.Delete },
        "minecraft.fragBot": { change: ConfigChangeType.Delete },
        "minecraft.API.hypixelAPIkey": { key: "API.hypixel.key", change: ConfigChangeType.Move },
        "minecraft.API.imgurAPIkey": { change: ConfigChangeType.Delete },
        "minecraft.bot.messageFormat": { key: "bridge.minecraft.format", change: ConfigChangeType.Move },
        "minecraft.bot.messageRepeatBypassLength": { key: "minecraft.commands.messageRepeatBypassLength", change: ConfigChangeType.Move },
        "minecraft.commands.normal": { key: "minecraft.commands.normal.enabled", change: ConfigChangeType.Move },
        "minecraft.commands.soopy": { key: "minecraft.commands.soopy.enabled", change: ConfigChangeType.Move },
        "minecraft.bot.prefix": { key: "minecraft.commands.normal.prefix", change: ConfigChangeType.Move },
        "minecraft.hypixelUpdates.enabled": { change: ConfigChangeType.Delete },
        "minecraft.hypixelAlerts.hypixelNews": { key: "minecraft.hypixelAlerts.hypixelNews.enabled", change: ConfigChangeType.Move },
        "minecraft.hypixelAlerts.statusUpdates": { key: "minecraft.hypixelAlerts.hypixelNews.enabled", change: ConfigChangeType.Move },
        "minecraft.hypixelAlerts.skyblockVersion": { key: "minecraft.hypixelAlerts.skyblockVersion.enabled", change: ConfigChangeType.Move },
        "minecraft.hypixelAlerts.alphaPlayerCountTracker": { key: "minecraft.hypixelAlerts.alphaPlayerCountTracker.enabled", change: ConfigChangeType.Move },
        "minecraft.skyblockEventsNotifications": { change: ConfigChangeType.Delete },
        "minecraft.guildRequirements": { key: "minecraft.guild.requirements", change: ConfigChangeType.Move },
        "web": { change: ConfigChangeType.Delete },
        "other.timezone": { change: ConfigChangeType.Delete },
        "statsChannels.autoUpdaterInterval": { key: "statsChannels.autoUpdater.interval", change: ConfigChangeType.Transform, transform: (value) => `${String(value)}m` },
        "verification.inactivity.channel": { change: ConfigChangeType.Delete },
        "verification.inactivity.maxInactivityTime": {
          key: "verification.inactivity.maxInactivityTime",
          change: ConfigChangeType.Transform,
          transform: (value) => `${String(value)}d`
        },
        "verification.autoRoleUpdater.enabled": { key: "verification.roles.autoUpdater.enabled", change: ConfigChangeType.Move },
        "verification.autoRoleUpdater.interval": {
          key: "verification.roles.autoUpdater.interval",
          change: ConfigChangeType.Transform,
          transform: (value) => `${String(value)}h`
        }
      },
      3: { "minecraft.guild.requirements.requiredToHave": { key: "minecraft.guild.requirements.requirementsNeededToPass", change: ConfigChangeType.Move } },
      4: { "minecraft.autoLimbo": { change: ConfigChangeType.Delete }, "other.codeUpdater": { change: ConfigChangeType.Delete } },
      5: {
        "minecraft.bot.accountsLocation": {
          key: "minecraft.bot.accountsLocation",
          change: ConfigChangeType.Transform,
          transform: (value) => {
            if (value === "./auth-cache") return "./data/auth-cache";
            return value;
          }
        },
        "other.logToFiles": { key: "other.logging.saveToFiles", change: ConfigChangeType.Move }
      }
    };
    this.hasConfigChanged = false;
  }

  async init(): Promise<Config> {
    console.other("Checking config");
    await this.migrate();
    const config = await ConfigManager.validate();
    await this.handleBackupConfig(config);
    return config;
  }

  static async getExampleConfigFile(): Promise<JsonObject> {
    const file = await readFile("config.example.json", "utf-8");
    return this.parseJsonObject(file, "config.example.json");
  }

  static async getConfigFile(): Promise<JsonObject> {
    const file = await readFile("config.json", "utf-8");
    return this.parseJsonObject(file, "config.json");
  }

  private async saveConfigFile(config: JsonObject): Promise<void> {
    if (!this.hasConfigChanged) return;
    await writeFile("config.json", JSON.stringify(config, null, 2), "utf-8");
    displayBigMessage("Config updated! Restarting");
    process.exit(1);
  }

  static async getConfigVersion(): Promise<number> {
    const configFile = await this.getConfigFile();
    const version = configFile.configVersion;
    if (version === undefined) {
      console.error("Config Version not found. Please manually update your config");
      process.exitCode = 0;
    }
    if (typeof version !== "number") throw new HypixelDiscordChatBridgeError("Config Version must be a number.");
    return version;
  }

  private async handleBackupConfig(config: JsonObject | Config): Promise<void> {
    if (this.shouldBackupConfig === false) return console.warn("Config backup is disabled");
    await ConfigManager.backupConfig(config);
  }

  static async backupConfig(config: JsonObject | Config, skipCheck: boolean = false): Promise<void> {
    if (skipCheck === false && getNestedValue(config, "other.backupConfigs") === false) return console.warn("Config backup is disabled");
    await mkdir("./data/backup/config", { recursive: true });
    await writeFile(`./data/backup/config/config_${new Date().toISOString()}.json`, JSON.stringify(config, null, 2), "utf-8");
    console.other("Saved config backup");
  }

  private async migrate() {
    const config = await ConfigManager.getConfigFile();
    const configuredVersion = config.configVersion;
    if (typeof configuredVersion !== "number") throw new HypixelDiscordChatBridgeError("Config Version must be a number.");
    let currentVersion: number = configuredVersion;
    const latestVersion = Math.max(...Object.keys(this.versions).map(Number));

    while (currentVersion < latestVersion) {
      const nextVersion = currentVersion + 1;
      const migration = this.versions[nextVersion];
      if (!migration) throw new HypixelDiscordChatBridgeError(`Missing migration for config version ${nextVersion}`);
      console.other(`Attempting to migrate config v${currentVersion} to v${nextVersion}`);
      await this.handleBackupConfig(config);
      this.applyMigration(config, migration);
      console.other(`Migrated config v${currentVersion} to v${nextVersion}`);
      config.configVersion = nextVersion;
      currentVersion = nextVersion;
    }

    const exampleConfig = await ConfigManager.getExampleConfigFile();
    this.mergeMissingKeys(config, exampleConfig);
    await this.saveConfigFile(config);
  }

  private applyMigration(config: JsonObject, migration: MigrationMap): void {
    for (const [oldPath, rule] of Object.entries(migration)) {
      const value = getNestedValue(config, oldPath);
      if (value === undefined) continue;
      if (!this.isJsonValue(value)) throw new HypixelDiscordChatBridgeError(`Migration value at "${oldPath}" is not valid JSON.`);
      switch (rule.change) {
        case ConfigChangeType.Move: {
          if (!rule.key) throw new HypixelDiscordChatBridgeError(`Move migration missing target key for "${oldPath}"`);
          this.setNestedValue(config, rule.key, value);
          this.deleteNestedValue(config, oldPath);
          break;
        }
        case ConfigChangeType.Delete: {
          this.deleteNestedValue(config, oldPath);
          break;
        }
        case ConfigChangeType.Transform: {
          if (!rule.transform) throw new HypixelDiscordChatBridgeError(`Transform migration missing transform function for "${oldPath}"`);
          if (!rule.key) throw new HypixelDiscordChatBridgeError(`Transform migration missing target key for "${oldPath}"`);
          const transformed = rule.transform(value, config);
          this.setNestedValue(config, rule.key, transformed);
          this.deleteNestedValue(config, oldPath);
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  private setNestedValue(obj: JsonObject, path: string, value: JsonValue): void {
    const keys = path.split(".");
    const lastKey = keys.pop();
    if (!lastKey) throw new HypixelDiscordChatBridgeError("Cannot set an empty configuration path.");

    let current: JsonObject = obj;
    for (const key of keys) {
      if (!this.isObject(current[key])) {
        current[key] = {};
        this.hasConfigChanged = true;
      }
      const next = current[key];
      if (!this.isObject(next)) throw new HypixelDiscordChatBridgeError(`Unable to create configuration path "${path}".`);
      current = next;
    }

    if (current[lastKey] !== value) {
      current[lastKey] = value;
      this.hasConfigChanged = true;
    }
  }

  private deleteNestedValue(obj: JsonObject, path: string): void {
    const keys = path.split(".");
    const lastKey = keys.pop();
    if (!lastKey) return;
    const parent = getNestedValue(obj, keys.join("."));
    if (this.isObject(parent) && lastKey in parent) {
      delete parent[lastKey];
      this.hasConfigChanged = true;
    }
    this.cleanupEmptyObjects(obj);
  }

  private cleanupEmptyObjects(obj: JsonObject): void {
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      if (this.isObject(value)) {
        this.cleanupEmptyObjects(value);
        if (Object.keys(value).length === 0) {
          delete obj[key];
          this.hasConfigChanged = true;
        }
      }
    }
  }

  private mergeMissingKeys(target: JsonObject, source: JsonObject): void {
    for (const key of Object.keys(source)) {
      const sourceValue = source[key];
      const targetValue = target[key];
      if (sourceValue === undefined) continue;

      if (targetValue === undefined) {
        target[key] = structuredClone(sourceValue);
        this.hasConfigChanged = true;
        continue;
      }

      if (this.isObject(sourceValue) && this.isObject(targetValue)) this.mergeMissingKeys(targetValue, sourceValue);
    }
  }

  private isObject(value: unknown): value is JsonObject {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  private isJsonValue(value: unknown): value is JsonValue {
    if (value === null || ["string", "number", "boolean"].includes(typeof value)) return true;
    if (Array.isArray(value)) return value.every((entry) => this.isJsonValue(entry));
    return this.isObject(value) && Object.values(value).every((entry) => this.isJsonValue(entry));
  }

  private static parseJsonObject(input: string, source: string): JsonObject {
    const parsed: unknown = JSON.parse(input);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new HypixelDiscordChatBridgeError(`${source} must contain a JSON object.`);
    return parsed as JsonObject;
  }

  static async validate(): Promise<Config> {
    console.other("Validating config");
    const configFile = await ConfigManager.getConfigFile();
    const parse = await Config.safeParseAsync(configFile);
    if (parse.success) {
      console.other("Config is valid");
      MinecraftManager.validateMinecraftVersion(parse.data.minecraft.bot.version);
      return parse.data;
    }
    parse.error.issues.forEach(({ path, message }) => {
      const fullPath = path.join(".") || "<root>";
      console.other(`[${fullPath}] ${message}`);
    });
    process.exit(1);
  }
}

export default ConfigManager;
