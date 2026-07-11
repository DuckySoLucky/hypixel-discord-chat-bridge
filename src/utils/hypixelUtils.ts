import HypixelAPIReborn from "../private/HypixelAPIReborn.js";
import HypixelDiscordChatBridgeError from "../private/error.js";
import MowojangAPI from "../private/MowojangAPI.js";
import { type NetworthResult, ProfileNetworthCalculator } from "skyhelper-networth";
import { Player, type PlayerRequestOptions, PrepareSkyBlockProfileForSkyHelperNetworth, type SkyBlockProfileType, type SkyblockProfileWithMe } from "hypixel-api-reborn";
import { translate } from "../translations/TranslationsManager.js";
import type { LatestProfileOptions } from "../types/misc.js";
import type { SelectedProfileData } from "../types/minecraft.js";

export function formatUsername(username: string, gamemode: SkyBlockProfileType | null): string {
  if (gamemode === "ironman") return `♲ ${username}`;
  else if (gamemode === "bingo") return `Ⓑ ${username}`;
  else if (gamemode === "island") return `☀ ${username}`;
  return username;
}

export async function getSelectedProfile(input: string, options?: LatestProfileOptions): Promise<SelectedProfileData> {
  const profile = await MowojangAPI.getProfile(input);
  if (profile.error || !profile.data) throw new HypixelDiscordChatBridgeError(translate("api.mowojang.errors.failed.player"));
  const { UUID: uuid, username } = profile.data;
  const profiles = await HypixelAPIReborn.getSkyBlockProfiles(uuid, { garden: options?.garden ?? false, museum: options?.museum ?? false });
  if (profiles.isRaw()) throw new HypixelDiscordChatBridgeError(translate("api.hypixel.errors.failed.parse"));
  if (!profiles.selectedProfile) throw new HypixelDiscordChatBridgeError(translate("api.hypixel.errors.failed.skyblock.no.profile.selected", { uuid }));
  return { username: formatUsername(username, profiles.selectedProfile.gameMode), rawUsername: username, uuid, profile: profiles.selectedProfile, profiles };
}

export async function getNetWorthCalculator(profile: SkyblockProfileWithMe): Promise<ProfileNetworthCalculator> {
  const museum = await HypixelAPIReborn.getSkyBlockMuseum(profile.profileId, { raw: true });
  if (!museum.isRaw()) throw new HypixelDiscordChatBridgeError(translate("api.hypixel.errors.failed.parse"));
  const museumProfile = museum.data.members[profile.me.uuid];
  if (museumProfile === undefined) throw new HypixelDiscordChatBridgeError(translate("api.hypixel.errors.failed.skyblock.no.museum"));
  const profileData = PrepareSkyBlockProfileForSkyHelperNetworth(profile);
  return new ProfileNetworthCalculator(profileData, museumProfile, profile.banking.balance);
}

export async function getNetWorth(profile: SkyblockProfileWithMe): Promise<NetworthResult> {
  return await getNetWorthCalculator(profile).then((manager) => manager.getNetworth({ onlyNetworth: true }));
}

export async function getPlayer(input: string, options?: PlayerRequestOptions): Promise<Player> {
  return await HypixelAPIReborn.getPlayer(input, options).then((playerData) => {
    if (playerData.isRaw()) throw new HypixelDiscordChatBridgeError(translate("api.hypixel.errors.failed.player"));
    return playerData;
  });
}
