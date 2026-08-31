import HypixelDiscordChatBridgeError from "../private/error.js";
import MowojangAPI from "../private/MowojangAPI.js";
import {
  Client,
  type Guild,
  type GuildFetchOption,
  type Player,
  type PlayerRequestOptions,
  type RequestOptions,
  type SkyBlockElectionData,
  SkyBlockMuseum,
  type SkyBlockProfileType
} from "hypixel-api-reborn";
import { readFileSync } from "node:fs";
import type RequestData from "hypixel-api-reborn/dist/Private/RequestData.js";
import type { LatestProfileOptions, SelectedProfileData } from "../types/minecraft.js";

const config = JSON.parse(readFileSync("config.json", "utf-8"));
const HypixelAPIReborn = new Client(config.API.hypixel.key, { cache: true, mowojang: MowojangAPI });
HypixelAPIReborn.requestHandler.setBaseURL(config.API.hypixel.baseURL || undefined);

export function formatUsername(username: string, gamemode: SkyBlockProfileType | null): string {
  if (gamemode === "ironman") return `♲ ${username}`;
  else if (gamemode === "bingo") return `Ⓑ ${username}`;
  else if (gamemode === "island") return `☀ ${username}`;
  return username;
}

export async function getSelectedProfile(input: string, options?: LatestProfileOptions): Promise<SelectedProfileData> {
  const profile = await MowojangAPI.getProfile(input);
  if (profile.error || !profile.data) throw new HypixelDiscordChatBridgeError("Player does not exist");
  const { UUID: uuid, username } = profile.data;
  const { parsed: profiles, raw } = await HypixelAPIReborn.getSkyBlockProfiles(uuid, { garden: options?.garden ?? false, museum: options?.museum ?? false });
  if (!profiles.selectedProfile) throw new HypixelDiscordChatBridgeError(`${uuid} has no selected SkyBlock profile.`);
  return { username: formatUsername(username, profiles.selectedProfile.gameMode), rawUsername: username, uuid, profile: profiles.selectedProfile, profiles, raw };
}

export async function getSkyBlockMuseum(profileId: string, options?: RequestOptions): Promise<RequestData<SkyBlockMuseum>> {
  return await HypixelAPIReborn.getSkyBlockMuseum(profileId, options);
}

export async function getPlayer(input: string, options?: PlayerRequestOptions): Promise<Player> {
  return await HypixelAPIReborn.getPlayer(input, options).then((playerData) => {
    return playerData.parsed;
  });
}

export async function getGuild(searchParameter: GuildFetchOption, query: string, options?: RequestOptions): Promise<Guild | null> {
  return await HypixelAPIReborn.getGuild(searchParameter, query, options).then((data) => {
    return data.parsed;
  });
}

export async function getSkyBlockElection(options?: RequestOptions): Promise<SkyBlockElectionData> {
  return await HypixelAPIReborn.getSkyBlockElection(options).then((data) => {
    return data.parsed;
  });
}
