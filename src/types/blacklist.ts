import { z } from "zod";
import type { User } from "discord.js";

export const BlacklistedUserDataSchema = z.object({
  blacklistId: z.string(),
  messageId: z.string().optional(),
  discordId: z.string().nullable(),
  uuid: z.string().nullable(),
  reason: z.string(),
  timestamp: z.number(),
  by: z.string()
});
export const BlacklistDataSchema = z.array(BlacklistedUserDataSchema);

export type BlacklistData = BlacklistedUserData[];

export interface BasicBlacklistedUserData {
  blacklistId?: string;
  messageId?: string;
  discordId: string | null;
  uuid: string | null;
  reason: string;
  timestamp?: number;
  by: string;
}

export interface BlacklistedUserData extends BasicBlacklistedUserData {
  blacklistId: string;
  timestamp: number;
}

export interface BlacklistSaveOptions {
  alertUser: boolean;
  shareUser: boolean;
  user: User;
}

export interface BlacklistDeleteOptions extends BlacklistSaveOptions {
  reason: string;
}
