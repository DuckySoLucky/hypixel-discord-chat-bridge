import HypixelDiscordChatBridgeError from "./private/error.js";
import { Config, ConfigChangeType, type MigrationMap } from "./types/config.js";
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
        "statsChannels.autoUpdaterInterval": {
          key: "statsChannels.autoUpdater.interval",
          change: ConfigChangeType.Transform,
          transform: (value: any): any => `${value}m`
        },
        "verification.inactivity.channel": { change: ConfigChangeType.Delete },
        "verification.inactivity.maxInactivityTime": {
          key: "verification.inactivity.maxInactivityTime",
          change: ConfigChangeType.Transform,
          transform: (value: any): any => `${value}d`
        },
        "verification.autoRoleUpdater.enabled": { key: "verification.roles.autoUpdater.enabled", change: ConfigChangeType.Move },
        "verification.autoRoleUpdater.interval": {
          key: "verification.roles.autoUpdater.interval",
          change: ConfigChangeType.Transform,
          transform: (value: any): any => `${value}h`
        }
      },
      3: { "minecraft.guild.requirements.requiredToHave": { key: "minecraft.guild.requirements.requirementsNeededToPass", change: ConfigChangeType.Move } },
      4: { "minecraft.autoLimbo": { change: ConfigChangeType.Delete }, "other.codeUpdater": { change: ConfigChangeType.Delete } }
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

  static async getExampleConfigFile(): Promise<Record<string, any>> {
    const file = await readFile("config.example.json", "utf-8");
    return JSON.parse(file);
  }

  static async getConfigFile(): Promise<Record<string, any>> {
    const file = await readFile("config.json", "utf-8");
    return JSON.parse(file);
  }

  private async saveConfigFile(config: Record<string, any>) {
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
    return version;
  }

  private async handleBackupConfig(config: Record<string, any>) {
    if (this.shouldBackupConfig === false) return console.warn("Config backup is disabled");
    return await ConfigManager.backupConfig(config);
  }

  static async backupConfig(config: Record<string, any>, skipCheck: boolean = false) {
    if (skipCheck === false && config.other.backupConfigs === false) return console.warn("Config backup is disabled");
    await mkdir("./data/backup/config", { recursive: true });
    await writeFile(`./data/backup/config/config_${new Date().toISOString()}.json`, JSON.stringify(config, null, 2), "utf-8");
    console.other("Saved config backup");
  }

  private async migrate() {
    const config = await ConfigManager.getConfigFile();
    let currentVersion = config.configVersion;
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
    this.saveConfigFile(config);
  }

  private applyMigration(config: any, migration: MigrationMap) {
    for (const [oldPath, rule] of Object.entries(migration)) {
      const value = getNestedValue(config, oldPath);
      if (value === undefined) continue;
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

  private setNestedValue(obj: any, path: string, value: any) {
    const keys = path.split(".");
    const lastKey = keys.pop()!;

    let current = obj;
    for (const key of keys) {
      if (!current[key] || typeof current[key] !== "object") {
        current[key] = {};
        this.hasConfigChanged = true;
      }

      current = current[key];
    }

    if (current[lastKey] !== value) {
      current[lastKey] = value;
      this.hasConfigChanged = true;
    }
  }

  private deleteNestedValue(obj: any, path: string) {
    const keys = path.split(".");
    const lastKey = keys.pop()!;
    const parent = keys.reduce((o, key) => o?.[key], obj);
    if (parent && lastKey in parent) {
      delete parent[lastKey];
      this.hasConfigChanged = true;
    }
    this.cleanupEmptyObjects(obj);
  }

  private cleanupEmptyObjects(obj: any) {
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
        this.cleanupEmptyObjects(obj[key]);
        if (Object.keys(obj[key]).length === 0) {
          delete obj[key];
          this.hasConfigChanged = true;
        }
      }
    }
  }

  private mergeMissingKeys(target: any, source: any) {
    for (const key of Object.keys(source)) {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (targetValue === undefined) {
        target[key] = structuredClone(sourceValue);
        this.hasConfigChanged = true;
        continue;
      }

      if (this.isObject(sourceValue) && this.isObject(targetValue)) this.mergeMissingKeys(targetValue, sourceValue);
    }
  }

  private isObject(value: any): boolean {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  static async validate(): Promise<Config> {
    console.other("Validating config");
    const configFile = await ConfigManager.getConfigFile();
    const parse = await Config.safeParseAsync(configFile);
    if (parse.success) {
      console.other("Config is valid");
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
