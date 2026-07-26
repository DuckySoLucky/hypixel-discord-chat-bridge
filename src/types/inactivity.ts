import type InactiveUser from "../data/inactivity/InactiveUser.js";
import type LinkedUser from "../data/linked/LinkedUser.js";
import type { GuildMember } from "hypixel-api-reborn";

export type InactivityData = InactiveUserData[];

export interface BasicInactiveUserData {
  inactivityId?: string;
  messageId?: string;
  discordId: string;
  reason: string;
  start?: number;
  duration: number;
}

export interface InactiveUserData extends BasicInactiveUserData {
  inactivityId: string;
  start: number;
}

export const GexpDisplays = [
  "gexpCheckAll",
  "gexpCheckUnverified",
  "gexpCheckInactive",
  "gexpCheckMembersWithRequirements",
  "gexpCheckMembersWithoutRequirements"
] as const;
export type GexpDisplay = (typeof GexpDisplays)[number];

export interface GexpCheckOptions {
  requirement: number;
  type: GexpDisplay;
  hiddenRanks: string[];
}

export interface ParsedGexpCheckUser {
  username: string;
  member: GuildMember;
  verified: LinkedUser | undefined;
  inactive: InactiveUser | undefined;
  hasRequirement: boolean;
}
