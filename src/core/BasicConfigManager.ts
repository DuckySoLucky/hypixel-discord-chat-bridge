import HypixelDiscordChatBridgeError from "../private/error.js";
import { ConfigChangeType, type JsonObject, type JsonValue, type MigrationMap } from "../types/config.js";
import { displayBigMessage } from "../private/logger.js";
import { getNestedValue } from "../utils/miscUtils.js";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import type { ZodType } from "zod";

abstract class BasicConfigManager<TypedConfig extends JsonObject> {
  protected abstract readonly configPath: string;
  protected abstract readonly defaultConfigPath: string;
  protected abstract readonly versions: Record<number, MigrationMap>;
  protected abstract readonly schema: ZodType<TypedConfig>;

  private hasConfigChanged = false;
  constructor(private readonly shouldBackupConfig: boolean = true) {}

  async init(): Promise<TypedConfig> {
    console.other("Checking config");
    await this.migrate();
    const config = await this.validate();
    await this.handleBackupConfig(config);
    return config;
  }

  async getExampleConfigFile(): Promise<JsonObject> {
    const file = await readFile(this.defaultConfigPath, "utf-8");
    return this.parseJsonObject(file, this.defaultConfigPath);
  }

  async getConfigFile(): Promise<JsonObject> {
    const file = await readFile(this.configPath, "utf-8");
    return this.parseJsonObject(file, this.configPath);
  }

  private async saveConfigFile(config: JsonObject): Promise<void> {
    if (!this.hasConfigChanged) return;
    await writeFile(this.configPath, JSON.stringify(config, null, 2), "utf-8");
    displayBigMessage("Config updated! Restarting");
    process.exit(1);
  }

  async getConfigVersion(): Promise<number> {
    const configFile = await this.getConfigFile();
    const version = configFile.configVersion;
    if (version === undefined) {
      console.error("Config Version not found. Please manually update your config");
      process.exit(1);
    }
    if (typeof version !== "number") throw new HypixelDiscordChatBridgeError("Config Version must be a number.");
    return version;
  }

  private async handleBackupConfig(config: JsonObject | TypedConfig): Promise<void> {
    if (this.shouldBackupConfig === false) {
      console.warn("Config backup is disabled");
      return;
    }

    await this.backupConfig(config);
  }

  async backupConfig(config: JsonObject | TypedConfig, skipCheck: boolean = false): Promise<void> {
    if (this.shouldBackupConfig === false) return console.warn("Config backup is disabled");
    if (skipCheck === false && getNestedValue(config, "other.backupConfigs") === false) return console.warn("Config backup is disabled");
    await mkdir("./data/backup/config", { recursive: true });
    await writeFile(`./data/backup/config/config_${new Date().toISOString()}.json`, JSON.stringify(config, null, 2), "utf-8");
    console.other("Saved config backup");
  }

  getLatestVersion(): number {
    return Math.max(...Object.keys(this.versions).map(Number));
  }

  private async migrate(): Promise<void> {
    const config = await this.getConfigFile();
    const configuredVersion = config.configVersion;
    if (typeof configuredVersion !== "number") throw new HypixelDiscordChatBridgeError("Config Version must be a number.");
    let currentVersion: number = configuredVersion;
    const latestVersion = this.getLatestVersion();

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

    const exampleConfig = await this.getExampleConfigFile();
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

  private parseJsonObject(input: string, source: string): JsonObject {
    const parsed: unknown = JSON.parse(input);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new HypixelDiscordChatBridgeError(`${source} must contain a JSON object.`);
    return parsed as JsonObject;
  }

  async validate(): Promise<TypedConfig> {
    console.other("Validating config");
    return await this.validateConfigData(await this.getConfigFile());
  }

  async validateExampleConfig(): Promise<TypedConfig> {
    console.other("Validating example config");
    const config = await this.validateConfigData(await this.getExampleConfigFile());
    const latestVersion = this.getLatestVersion();
    if (config.configVersion !== latestVersion) {
      console.error(`Invalid config version... Current version is ${config.configVersion} and latest is ${latestVersion}`);
      process.exit(1);
    }

    return config;
  }

  private async validateConfigData(data: JsonObject): Promise<TypedConfig> {
    const parse = await this.schema.safeParseAsync(data);
    if (parse.success) {
      console.other("Config is valid");
      return this.onConfigValidated(parse.data);
    }
    console.error("Errors found inside of config...");
    parse.error.issues.forEach(({ path, message }) => {
      const fullPath = path.join(".") || "<root>";
      console.error(`[${fullPath}] ${message}`);
    });
    process.exit(1);
  }

  protected onConfigValidated(config: TypedConfig): TypedConfig {
    return config;
  }
}

export default BasicConfigManager;
