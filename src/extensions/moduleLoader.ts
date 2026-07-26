import HypixelDiscordChatBridgeError from "../private/error.js";
import { readdir } from "node:fs/promises";

type ExtensionConstructor<Extension, Context> = new (context: Context) => Extension;
type ExtensionModuleFilter = (relativePath: string) => boolean;

interface ExtensionModule<Extension, Context> {
  default: ExtensionConstructor<Extension, Context>;
}

function isExtensionModule<Extension, Context>(value: unknown): value is ExtensionModule<Extension, Context> {
  return typeof value === "object" && value !== null && typeof Reflect.get(value, "default") === "function";
}

async function loadExtensionModules<Extension, Context>(
  directory: URL,
  context: Context,
  include: ExtensionModuleFilter = () => true
): Promise<readonly { extension: Extension; source: string }[]> {
  const files = await readdir(directory, { recursive: true, encoding: "utf-8" });
  const extension = import.meta.filename.endsWith(".ts") ? ".ts" : ".js";
  const modules: { extension: Extension; source: string }[] = [];

  for (const file of files.filter((name) => name.endsWith(extension) && include(name))) {
    const source = new URL(file, directory).href;
    try {
      const imported: unknown = await import(source);
      if (!isExtensionModule<Extension, Context>(imported)) {
        throw new HypixelDiscordChatBridgeError(`Invalid extension module: ${source}. A default class export is required.`);
      }
      modules.push({ extension: new imported.default(context), source });
    } catch (error: unknown) {
      if (error instanceof HypixelDiscordChatBridgeError) throw error;
      const message = error instanceof Error ? error.message : String(error);
      throw new HypixelDiscordChatBridgeError(`Failed to load extension module ${source}: ${message}`);
    }
  }

  return modules;
}

export type { ExtensionModuleFilter };
export default loadExtensionModules;
