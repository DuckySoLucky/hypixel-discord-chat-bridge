import type Application from "../Application.js";
import type HypixelDiscordChatBridgeError from "../private/error.js";
import type { CommonDevs } from "../private/constants.js";
import type { DiscordManagerWithClient } from "./discord.js";
import type { DiscordjsError } from "discord.js";
import type { HypixelAPIRebornError } from "hypixel-api-reborn";
import type { MinecraftManagerWithBot } from "./minecraft.js";
import type { MinecraftRequestTimeoutError } from "../minecraft/MinecraftRequestBroker.js";

export type ApplicationWithClient = Application & { discord: DiscordManagerWithClient };
export type ApplicationWithBot = Application & { minecraft: MinecraftManagerWithBot };
export type ApplicationWithClientBot = Application & { discord: DiscordManagerWithClient; minecraft: MinecraftManagerWithBot };

export type DevName = keyof typeof CommonDevs;
export const DevTypes = ["Maintainer", "Contributor"] as const;
export type DevType = (typeof DevTypes)[number];

export interface DevDiscordData {
  username: string;
  id: string;
}

export interface BasicDevData {
  displayName: string;
  githubUsername: string;
  avatarURL?: string;
  discord?: DevDiscordData;
}

export interface MaintainerDevData extends BasicDevData {
  type: "Maintainer";
  avatarURL: string;
  discord: DevDiscordData;
}

export interface ContributorDevData extends BasicDevData {
  type: "Contributor";
}

export type DevData = MaintainerDevData | ContributorDevData;

export interface CreditData {
  name: string;
  description: string;
  link: string;
}

export type ValidErrors = Error | DiscordjsError | HypixelDiscordChatBridgeError | HypixelAPIRebornError | MinecraftRequestTimeoutError;
