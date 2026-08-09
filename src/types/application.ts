import type Application from "../Application.js";
import type { DiscordManagerWithClient } from "./discord.js";
import type { MinecraftManagerWithBot } from "./minecraft.js";

export type ApplicationWithClient = Application & { discord: DiscordManagerWithClient };
export type ApplicationWithBot = Application & { minecraft: MinecraftManagerWithBot };
export type ApplicationWithClientBot = Application & { discord: DiscordManagerWithClient; minecraft: MinecraftManagerWithBot };

export type Devs = "DuckySoLucky" | "Kathund" | "GeorgeFilos" | "Zickles";
export const DevTypes = ["Maintainer", "Contributor"] as const;
export type DevType = (typeof DevTypes)[number];
export interface Dev {
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
