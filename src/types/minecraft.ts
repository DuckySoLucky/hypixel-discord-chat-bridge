import type MinecraftManager from "../minecraft/MinecraftManager.js";
import type RawRequestData from "hypixel-api-reborn/dist/Private/RawRequestData.js";
import type { Client } from "minecraft-protocol";
import type { DiscordManagerWithBot } from "./discord.js";
import type { SkyBlockProfile, SkyBlockProfileName, SkyblockProfileWithMe, WithSelectedProfile } from "hypixel-api-reborn";

export type MinecraftManagerWithBot = MinecraftManager & { bot: Client };
export type MinecraftManagerWithClient = MinecraftManagerWithBot & { application: { discord: DiscordManagerWithBot } };
export type MinecraftManagerWithPlugin<Plugin> = MinecraftManager & { plugin: Plugin };

export type MinecraftChatChannel = "guild" | "officer";

export interface MinecraftCommandContext {
  readonly player: string;
  readonly rawMessage: string;
  readonly args: readonly string[];
  readonly channel: MinecraftChatChannel;
  readonly signal: AbortSignal;
  reply(message: string): Promise<void>;
}

export interface CommandDataOptionJSON {
  name: string;
  description: string | null;
  required: boolean;
}

export interface CommandDataJSON {
  name: string;
  description: string | null;
  aliases: string[];
  options: CommandDataOptionJSON[];
}

export interface ParsedForgeSlot {
  item: string;
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
  raw: RawRequestData<any>;
}

export const BedWarsModeNames = ["overall", "solo", "doubles", "threes", "fours", "4v4"] as const;
export type BedWarsModeName = (typeof BedWarsModeNames)[number];
export type BedWarsInternalName = "eightOne" | "eightTwo" | "fourThree" | "fourFour" | "twoFour";

export function isBedWarsModeName(value: string): value is BedWarsModeName {
  return (BedWarsModeNames as readonly string[]).includes(value);
}

export const DuelsInternalNames = [
  "uhc",
  "skyWars",
  "megaWalls",
  "blitz",
  "op",
  "classic",
  "bow",
  "potion",
  "combo",
  "bowspleef",
  "sumo",
  "bridge",
  "parkour",
  "arena",
  "boxing",
  "bedWars"
] as const;
export type DuelsInternalName = (typeof DuelsInternalNames)[number];
export const DuelsModeMap: Record<DuelsInternalName, string[]> = {
  uhc: ["uhc", "u"],
  skyWars: ["skywars", "sw"],
  megaWalls: ["megawalls", "mw", "m"],
  blitz: ["blitz"],
  op: ["op"],
  classic: ["classic", "class", "c"],
  bow: ["bow"],
  potion: ["nodebuff", "ndb"],
  combo: ["combo"],
  bowspleef: ["bowspleef", "bs"],
  sumo: ["sumo", "s"],
  bridge: ["bridge", "b"],
  parkour: ["parkour", "p"],
  arena: ["arena", "a"],
  boxing: ["boxing"],
  bedWars: ["bedwars", "bw"]
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

export enum ResourcePackResult {
  SuccessfullyLoaded = 0,
  Declined = 1,
  FailedDownload = 2,
  Accepted = 3
}

export interface LatestProfileOptions {
  garden?: boolean;
  museum?: boolean;
}

export interface CachedDiscordMessageData {
  message: string;
  username: string;
  rawMessage: string;
}
