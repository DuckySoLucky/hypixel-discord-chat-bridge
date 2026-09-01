import HypixelDiscordChatBridgeError from "../private/error.js";
import { DiscordjsError } from "discord.js";
import { ErrorEmbed } from "../discord/private/EmbedHelper.js";
import { HypixelAPIRebornError } from "hypixel-api-reborn";
import { MinecraftRequestTimeoutError } from "../minecraft/MinecraftRequestBroker.ts";
import type { DataWithTimestamp } from "../types/misc.js";
import type { EmbedHelperField } from "../types/discord.js";
import type { ValidErrors } from "../types/application.js";

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateId(length: number): string {
  let result = "";
  const characters = "abcde0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

export function formatError(error: ValidErrors): string {
  return error
    .toString()
    .replace("Hypixel-API-Reborn", "hypixel-api-reborn")
    .replace("[hypixel-api-reborn] ", "")
    .replace("For help join our Discord Server https://discord.gg/NSEBNMM", "")
    .replace("Error:", "[ERROR]");
}

// CREDIT: https://github.com/Senither/hypixel-skyblock-facade (Modified)
export function isUuid(uuid: string): boolean {
  if (uuid === undefined || uuid === null || typeof uuid !== "string") {
    return false;
  }

  return (
    /^[0-9a-fA-F]{8}[0-9a-fA-F]{4}[0-9a-fA-F]{4}[0-9a-fA-F]{4}[0-9a-fA-F]{12}$/.test(uuid) ||
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid)
  );
}

export function replaceAllRanks(input: string): string {
  input = input.replaceAll("[ዞ] ", "");
  input = input.replaceAll("[MINISTER] ", "");
  input = input.replaceAll("[MCP] ", "");
  input = input.replaceAll("[MOJANG] ", "");
  input = input.replaceAll("[EVENTS] ", "");
  input = input.replaceAll("[PIG+++] ", "");
  input = input.replaceAll("[INNIT] ", "");
  input = input.replaceAll("[YOUTUBE] ", "");
  input = input.replaceAll("[MVP++] ", "");
  input = input.replaceAll("[MVP+] ", "");
  input = input.replaceAll("[MVP] ", "");
  input = input.replaceAll("[VIP+] ", "");
  input = input.replaceAll("[VIP] ", "");
  return input;
}

export function getNestedValue(obj: unknown, path: string): unknown {
  let current = obj;
  for (const key of path.split(".")) {
    if (typeof current !== "object" || current === null || Array.isArray(current)) return undefined;
    current = Reflect.get(current, key);
  }
  return current;
}

export function getMostRecent<T extends DataWithTimestamp>(data: T[]): T | undefined {
  return [...data].sort((a, b) => b.timestamp - a.timestamp)[0];
}

export function getErrorTypeName(error: ValidErrors): string {
  if (error instanceof HypixelDiscordChatBridgeError) return "HypixelDiscordChatBridgeError";
  else if (error instanceof HypixelAPIRebornError) return "HypixelAPIRebornError";
  else if (error instanceof DiscordjsError) return "DiscordJsError";
  else if (error instanceof MinecraftRequestTimeoutError) return "MinecraftRequestTimeoutError";
  return "Generic Error";
}

export function getErrorEmbed(error: ValidErrors, extraData: EmbedHelperField[] = []): ErrorEmbed {
  const errorStack = error instanceof Error ? (error.stack ?? error.message) : String(error ?? "Unknown");
  return new ErrorEmbed().setDescription(`\`\`\`${errorStack}\`\`\``).setFields(...[{ name: "Error Type", value: getErrorTypeName(error) }, ...extraData]);
}
