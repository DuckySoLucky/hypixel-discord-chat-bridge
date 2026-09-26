export function parseChatComponent(value: string): object {
  const parsed: unknown = JSON.parse(value);
  if (typeof parsed !== "object" || parsed === null) throw new Error("Minecraft chat component is not an object.");
  return parsed;
}
