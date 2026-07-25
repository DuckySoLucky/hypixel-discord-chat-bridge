import type HypixelDiscordChatBridgeError from "../private/error.js";

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

export function formatError(error: Error | HypixelDiscordChatBridgeError): string {
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

export function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((o, key) => o?.[key], obj);
}
