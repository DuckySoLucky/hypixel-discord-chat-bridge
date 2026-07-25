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
