import { z } from "zod";
import type BlacklistUser from "../data/blacklist/BlacklistUser.ts";
import type InactiveUser from "../data/inactivity/InactiveUser.js";
import type LinkedUser from "../data/linked/LinkedUser.js";
import type { GuildMember } from "hypixel-api-reborn";

export const InactiveUserDataSchema = z.object({
  inactivityId: z.string(),
  messageId: z.string().optional(),
  discordId: z.string(),
  reason: z.string(),
  start: z.number(),
  duration: z.number()
});
export const InactivityDataSchema = z.array(InactiveUserDataSchema);

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
  "gexpcheck_bot",
  "gexpcheck_verified",
  "gexpcheck_unverified",
  "gexpcheck_inactive",
  "gexpcheck_blacklisted",
  "gexpcheck_withRequirement",
  "gexpcheck_withoutRequirement"
] as const;
export type GexpDisplay = (typeof GexpDisplays)[number];

export interface GexpCheckOptionsDisplays {
  bot: boolean;
  verified: boolean;
  unverified: boolean;
  inactive: boolean;
  blacklisted: boolean;
  withRequirement: boolean;
  withoutRequirement: boolean;
}

export interface GexpCheckOptions extends GexpCheckOptionsDisplays {
  requirement: number;
  hiddenRanks: string[];
}

export interface GexpCheckDataDisplayData {
  label: string;
  description: string;
}

export const gexpCheckData: Record<GexpDisplay, GexpCheckDataDisplayData> = {
  gexpcheck_bot: { label: "Hide Bot", description: "Hide the bot from the list" },
  gexpcheck_verified: { label: "Verified", description: "Show users who are verified" },
  gexpcheck_unverified: { label: "Unverified", description: "Show users who are not verified" },
  gexpcheck_inactive: { label: "Inactive", description: "Show users who have an inactivity" },
  gexpcheck_blacklisted: { label: "Blacklisted", description: "Show users who are blacklisted" },
  gexpcheck_withRequirement: { label: "With Requirement", description: "Show users who have the requirement" },
  gexpcheck_withoutRequirement: { label: "Without Requirement", description: "Show users who don't have the requirement" }
};

export interface ParsedGexpCheckUser {
  username: string;
  uuid: string;
  member: GuildMember;
  verified: LinkedUser | undefined;
  inactive: InactiveUser | undefined;
  blacklist: BlacklistUser | undefined;
  hasRequirement: boolean;
}
