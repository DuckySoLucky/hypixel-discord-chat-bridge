import { Client, Collection, Guild } from "discord.js";
import type Command from "../Discord/Private/Commands/Command.js";
import type DiscordManager from "../Discord/DiscordManager.js";
import type { MinecraftManagerWithBot } from "./Minecraft.js";

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, Command>;
  }
}

export enum CommandFlags {
  RequiresMinecraftBot,
  VerificationCommand
}

export enum CommandType {
  Global,
  Guild,
  Staff
}

export enum CommandResponse {
  Public,
  Ephemeral
}

export enum ButtonResponse {
  Public,
  Ephemeral,
  Update
}

export type ChannelNames = "Guild" | "Officer" | "Logger" | "Debug";
export type DiscordManagerWithClient = DiscordManager & { client: Client };
export type DiscordManagerWithGuild = DiscordManagerWithClient & { guild: Guild };
export type DiscordManagerWithBot = DiscordManagerWithClient & { app: { minecraft: MinecraftManagerWithBot } };

export interface OnlineMembersGroup {
  name: string;
  value: string;
}

export interface OnlineMembers {
  online: number;
  onlineString: string;
  total: number;
  totalString: string;
  groups: OnlineMembersGroup[];
}

export interface Requirement {
  key: string;
  required: number;
  has: string | number;
  passed: boolean;
}

export interface Requirements {
  username: string;
  uuid: string;
  guildName: string;
  passed: boolean;
  requirementsPassed: number;
  requirements: Requirement[];
}
