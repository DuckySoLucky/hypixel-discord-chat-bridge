import { z } from "zod";

export const LinkedUserDataSchema = z.object({ discordId: z.string(), uuid: z.string() });
export const LinkedDataSchema = z.array(LinkedUserDataSchema);

export type LinkedData = LinkedUserData[];

export interface LinkedUserData {
  discordId: string;
  uuid: string;
}

export type OldFormat = Record<string, string>;
