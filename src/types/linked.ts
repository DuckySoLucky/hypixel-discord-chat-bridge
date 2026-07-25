export type LinkedData = LinkedUserData[];

export interface LinkedUserData {
  discordId: string;
  uuid: string;
}

export type OldFormat = Record<string, string>;
