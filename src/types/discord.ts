import { Client, Guild } from "discord.js";
import type DiscordManager from "../discord/DiscordManager.js";
import type { Config } from "./config.js";
import type { MinecraftManagerWithBot } from "./minecraft.js";

declare module "discord.js" {
  export interface Client {
    config: Config;
    discordManager: DiscordManager;
  }
}

export enum CommandFlags {
  GuildMemberOnly,
  RequiresMinecraftBot,
  StaffOnly,
  AdminOnly,
  VerificationCommand,
  InactivityCommand,
  BlacklistCommand,
  VerifiedOnly
}

export enum BasicInteractionResponse {
  Public,
  Ephemeral,
  None
}

export enum ButtonResponse {
  Public = BasicInteractionResponse.Public,
  Ephemeral = BasicInteractionResponse.Ephemeral,
  None = BasicInteractionResponse.None,
  Update
}

export const GenericChannelNames = ["Guild", "Officer", "Debug"] as const;
export type GenericChannelName = (typeof GenericChannelNames)[number];
export const LoggerChannelNames = ["Logger-Guild", "Logger-Event", "Logger-Error", "Logger-Blacklist", "Logger-Scripts", "Logger-Inactivity"] as const;
export type LoggerChannelName = (typeof LoggerChannelNames)[number];
export const ChannelNames = [...GenericChannelNames, ...LoggerChannelNames];
export type ChannelName = (typeof ChannelNames)[number];

export type DiscordManagerWithClient = DiscordManager & { client: Client<true> };
export type DiscordManagerWithGuild = DiscordManagerWithClient & { guild: Guild };
export type DiscordManagerWithBot = DiscordManagerWithClient & { application: { minecraft: MinecraftManagerWithBot } };

export interface ListMembersGroup {
  name: string;
  value: string;
}

export interface ListMembers {
  online: number;
  onlineString: string;
  total: number;
  totalString: string;
  groups: ListMembersGroup[];
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

export interface AutoComplateOption {
  name: string;
  value?: string;
}

export interface Information {
  name: string;
  value: string;
  format?: boolean;
}

export enum GuildManagementAction {
  Timeout,
  NoPerms,
  NotInGuild,
  OnlineInvite,
  OfflineInvite,
  FailedInvite,
  UserMute,
  UserUnmute,
  GuildMute,
  GuildUnmute,
  MuteTooLong,
  AlreadyMuted,
  Demote,
  Promote,
  Kick
}

export type GuildManagementActionResponse = { action: GuildManagementAction; message: string | null };
