import HypixelDiscordChatBridgeError from "../private/error.js";
import MowojangAPI from "../private/MowojangAPI.js";
import config from "../../config.json" with { type: "json" };
import {
  Client,
  type Guild,
  type GuildFetchOption,
  type Player,
  type PlayerRequestOptions,
  type RequestOptions,
  type SkyBlockElectionData,
  type SkyBlockProfileType,
  type SkyblockProfileWithMe
} from "hypixel-api-reborn";
import { type NetworthResult, ProfileNetworthCalculator } from "skyhelper-networth";
import type { LatestProfileOptions, SelectedProfileData } from "../types/minecraft.js";

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
  const { parsed: profiles } = await HypixelAPIReborn.getSkyBlockProfiles(uuid, { garden: options?.garden ?? false, museum: options?.museum ?? false });
  if (!profiles.selectedProfile) throw new HypixelDiscordChatBridgeError(`${uuid} has no selected SkyBlock profile.`);
  return { username: formatUsername(username, profiles.selectedProfile.gameMode), rawUsername: username, uuid, profile: profiles.selectedProfile, profiles };
}

export async function getNetWorthCalculator(profile: SkyblockProfileWithMe): Promise<ProfileNetworthCalculator> {
  const museum = await HypixelAPIReborn.getSkyBlockMuseum(profile.profileId);
  const museumProfile = museum.raw.rawData.members[profile.me.uuid];
  if (museumProfile === undefined) throw new HypixelDiscordChatBridgeError("Player has museum API off.");
  return new ProfileNetworthCalculator(profile, museumProfile, profile.banking.balance);
}

export async function getNetWorth(profile: SkyblockProfileWithMe): Promise<NetworthResult> {
  return await getNetWorthCalculator(profile).then((manager) => manager.getNetworth({ onlyNetworth: true }));
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
