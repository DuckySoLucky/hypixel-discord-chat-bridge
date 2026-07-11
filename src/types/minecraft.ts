import type MinecraftManager from "../minecraft/MinecraftManager.js";
import type { Client } from "minecraft-protocol";
import type { DiscordManagerWithBot } from "./discord.js";
import type { MiningForgeItemName, SkyBlockProfile, SkyBlockProfileName, SkyblockProfileWithMe, WithSelectedProfile } from "hypixel-api-reborn";

export type MinecraftManagerWithBot = MinecraftManager & { bot: Client };
export type MinecraftManagerWithClient = MinecraftManagerWithBot & { application: { discord: DiscordManagerWithBot } };

export interface CommandDataOptionJSON {
  name: string;
  description: string;
  required: boolean;
}

export interface CommandDataJSON {
  name: string;
  description: string;
  aliases: string[];
  options: CommandDataOptionJSON[];
}

export interface ParsedForgeSlot {
  item: MiningForgeItemName | "UNKNOWN";
  slot: number;
  finished: boolean;
  timeLeft: string;
}

export interface FloorData {
  id: string;
  timesPlayed: number;
  fastestTimeS: number;
  fastestTimeSPlus: number;
}

export interface SelectedProfileData {
  username: string;
  rawUsername: string;
  uuid: string;
  profile: SkyblockProfileWithMe;
  profiles: WithSelectedProfile<Map<SkyBlockProfileName | "UNKNOWN", SkyBlockProfile>>;
}

export const BedWarsModeNames = ["overall", "solo", "doubles", "threes", "fours", "4v4"] as const;
export type BedWarsModeName = (typeof BedWarsModeNames)[number];
export type BedWarsInternalName = "eightOne" | "eightTwo" | "fourThree" | "fourFour" | "twoFour";

export function isBedWarsModeName(value: string): value is BedWarsModeName {
  return (BedWarsModeNames as readonly string[]).includes(value);
}

export const DuelsInternalNames = [
  "uhc",
  "skywars",
  "megawalls",
  "blitz",
  "op",
  "classic",
  "bow",
  "noDebuff",
  "combo",
  "bowSpleef",
  "sumo",
  "bridge",
  "parkour",
  "arena",
  "boxing",
  "bedwars",
  "bedwarsRush"
] as const;
export type DuelsInternalName = (typeof DuelsInternalNames)[number];
export const DuelsModeMap: Record<DuelsInternalName, string[]> = {
  uhc: ["uhc", "u"],
  skywars: ["skywars", "sw"],
  megawalls: ["megawalls", "mw", "m"],
  blitz: ["blitz"],
  op: ["op"],
  classic: ["classic", "class", "c"],
  bow: ["bow"],
  noDebuff: ["nodebuff", "ndb"],
  combo: ["combo"],
  bowSpleef: ["bowspleef", "bs"],
  sumo: ["sumo", "s"],
  bridge: ["bridge", "b"],
  parkour: ["parkour", "p"],
  arena: ["arena", "a"],
  boxing: ["boxing"],
  bedwars: ["bedwars", "bw"],
  bedwarsRush: ["bedwarsRush", "bwr"]
};

export const DuelsModeNames = Object.values(DuelsModeMap)
  .flat()
  .filter((v, i, arr) => arr.indexOf(v) === i) as string[];
export type DuelsModeName = (typeof DuelsModeNames)[number];
export type DuelsModSearch = DuelsModeName | "overall";
export const DuelsModeAliastoInternalMap = Object.entries(DuelsModeMap).reduce(
  (acc, [internal, aliases]) => {
    for (const alias of aliases) {
      acc[alias] = internal as DuelsInternalName;
    }
    return acc;
  },
  {} as Record<string, DuelsInternalName>
);

export interface ParsedDuelsStats {
  title: string | null;
  kills: number;
  KDR: number;
  wins: number;
  WLR: number;
  winStreak: number;
  bestWinStreak: number;
}

export enum ResourcePackResult {
  SuccessfullyLoaded = 0,
  Declined = 1,
  FailedDownload = 2,
  Accepted = 3
}
