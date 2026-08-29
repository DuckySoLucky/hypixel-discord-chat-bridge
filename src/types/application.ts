import type Application from "../Application.js";
import type { DiscordManagerWithClient } from "./discord.js";
import type { MinecraftManagerWithBot } from "./minecraft.js";

export type ApplicationWithClient = Application & { discord: DiscordManagerWithClient };
export type ApplicationWithBot = Application & { minecraft: MinecraftManagerWithBot };
export type ApplicationWithClientBot = Application & { discord: DiscordManagerWithClient; minecraft: MinecraftManagerWithBot };

export const DevNames = ["DuckySoLucky", "Kathund", "GeorgeFilos", "Zickles"] as const;
export type DevName = (typeof DevNames)[number];
export const DevTypes = ["Maintainer", "Contributor"] as const;
export type DevType = (typeof DevTypes)[number];
export interface DevData {
  username: string;
  github?: string;
  id: string;
  iconURL: string;
  type: DevType;
}

export interface CreditData {
  name: string;
  description: string;
  link: string;
}
