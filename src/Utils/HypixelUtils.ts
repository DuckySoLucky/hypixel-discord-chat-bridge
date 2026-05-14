import HypixelAPIReborn from "../Private/HypixelAPIReborn.js";
import { PrepareSkyBlockProfileForSkyHelperNetworth, type SkyblockProfileWithMe } from "hypixel-api-reborn";
import { ProfileNetworthCalculator } from "skyhelper-networth";
import type { LatestProfileOptions } from "../Types/Misc.js";

export async function getSelectedProfile(username: string, options?: LatestProfileOptions): Promise<SkyblockProfileWithMe> {
  const profiles = await HypixelAPIReborn.getSkyBlockProfiles(username, { garden: options?.garden ?? false, museum: options?.garden ?? false });
  if (profiles.isRaw()) throw new Error("Something went wrong while parsing the data from the hypixel API and it ended up raw.");
  if (!profiles.selectedProfile) throw new Error(`${username} has no selected SkyBlock profile.`);
  return profiles.selectedProfile;
}

export async function getNetworthCalculator(profile: SkyblockProfileWithMe): Promise<ProfileNetworthCalculator> {
  const museum = await HypixelAPIReborn.getSkyBlockMuseum(profile.profileId, { raw: true });
  if (!museum.isRaw()) throw new Error("Something went wrong while parsing the data from the hypixel API and it ended up parsed.");
  const museumProfile = museum.data.members[profile.me.uuid];
  if (museumProfile === undefined) throw new Error("Player has museum API off.");
  const profileData = PrepareSkyBlockProfileForSkyHelperNetworth(profile);
  return new ProfileNetworthCalculator(profileData, museumProfile, profile.banking.balance);
}
