const { getLatestProfile } = require("../../API/functions/getLatestProfile.js");
const { getChocolateFactory } = require("../../API/stats/chocolateFactory.js");
const { getCrimsonIsle, getKuudra } = require("../../API/stats/crimson.js");
const { getSkillAverage } = require("../../API/constants/skills.js");
const { ProfileNetworthCalculator } = require("skyhelper-networth");
const HypixelDiscordChatBridgeError = require("./errorHandler.js");
const { getDungeons } = require("../../API/stats/dungeons.js");
const hypixelRebornAPI = require("./API/HypixelRebornAPI.js");
const { getEssence } = require("../../API/stats/essence.js");
const { getSlayer } = require("../../API/stats/slayer.js");
const { getSkills } = require("../../API/stats/skills.js");
const { getJacob } = require("../../API/stats/jacob.js");

/**
 * Get a Networth Calculator
 * @param {import("../../types/profiles.js").Member} profile
 * @param {object} museum
 * @param {number} bank
 * @returns {{
 *   getNetworth: () => Promise<any>
 * } | ProfileNetworthCalculator}
 */
function getNetworthCalculator(profile, museum, bank) {
  try {
    return new ProfileNetworthCalculator(profile, museum, bank);
  } catch {
    return {
      getNetworth: async () => ({})
    };
  }
}

/**
 * Get a big stat list object to be used as variables
 * @param {string} uuid
 * @param {import("hypixel-api-reborn").Guild | null} hypixelGuild
 * @param {import("hypixel-api-reborn").Player | null} player
 * @param {import("../../types/profiles.js").LatestProfile | null} skyblock
 * @returns {Promise<Record<string, string | number>>}
 */
async function getPlayerVariableStats(uuid, hypixelGuild = null, player = null, skyblock = null) {
  const fetches = [];

  if (!hypixelGuild) fetches.push(hypixelRebornAPI.getGuild("player", bot.username, { noCaching: true, noCacheCheck: true }).then((g) => (hypixelGuild = g)));
  if (!player) fetches.push(hypixelRebornAPI.getPlayer(uuid).then((p) => (player = p)));

  if (!skyblock) {
    fetches.push(
      getLatestProfile(uuid, { museum: true })
        .catch(() => ({ profile: null, profileData: null }))
        // @ts-ignore
        .then((s) => (skyblock = s))
    );
  }

  await Promise.all(fetches);

  if (!hypixelGuild) {
    throw new HypixelDiscordChatBridgeError("Guild not found.");
  }

  if (hypixelGuild === undefined) {
    throw new HypixelDiscordChatBridgeError("Guild not found.");
  }

  // @ts-ignore
  const profile = /** @type {import("../../types/profiles.js").Member} */ (skyblock.profile ?? {});
  // @ts-ignore
  const profileData = /** @type {import("../../types/profiles.js").Profile} */ (skyblock.profileData ?? {});
  // @ts-ignore
  const museum = skyblock.museum ?? null;
  const bank = profileData?.banking?.balance ?? 0;
  // @ts-ignore
  const networthManager = getNetworthCalculator(profile, museum, bank);
  const [skills, slayer, dungeons, crimson, networth, chocolateFactory, jacob, essence, kuudra] = await Promise.all([
    getSkills(profile, profileData),
    getSlayer(profile),
    getDungeons(profile),
    getCrimsonIsle(profile),
    networthManager.getNetworth({ onlyNetworth: true }),
    getChocolateFactory(profile),
    getJacob(profile),
    getEssence(profile),
    getKuudra(profile)
  ]);

  const guildMember = hypixelGuild.members.find((m) => m.uuid === uuid);

  return {
    username: player?.nickname ?? "",
    level: player?.level ?? 0,
    karma: player?.karma ?? 0,
    achievementPoints: player?.achievementPoints ?? 0,
    guildRank: guildMember?.rank ?? "",
    guildName: hypixelGuild.name,

    bedwarsStar: player?.stats?.bedwars?.level ?? 0,
    bedwarsTokens: player?.stats?.bedwars?.coins ?? 0,
    bedwarsKills: player?.stats?.bedwars?.kills ?? 0,
    bedwarsDeaths: player?.stats?.bedwars?.deaths ?? 0,
    bedwarsKDRatio: player?.stats?.bedwars?.KDRatio ?? 0,
    bedwarsFinalKills: player?.stats?.bedwars?.finalKills ?? 0,
    bedwarsFinalDeathss: player?.stats?.bedwars?.finalDeaths ?? 0,
    bedwarsFinalKDRatio: player?.stats?.bedwars?.finalKDRatio ?? 0,
    bedwarsWins: player?.stats?.bedwars?.wins ?? 0,
    bedwarsLosses: player?.stats?.bedwars?.losses ?? 0,
    bedwarsWLRatio: player?.stats?.bedwars?.WLRatio ?? 0,
    bedwarsBedsBroken: player?.stats?.bedwars?.beds.broken ?? 0,
    bedwarsBedsLost: player?.stats?.bedwars?.beds.lost ?? 0,
    bedwarsBedsBLRatio: player?.stats?.bedwars?.beds.BLRatio ?? 0,
    bedwarsPlayedGames: player?.stats?.bedwars?.playedGames ?? 0,

    bedwarsSoloKills: player?.stats?.bedwars?.solo?.kills ?? 0,
    bedwarsSoloDeaths: player?.stats?.bedwars?.solo?.deaths ?? 0,
    bedwarsSoloKDRatio: player?.stats?.bedwars?.solo?.KDRatio ?? 0,
    bedwarsSoloFinalKills: player?.stats?.bedwars?.solo?.finalKills ?? 0,
    bedwarsSoloFinalDeathss: player?.stats?.bedwars?.solo?.finalDeaths ?? 0,
    bedwarsSoloFinalKDRatio: player?.stats?.bedwars?.solo?.finalKDRatio ?? 0,
    bedwarsSoloWins: player?.stats?.bedwars?.solo?.wins ?? 0,
    bedwarsSoloLosses: player?.stats?.bedwars?.solo?.losses ?? 0,
    bedwarsSoloWLRatio: player?.stats?.bedwars?.solo?.WLRatio ?? 0,
    bedwarsSoloBedsBroken: player?.stats?.bedwars?.solo?.beds.broken ?? 0,
    bedwarsSoloBedsLost: player?.stats?.bedwars?.solo?.beds.lost ?? 0,
    bedwarsSoloBedsBLRatio: player?.stats?.bedwars?.solo?.beds.BLRatio ?? 0,
    bedwarsSoloPlayedGames: player?.stats?.bedwars?.solo?.playedGames ?? 0,

    bedwarsDoublesKills: player?.stats?.bedwars?.doubles?.kills ?? 0,
    bedwarsDoublesDeaths: player?.stats?.bedwars?.doubles?.deaths ?? 0,
    bedwarsDoublesKDRatio: player?.stats?.bedwars?.doubles?.KDRatio ?? 0,
    bedwarsDoublesFinalKills: player?.stats?.bedwars?.doubles?.finalKills ?? 0,
    bedwarsDoublesFinalDeathss: player?.stats?.bedwars?.doubles?.finalDeaths ?? 0,
    bedwarsDoublesFinalKDRatio: player?.stats?.bedwars?.doubles?.finalKDRatio ?? 0,
    bedwarsDoublesWins: player?.stats?.bedwars?.doubles?.wins ?? 0,
    bedwarsDoublesLosses: player?.stats?.bedwars?.doubles?.losses ?? 0,
    bedwarsDoublesWLRatio: player?.stats?.bedwars?.doubles?.WLRatio ?? 0,
    bedwarsDoublesBedsBroken: player?.stats?.bedwars?.doubles?.beds.broken ?? 0,
    bedwarsDoublesBedsLost: player?.stats?.bedwars?.doubles?.beds.lost ?? 0,
    bedwarsDoublesBedsBLRatio: player?.stats?.bedwars?.doubles?.beds.BLRatio ?? 0,
    bedwarsDoublesPlayedGames: player?.stats?.bedwars?.doubles?.playedGames ?? 0,

    bedwarsThreesKills: player?.stats?.bedwars?.threes?.kills ?? 0,
    bedwarsThreesDeaths: player?.stats?.bedwars?.threes?.deaths ?? 0,
    bedwarsThreesKDRatio: player?.stats?.bedwars?.threes?.KDRatio ?? 0,
    bedwarsThreesFinalKills: player?.stats?.bedwars?.threes?.finalKills ?? 0,
    bedwarsThreesFinalDeathss: player?.stats?.bedwars?.threes?.finalDeaths ?? 0,
    bedwarsThreesFinalKDRatio: player?.stats?.bedwars?.threes?.finalKDRatio ?? 0,
    bedwarsThreesWins: player?.stats?.bedwars?.threes?.wins ?? 0,
    bedwarsThreesLosses: player?.stats?.bedwars?.threes?.losses ?? 0,
    bedwarsThreesWLRatio: player?.stats?.bedwars?.threes?.WLRatio ?? 0,
    bedwarsThreesBedsBroken: player?.stats?.bedwars?.threes?.beds.broken ?? 0,
    bedwarsThreesBedsLost: player?.stats?.bedwars?.threes?.beds.lost ?? 0,
    bedwarsThreesBedsBLRatio: player?.stats?.bedwars?.threes?.beds.BLRatio ?? 0,
    bedwarsThreesPlayedGames: player?.stats?.bedwars?.threes?.playedGames ?? 0,

    bedwarsFoursKills: player?.stats?.bedwars?.fours?.kills ?? 0,
    bedwarsFoursDeaths: player?.stats?.bedwars?.fours?.deaths ?? 0,
    bedwarsFoursKDRatio: player?.stats?.bedwars?.fours?.KDRatio ?? 0,
    bedwarsFoursFinalKills: player?.stats?.bedwars?.fours?.finalKills ?? 0,
    bedwarsFoursFinalDeathss: player?.stats?.bedwars?.fours?.finalDeaths ?? 0,
    bedwarsFoursFinalKDRatio: player?.stats?.bedwars?.fours?.finalKDRatio ?? 0,
    bedwarsFoursWins: player?.stats?.bedwars?.fours?.wins ?? 0,
    bedwarsFoursLosses: player?.stats?.bedwars?.fours?.losses ?? 0,
    bedwarsFoursWLRatio: player?.stats?.bedwars?.fours?.WLRatio ?? 0,
    bedwarsFoursBedsBroken: player?.stats?.bedwars?.fours?.beds.broken ?? 0,
    bedwarsFoursBedsLost: player?.stats?.bedwars?.fours?.beds.lost ?? 0,
    bedwarsFoursBedsBLRatio: player?.stats?.bedwars?.fours?.beds.BLRatio ?? 0,
    bedwarsFoursPlayedGames: player?.stats?.bedwars?.fours?.playedGames ?? 0,

    bedwars4v4Kills: player?.stats?.bedwars?.["4v4"]?.kills ?? 0,
    bedwars4v4Deaths: player?.stats?.bedwars?.["4v4"]?.deaths ?? 0,
    bedwars4v4KDRatio: player?.stats?.bedwars?.["4v4"]?.KDRatio ?? 0,
    bedwars4v4FinalKills: player?.stats?.bedwars?.["4v4"]?.finalKills ?? 0,
    bedwars4v4FinalDeathss: player?.stats?.bedwars?.["4v4"]?.finalDeaths ?? 0,
    bedwars4v4FinalKDRatio: player?.stats?.bedwars?.["4v4"]?.finalKDRatio ?? 0,
    bedwars4v4Wins: player?.stats?.bedwars?.["4v4"]?.wins ?? 0,
    bedwars4v4Losses: player?.stats?.bedwars?.["4v4"]?.losses ?? 0,
    bedwars4v4WLRatio: player?.stats?.bedwars?.["4v4"]?.WLRatio ?? 0,
    bedwars4v4BedsBroken: player?.stats?.bedwars?.["4v4"]?.beds.broken ?? 0,
    bedwars4v4BedsLost: player?.stats?.bedwars?.["4v4"]?.beds.lost ?? 0,
    bedwars4v4BedsBLRatio: player?.stats?.bedwars?.["4v4"]?.beds.BLRatio ?? 0,
    bedwars4v4PlayedGames: player?.stats?.bedwars?.["4v4"]?.playedGames ?? 0,

    skywarsStar: player?.stats?.skywars?.level ?? 0,
    skywarsCoins: player?.stats?.skywars?.coins ?? 0,
    skywarsTokens: player?.stats?.skywars?.tokens ?? 0,
    skywarsSouls: player?.stats?.skywars?.souls ?? 0,
    skywarsOpals: player?.stats?.skywars?.opals ?? 0,
    skywarsKills: player?.stats?.skywars?.kills ?? 0,
    skywarsDeaths: player?.stats?.skywars?.deaths ?? 0,
    skywarsKDRatio: player?.stats?.skywars?.KDRatio ?? 0,
    skywarsWins: player?.stats?.skywars?.wins ?? 0,
    skywarsLosses: player?.stats?.skywars?.losses ?? 0,
    skywarsWLRatio: player?.stats?.skywars?.WLRatio ?? 0,
    skywarsPlayedGames: player?.stats?.skywars?.playedGames ?? 0,

    duelsDivision: player?.stats?.duels?.division ?? "Unknown",
    duelsKills: player?.stats?.duels?.kills ?? 0,
    duelsDeaths: player?.stats?.duels?.deaths ?? 0,
    duelsKDRatio: player?.stats?.duels?.KDRatio ?? 0,
    duelsWins: player?.stats?.duels?.wins ?? 0,
    duelsLosses: player?.stats?.duels?.losses ?? 0,
    duelsWLRatio: player?.stats?.duels?.WLRatio ?? 0,
    duelsPlayedGames: player?.stats?.duels?.playedGames ?? 0,

    skyblockBank: networth?.bank ?? 0,
    skyblockPurse: networth?.purse ?? 0,
    skyblockLevel: Math.floor((profile?.leveling?.experience ?? 0) / 100),

    skyblockSkillsAverageLevel: getSkillAverage(profile, null),
    skyblockSkillsFarmingLevel: skills?.farming?.level ?? 0,
    skyblockSkillsMiningLevel: skills?.mining?.level ?? 0,
    skyblockSkillsCombatLevel: skills?.combat?.level ?? 0,
    skyblockSkillsForagingLevel: skills?.foraging?.level ?? 0,
    skyblockSkillsFishingLevel: skills?.fishing?.level ?? 0,
    skyblockSkillsEnchantingLevel: skills?.enchanting?.level ?? 0,
    skyblockSkillsAlchemyLevel: skills?.alchemy?.level ?? 0,
    skyblockSkillsCarpentryLevel: skills?.carpentry?.level ?? 0,
    skyblockSkillsRunecraftingLevel: skills?.runecrafting?.level ?? 0,
    skyblockSkillsSocialLevel: skills?.social?.level ?? 0,
    skyblockSkillsTamingLevel: skills?.taming?.level ?? 0,

    skyblockSkillsFarmingXp: skills?.farming?.xp ?? 0,
    skyblockSkillsMiningXp: skills?.mining?.xp ?? 0,
    skyblockSkillsCombatXp: skills?.combat?.xp ?? 0,
    skyblockSkillsForagingXp: skills?.foraging?.xp ?? 0,
    skyblockSkillsFishingXp: skills?.fishing?.xp ?? 0,
    skyblockSkillsEnchantingXp: skills?.enchanting?.xp ?? 0,
    skyblockSkillsAlchemyXp: skills?.alchemy?.xp ?? 0,
    skyblockSkillsCarpentryXp: skills?.carpentry?.xp ?? 0,
    skyblockSkillsRunecraftingXp: skills?.runecrafting?.xp ?? 0,
    skyblockSkillsSocialXp: skills?.social?.xp ?? 0,
    skyblockSkillsTamingXp: skills?.taming?.xp ?? 0,

    skyblockSlayerZombieLevel: slayer?.zombie?.level ?? 0,
    skyblockSlayerSpiderLevel: slayer?.spider?.level ?? 0,
    skyblockSlayerWolfLevel: slayer?.wolf?.level ?? 0,
    skyblockSlayerEndermanLevel: slayer?.enderman?.level ?? 0,
    skyblockSlayerBlazeLevel: slayer?.blaze?.level ?? 0,
    skyblockSlayerVampireLevel: slayer?.vampire?.level ?? 0,

    skyblockSlayerZombieXp: slayer?.zombie?.xp ?? 0,
    skyblockSlayerSpiderXp: slayer?.spider?.xp ?? 0,
    skyblockSlayerWolfXp: slayer?.wolf?.xp ?? 0,
    skyblockSlayerEndermanXp: slayer?.enderman?.xp ?? 0,
    skyblockSlayerBlazeXp: slayer?.blaze?.xp ?? 0,
    skyblockSlayerVampireXp: slayer?.vampire?.xp ?? 0,

    skyblockDungeonsSecrets: dungeons?.secretsFound ?? 0,
    skyblockDungeonsXp: dungeons?.dungeons.xp ?? 0,
    skyblockDungeonsLevel: dungeons?.dungeons?.level ?? 0,

    skyblockDungeonsClassAverageLevel: dungeons?.classAverage ?? 0,
    skyblockDungeonsClassHealerLevel: dungeons?.classes?.healer?.level ?? 0,
    skyblockDungeonsClassMageLevel: dungeons?.classes?.mage?.level ?? 0,
    skyblockDungeonsClassBerserkLevel: dungeons?.classes?.berserk?.level ?? 0,
    skyblockDungeonsClassArcherLevel: dungeons?.classes?.archer?.level ?? 0,
    skyblockDungeonsClassTankLevel: dungeons?.classes?.tank?.level ?? 0,

    skyblockDungeonsClassHealerXp: dungeons?.classes?.healer?.xp ?? 0,
    skyblockDungeonsClassMageXp: dungeons?.classes?.mage?.xp ?? 0,
    skyblockDungeonsClassBerserkXp: dungeons?.classes?.berserk?.xp ?? 0,
    skyblockDungeonsClassArcherXp: dungeons?.classes?.archer?.xp ?? 0,
    skyblockDungeonsClassTankXp: dungeons?.classes?.tank?.xp ?? 0,

    skyblockDungeonsEssenceDiamond: essence?.diamond ?? 0,
    skyblockDungeonsEssenceDragon: essence?.dragon ?? 0,
    skyblockDungeonsEssenceSpider: essence?.spider ?? 0,
    skyblockDungeonsEssenceWither: essence?.wither ?? 0,
    skyblockDungeonsEssenceUndead: essence?.undead ?? 0,
    skyblockDungeonsEssenceGold: essence?.gold ?? 0,
    skyblockDungeonsEssenceIce: essence?.ice ?? 0,
    skyblockDungeonsEssenceCrimson: essence?.crimson ?? 0,

    skyblockCrimsonIsleReputationBarbarian: crimson?.reputation?.barbarian ?? 0,
    skyblockCrimsonIsleReputationMage: crimson?.reputation?.mage ?? 0,

    skyblockCrimsonIsleKuudraBasic: kuudra?.basic ?? 0,
    skyblockCrimsonIsleKuudraHot: kuudra?.hot ?? 0,
    skyblockCrimsonIsleKuudraBurning: kuudra?.burning ?? 0,
    skyblockCrimsonIsleKuudraFiery: kuudra?.fiery ?? 0,
    skyblockCrimsonIsleKuudraInfernal: kuudra?.infernal ?? 0,

    skyblockNetworth: networth?.networth ?? 0,
    skyblockNetwrothArmor: networth?.types?.armor?.total ?? 0,
    skyblockNetwrothEquipment: networth?.types?.equipment?.total ?? 0,
    skyblockNetwrothWardrobe: networth?.types?.wardrobe?.total ?? 0,
    skyblockNetwrothInventory: networth?.types?.inventory?.total ?? 0,
    skyblockNetwrothEnderchest: networth?.types?.enderchest?.total ?? 0,
    skyblockNetwrothAccessories: networth?.types?.accessories?.total ?? 0,
    skyblockNetwrothPersonalVault: networth?.types?.personal_vault?.total ?? 0,
    skyblockNetwrothFishingBag: networth?.types?.fishing_bag?.total ?? 0,
    skyblockNetwrothStorage: networth?.types?.storage?.total ?? 0,
    skyblockNetwrothMuseum: networth?.types?.museum?.total ?? 0,
    skyblockNetwrothSacks: networth?.types?.sacks?.total ?? 0,
    skyblockNetwrothEssence: networth?.types?.essence?.total ?? 0,
    skyblockNetwrothPets: networth?.types?.pets?.total ?? 0,

    skyblockNetworthNetworthUnsoulbound: networth?.unsoulboundNetworth ?? 0,
    skyblockNetwrothArmorUnsoulbound: networth?.types?.armor?.unsoulboundTotal ?? 0,
    skyblockNetwrothEquipmentUnsoulbound: networth?.types?.equipment?.unsoulboundTotal ?? 0,
    skyblockNetwrothWardrobeUnsoulbound: networth?.types?.wardrobe?.unsoulboundTotal ?? 0,
    skyblockNetwrothInventoryUnsoulbound: networth?.types?.inventory?.unsoulboundTotal ?? 0,
    skyblockNetwrothEnderchestUnsoulbound: networth?.types?.enderchest?.unsoulboundTotal ?? 0,
    skyblockNetwrothAccessoriesUnsoulbound: networth?.types?.accessories?.unsoulboundTotal ?? 0,
    skyblockNetwrothPersonalVaultUnsoulbound: networth?.types?.personal_vault?.unsoulboundTotal ?? 0,
    skyblockNetwrothFishingBagUnsoulbound: networth?.types?.fishing_bag?.unsoulboundTotal ?? 0,
    skyblockNetwrothStorageUnsoulbound: networth?.types?.storage?.unsoulboundTotal ?? 0,
    skyblockNetwrothMuseumUnsoulbound: networth?.types?.museum?.unsoulboundTotal ?? 0,
    skyblockNetwrothSacksUnsoulbound: networth?.types?.sacks?.unsoulboundTotal ?? 0,
    skyblockNetwrothEssenceUnsoulbound: networth?.types?.essence?.unsoulboundTotal ?? 0,
    skyblockNetwrothPetsUnsoulbound: networth?.types?.pets?.unsoulboundTotal ?? 0,

    skyblockChocolateFactoryLevel: chocolateFactory?.level ?? 0,
    skyblockChocolateFactoryChocolateCurrent: chocolateFactory?.chocolate?.current ?? 0,
    skyblockChocolateFactoryChocolateSincePrestige: chocolateFactory?.chocolate?.sincePrestige ?? 0,
    skyblockChocolateFactoryChocolateTotal: chocolateFactory?.chocolate?.total ?? 0,

    skyblockChocolateFactoryEmployeeBro: chocolateFactory?.employees?.bro ?? 0,
    skyblockChocolateFactoryEmployeeCousin: chocolateFactory?.employees?.cousin ?? 0,
    skyblockChocolateFactoryEmployeeSis: chocolateFactory?.employees?.sis ?? 0,
    skyblockChocolateFactoryEmployeeFather: chocolateFactory?.employees?.father ?? 0,
    skyblockChocolateFactoryEmployeeGrandma: chocolateFactory?.employees?.grandma ?? 0,
    skyblockChocolateFactoryEmployeeUncle: chocolateFactory?.employees?.uncle ?? 0,
    skyblockChocolateFactoryEmployeeDog: chocolateFactory?.employees?.dog ?? 0,

    skyblockJacobMedalsGold: jacob?.medals?.gold ?? 0,
    skyblockJacobMedalsSilver: jacob?.medals?.silver ?? 0,
    skyblockJacobMedalsBronze: jacob?.medals?.bronze ?? 0,

    skyblockJacobPerksLevelCap: jacob?.perks?.levelCap ?? 0,
    skyblockJacobPerksDoubleDrops: jacob?.perks?.doubleDrops ?? 0,

    skyblockJacobPersonalBestNetherWart: jacob?.personalBests?.nether_wart ?? 0,
    skyblockJacobPersonalBestCocoBeans: jacob?.personalBests?.coco_beans ?? 0,
    skyblockJacobPersonalBestMushroom: jacob?.personalBests?.mushroom ?? 0,
    skyblockJacobPersonalBestWheat: jacob?.personalBests?.wheat ?? 0,
    skyblockJacobPersonalBestPotato: jacob?.personalBests?.potato ?? 0,
    skyblockJacobPersonalBestPumpkin: jacob?.personalBests?.pumpkin ?? 0,
    skyblockJacobPersonalBestCarrot: jacob?.personalBests?.carrot ?? 0,
    skyblockJacobPersonalBestCactus: jacob?.personalBests?.cactus ?? 0,
    skyblockJacobPersonalBestMelon: jacob?.personalBests?.melon ?? 0,
    skyblockJacobPersonalBestSugarCane: jacob?.personalBests?.sugar_cane ?? 0
  };
}

module.exports = { getNetworthCalculator, getPlayerVariableStats };
