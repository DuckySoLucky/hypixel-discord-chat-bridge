export function Delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function GenerateId(length: number): string {
  let result = "";
  const characters = "abcde0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

export function FormatError(error: Error): string {
  return error.toString().replace("[hypixel-api-reborn] ", "").replace("For help join our Discord Server https://discord.gg/NSEBNMM", "").replace("Error:", "[ERROR]");
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

export function ReplaceAllRanks(input: string): string {
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
