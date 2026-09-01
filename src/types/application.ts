import type Application from "../Application.js";
import type HypixelDiscordChatBridgeError from "../private/error.js";
import type { DiscordManagerWithClient } from "./discord.js";
import type { DiscordjsError } from "discord.js";
import type { HypixelAPIRebornError } from "hypixel-api-reborn";
import type { MinecraftManagerWithBot } from "./minecraft.js";
import type { MinecraftRequestTimeoutError } from "../minecraft/MinecraftRequestBroker.ts";

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

export type ValidErrors = Error | DiscordjsError | HypixelDiscordChatBridgeError | HypixelAPIRebornError | MinecraftRequestTimeoutError;
