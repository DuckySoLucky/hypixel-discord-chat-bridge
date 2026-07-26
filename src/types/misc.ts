import type Application from "../Application.js";
import type { ChalkInstance } from "chalk";
import type { DiscordManagerWithClient } from "./discord.js";
import type { MinecraftManagerWithBot } from "./minecraft.js";

declare global {
  export interface Console {
    discord: (message: string) => void;
    minecraft: (message: string) => void;
    scripts: (message: string) => void;
    broadcast: (message: string, location: string) => void;
    other: (message: string) => void;
  }
}

export interface LogData {
  level: string;
  background: ChalkInstance;
  color: ChalkInstance;
}

export interface LatestProfileOptions {
  garden?: boolean;
  museum?: boolean;
}

export type ApplicationWithClient = Application & { discord: DiscordManagerWithClient };
export type ApplicationWithBot = Application & { minecraft: MinecraftManagerWithBot };
export type ApplicationWithClientBot = Application & { discord: DiscordManagerWithClient; minecraft: MinecraftManagerWithBot };

export type Devs = "DuckySoLucky" | "Kathund" | "GeorgeFilos" | "Zickles";
export const DevTypes = ["maintainer", "contributor", "translater"] as const;
export type DevType = (typeof DevTypes)[number];
export interface Dev {
  username: string;
  github?: string;
  id: string;
  iconURL: string;
  type: DevType;
  lang?: string;
}

export const MiscCreditIds = ["discordJS", "minecraftProtocol", "hypixelAPI", "hypixelAPIReborn", "mowojang", "dawJaw", "soopy", "skin"] as const;
export type MiscCreditId = (typeof MiscCreditIds)[number];
