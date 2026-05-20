import type Application from "../Application.js";
import type { ChalkInstance } from "chalk";
import type { DiscordManagerWithClient } from "./Discord.js";
import type { MinecraftManagerWithBot } from "./Minecraft.js";

declare global {
  export interface Console {
    discord: (message: string) => void;
    minecraft: (message: string) => void;
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

export interface MowojangData {
  username: string;
  uuid: string;
}

export interface CachedMowojangData extends MowojangData {
  lastSave: number;
}

export interface MowojangApiResponse {
  id: string;
  name: string;
}

export type ApplicationWithClient = Application & { discord: DiscordManagerWithClient };
export type ApplicationWithBot = Application & { minecraft: MinecraftManagerWithBot };
export type ApplicationWithClientBot = Application & { discord: DiscordManagerWithClient; minecraft: MinecraftManagerWithBot };

export type CommonDev = "DuckySoLucky" | "Kathund";
export interface CommonDevData {
  username: string;
  iconURL?: string;
}
