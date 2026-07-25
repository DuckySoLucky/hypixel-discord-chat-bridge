import GenericManager from "../GenericManager.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import LinkedUser from "./LinkedUser.js";
import MowojangAPI from "../../private/MowojangAPI.js";
import { access, readFile, writeFile } from "node:fs/promises";
import { getNetWorth, getPlayer, getSelectedProfile } from "../../utils/hypixelUtils.js";
import type DataManager from "../DataManager.js";
import type { Guild, Player, SkyblockProfileWithMe } from "hypixel-api-reborn";
import type { LinkedData, LinkedUserData, OldFormat } from "../../types/linked.js";
import type { PlayerVariableStats } from "../../private/constants.js";

class LinkedManager extends GenericManager<LinkedUserData, LinkedData, LinkedUser> {
  constructor(data: DataManager) {
    super(data, "data/linked.json", "linked", []);
    this.checkData();
  }

  private isNewFormat(data: unknown): data is LinkedUserData[] {
    return (
      Array.isArray(data) &&
      data.every((item) => typeof item === "object" && item !== null && typeof (item as any).uuid === "string" && typeof (item as any).discordId === "string")
    );
  }

  private isOldFormat(data: unknown): data is OldFormat {
    return typeof data === "object" && data !== null && !Array.isArray(data) && Object.values(data).every((value) => typeof value === "string");
  }

  private convertOldFormat(data: OldFormat): LinkedUserData[] {
    const seenDiscordIds = new Set<string>();
    const result: LinkedUserData[] = [];

    for (const [uuid, discordId] of Object.entries(data)) {
      if (seenDiscordIds.has(discordId)) continue;
      seenDiscordIds.add(discordId);
      result.push({ uuid, discordId });
    }

    return result;
  }

  private async checkData() {
    const a = await access("./data/linked.json")
      .then(() => true)
      .catch(() => null);
    if (a === null) return;
    const file = await readFile("data/linked.json");
    const data = JSON.parse(file.toString());
    if (this.isNewFormat(data)) return;

    if (this.isOldFormat(data)) {
      const converted = this.convertOldFormat(data);
      await writeFile("data/linked.json", JSON.stringify(converted, null, 2), "utf-8");
      return;
    }

    throw new Error("data/linked.json is not a recognized format.");
  }

  override parseData(data: LinkedData): LinkedUser[] {
    return data.map((user) => new LinkedUser(user, this));
  }

  async writeUsersParsed(users: LinkedUser[]): Promise<LinkedUser[]> {
    return await this.writeData(users.map((user) => user.toJSON()));
  }

  async getUserByDiscordId(discordId: string): Promise<LinkedUser | undefined> {
    const users = await this.getFullData();
    return users.find((user) => user.discordId === discordId);
  }

  async getUserByUsername(username: string): Promise<LinkedUser | undefined> {
    const UUID = await MowojangAPI.getUUID(username);
    if (UUID === null) throw new HypixelDiscordChatBridgeError("User doesn't exist");
    return this.getUserByUUID(UUID);
  }

  async getUserByUUID(UUID: string): Promise<LinkedUser | undefined> {
    const users = await this.getFullData();
    return users.find((user) => user.uuid === UUID);
  }

  async getPlayerVariableStats(
    uuid: string,
    hypixelGuild: Guild | null = null,
    player: Player | null = null,
    skyblock: SkyblockProfileWithMe | null = null
  ): Promise<PlayerVariableStats> {
    if (!this.data.application.minecraft.isBotOnline()) throw new HypixelDiscordChatBridgeError(this.data.application.messages.minecraftBotOffline);
    const fetches = [];

    if (!hypixelGuild) fetches.push(this.data.application.getBotGuild().then((guild) => (hypixelGuild = guild)));
    if (!player) fetches.push(getPlayer(uuid).then((playerData) => (player = playerData)));
    if (!skyblock) {
      fetches.push(
        getSelectedProfile(uuid)
          .then((s) => (skyblock = s.profile))
          .catch(() => (skyblock = null))
      );
    }

    await Promise.all(fetches);
    if (!hypixelGuild) throw new HypixelDiscordChatBridgeError("In game Hypixel Guild not found.");
    if (!player) throw new HypixelDiscordChatBridgeError("Failed to fetch Player data");

    const networth = skyblock ? await getNetWorth(skyblock).catch(() => null) : null;
    const profile = skyblock?.me;
    const guildMember = hypixelGuild.members.find((m) => m.uuid === uuid);

    return {
      username: player.nickname,
      level: Math.floor(player.level.level),
      karma: Math.floor(player.karma),
      achievementPoints: Math.floor(player.achievements.points),
      guildRank: guildMember?.rank ?? "",
      guildName: hypixelGuild.name,

      bedwarsStar: Math.floor(player.stats.BedWars.level),
      bedwarsTokens: Math.floor(player.stats.BedWars.tokens),
      bedwarsKills: Math.floor(player.stats.BedWars.kills.total.kills),
      bedwarsDeaths: Math.floor(player.stats.BedWars.kills.total.deaths),
      bedwarsKDRatio: Math.floor(player.stats.BedWars.kills.total.ratio),
      bedwarsFinalKills: Math.floor(player.stats.BedWars.finals.total.kills),
      bedwarsFinalDeathss: Math.floor(player.stats.BedWars.finals.total.deaths),
      bedwarsFinalKDRatio: Math.floor(player.stats.BedWars.finals.total.ratio),
      bedwarsWins: Math.floor(player.stats.BedWars.wins),
      bedwarsLosses: Math.floor(player.stats.BedWars.losses),
      bedwarsWLRatio: Math.floor(player.stats.BedWars.winLossRatio),
      bedwarsBedsBroken: Math.floor(player.stats.BedWars.beds.broken),
      bedwarsBedsLost: Math.floor(player.stats.BedWars.beds.lost),
      bedwarsBedsBLRatio: Math.floor(player.stats.BedWars.beds.ratio),
      bedwarsPlayedGames: Math.floor(player.stats.BedWars.gamesPlayed),

      bedwarsSoloKills: Math.floor(player.stats.BedWars.eightOne.kills.total.kills),
      bedwarsSoloDeaths: Math.floor(player.stats.BedWars.eightOne.kills.total.deaths),
      bedwarsSoloKDRatio: Math.floor(player.stats.BedWars.eightOne.kills.total.ratio),
      bedwarsSoloFinalKills: Math.floor(player.stats.BedWars.eightOne.finals.total.kills),
      bedwarsSoloFinalDeathss: Math.floor(player.stats.BedWars.eightOne.finals.total.deaths),
      bedwarsSoloFinalKDRatio: Math.floor(player.stats.BedWars.eightOne.finals.total.ratio),
      bedwarsSoloWins: Math.floor(player.stats.BedWars.eightOne.wins),
      bedwarsSoloLosses: Math.floor(player.stats.BedWars.eightOne.losses),
      bedwarsSoloWLRatio: Math.floor(player.stats.BedWars.eightOne.winLossRatio),
      bedwarsSoloBedsBroken: Math.floor(player.stats.BedWars.eightOne.beds.broken),
      bedwarsSoloBedsLost: Math.floor(player.stats.BedWars.eightOne.beds.lost),
      bedwarsSoloBedsBLRatio: Math.floor(player.stats.BedWars.eightOne.beds.ratio),
      bedwarsSoloPlayedGames: Math.floor(player.stats.BedWars.eightOne.gamesPlayed),

      bedwarsDoublesKills: Math.floor(player.stats.BedWars.eightTwo.kills.total.kills),
      bedwarsDoublesDeaths: Math.floor(player.stats.BedWars.eightTwo.kills.total.deaths),
      bedwarsDoublesKDRatio: Math.floor(player.stats.BedWars.eightTwo.kills.total.ratio),
      bedwarsDoublesFinalKills: Math.floor(player.stats.BedWars.eightTwo.finals.total.kills),
      bedwarsDoublesFinalDeathss: Math.floor(player.stats.BedWars.eightTwo.finals.total.deaths),
      bedwarsDoublesFinalKDRatio: Math.floor(player.stats.BedWars.eightTwo.finals.total.ratio),
      bedwarsDoublesWins: Math.floor(player.stats.BedWars.eightTwo.wins),
      bedwarsDoublesLosses: Math.floor(player.stats.BedWars.eightTwo.losses),
      bedwarsDoublesWLRatio: Math.floor(player.stats.BedWars.eightTwo.winLossRatio),
      bedwarsDoublesBedsBroken: Math.floor(player.stats.BedWars.eightTwo.beds.broken),
      bedwarsDoublesBedsLost: Math.floor(player.stats.BedWars.eightTwo.beds.lost),
      bedwarsDoublesBedsBLRatio: Math.floor(player.stats.BedWars.eightTwo.beds.ratio),
      bedwarsDoublesPlayedGames: Math.floor(player.stats.BedWars.eightTwo.gamesPlayed),

      bedwarsThreesKills: Math.floor(player.stats.BedWars.fourThree.kills.total.kills),
      bedwarsThreesDeaths: Math.floor(player.stats.BedWars.fourThree.kills.total.deaths),
      bedwarsThreesKDRatio: Math.floor(player.stats.BedWars.fourThree.kills.total.ratio),
      bedwarsThreesFinalKills: Math.floor(player.stats.BedWars.fourThree.finals.total.kills),
      bedwarsThreesFinalDeathss: Math.floor(player.stats.BedWars.fourThree.finals.total.deaths),
      bedwarsThreesFinalKDRatio: Math.floor(player.stats.BedWars.fourThree.finals.total.ratio),
      bedwarsThreesWins: Math.floor(player.stats.BedWars.fourThree.wins),
      bedwarsThreesLosses: Math.floor(player.stats.BedWars.fourThree.losses),
      bedwarsThreesWLRatio: Math.floor(player.stats.BedWars.fourThree.winLossRatio),
      bedwarsThreesBedsBroken: Math.floor(player.stats.BedWars.fourThree.beds.broken),
      bedwarsThreesBedsLost: Math.floor(player.stats.BedWars.fourThree.beds.lost),
      bedwarsThreesBedsBLRatio: Math.floor(player.stats.BedWars.fourThree.beds.ratio),
      bedwarsThreesPlayedGames: Math.floor(player.stats.BedWars.fourThree.gamesPlayed),

      bedwarsFoursKills: Math.floor(player.stats.BedWars.fourFour.kills.total.kills),
      bedwarsFoursDeaths: Math.floor(player.stats.BedWars.fourFour.kills.total.deaths),
      bedwarsFoursKDRatio: Math.floor(player.stats.BedWars.fourFour.kills.total.ratio),
      bedwarsFoursFinalKills: Math.floor(player.stats.BedWars.fourFour.finals.total.kills),
      bedwarsFoursFinalDeathss: Math.floor(player.stats.BedWars.fourFour.finals.total.deaths),
      bedwarsFoursFinalKDRatio: Math.floor(player.stats.BedWars.fourFour.finals.total.ratio),
      bedwarsFoursWins: Math.floor(player.stats.BedWars.fourFour.wins),
      bedwarsFoursLosses: Math.floor(player.stats.BedWars.fourFour.losses),
      bedwarsFoursWLRatio: Math.floor(player.stats.BedWars.fourFour.winLossRatio),
      bedwarsFoursBedsBroken: Math.floor(player.stats.BedWars.fourFour.beds.broken),
      bedwarsFoursBedsLost: Math.floor(player.stats.BedWars.fourFour.beds.lost),
      bedwarsFoursBedsBLRatio: Math.floor(player.stats.BedWars.fourFour.beds.ratio),
      bedwarsFoursPlayedGames: Math.floor(player.stats.BedWars.fourFour.gamesPlayed),

      bedwars4v4Kills: Math.floor(player.stats.BedWars.twoFour.kills.total.kills),
      bedwars4v4Deaths: Math.floor(player.stats.BedWars.twoFour.kills.total.deaths),
      bedwars4v4KDRatio: Math.floor(player.stats.BedWars.twoFour.kills.total.ratio),
      bedwars4v4FinalKills: Math.floor(player.stats.BedWars.twoFour.finals.total.kills),
      bedwars4v4FinalDeathss: Math.floor(player.stats.BedWars.twoFour.finals.total.deaths),
      bedwars4v4FinalKDRatio: Math.floor(player.stats.BedWars.twoFour.finals.total.ratio),
      bedwars4v4Wins: Math.floor(player.stats.BedWars.twoFour.wins),
      bedwars4v4Losses: Math.floor(player.stats.BedWars.twoFour.losses),
      bedwars4v4WLRatio: Math.floor(player.stats.BedWars.twoFour.winLossRatio),
      bedwars4v4BedsBroken: Math.floor(player.stats.BedWars.twoFour.beds.broken),
      bedwars4v4BedsLost: Math.floor(player.stats.BedWars.twoFour.beds.lost),
      bedwars4v4BedsBLRatio: Math.floor(player.stats.BedWars.twoFour.beds.ratio),
      bedwars4v4PlayedGames: Math.floor(player.stats.BedWars.twoFour.gamesPlayed),

      skywarsStar: Math.floor(player.stats.SkyWars.level),
      skywarsCoins: Math.floor(player.stats.SkyWars.coins),
      skywarsTokens: Math.floor(player.stats.SkyWars.tokens),
      skywarsSouls: Math.floor(player.stats.SkyWars.souls),
      skywarsOpals: Math.floor(player.stats.SkyWars.opals),
      skywarsKills: Math.floor(player.stats.SkyWars.kills.total.kills),
      skywarsDeaths: Math.floor(player.stats.SkyWars.deaths.total.deaths),
      skywarsKDRatio: Math.floor(player.stats.SkyWars.kills.total.ratio),
      skywarsWins: Math.floor(player.stats.SkyWars.wins),
      skywarsLosses: Math.floor(player.stats.SkyWars.losses),
      skywarsWLRatio: Math.floor(player.stats.SkyWars.WLRatio),
      skywarsPlayedGames: Math.floor(player.stats.SkyWars.gamesPlayed),

      duelsDivision: player.stats.Duels.title ?? "",
      duelsKills: Math.floor(player.stats.Duels.kills),
      duelsDeaths: Math.floor(player.stats.Duels.deaths),
      duelsKDRatio: Math.floor(player.stats.Duels.KDR),
      duelsWins: Math.floor(player.stats.Duels.wins),
      duelsLosses: Math.floor(player.stats.Duels.losses),
      duelsWLRatio: Math.floor(player.stats.Duels.WLR),
      duelsPlayedGames: Math.floor(player.stats.Duels.playedGames),

      skyblockBank: Math.floor(networth?.bank ?? 0),
      skyblockPurse: Math.floor(networth?.purse ?? 0),
      skyblockLevel: Math.floor(profile?.leveling?.level ?? 0),

      skyblockSkillsAverageLevel: Math.floor(profile?.playerData?.skills?.average ?? 0),
      skyblockSkillsNonCosmeticAverageLevel: Math.floor(profile?.playerData?.skills?.nonCosmeticAverage ?? 0),
      skyblockSkillsFarmingLevel: Math.floor(profile?.playerData?.skills?.farming?.level ?? 0),
      skyblockSkillsMiningLevel: Math.floor(profile?.playerData?.skills?.mining?.level ?? 0),
      skyblockSkillsCombatLevel: Math.floor(profile?.playerData?.skills?.combat?.level ?? 0),
      skyblockSkillsForagingLevel: Math.floor(profile?.playerData?.skills?.foraging?.level ?? 0),
      skyblockSkillsFishingLevel: Math.floor(profile?.playerData?.skills?.fishing?.level ?? 0),
      skyblockSkillsEnchantingLevel: Math.floor(profile?.playerData?.skills?.enchanting?.level ?? 0),
      skyblockSkillsAlchemyLevel: Math.floor(profile?.playerData?.skills?.alchemy?.level ?? 0),
      skyblockSkillsCarpentryLevel: Math.floor(profile?.playerData?.skills?.carpentry?.level ?? 0),
      skyblockSkillsRunecraftingLevel: Math.floor(profile?.playerData?.skills?.runecrafting?.level ?? 0),
      skyblockSkillsSocialLevel: Math.floor(profile?.playerData?.skills?.social?.level ?? 0),
      skyblockSkillsTamingLevel: Math.floor(profile?.playerData?.skills?.taming?.level ?? 0),

      skyblockSkillsFarmingXp: Math.floor(profile?.playerData?.skills?.farming?.xp ?? 0),
      skyblockSkillsMiningXp: Math.floor(profile?.playerData?.skills?.mining?.xp ?? 0),
      skyblockSkillsCombatXp: Math.floor(profile?.playerData?.skills?.combat?.xp ?? 0),
      skyblockSkillsForagingXp: Math.floor(profile?.playerData?.skills?.foraging?.xp ?? 0),
      skyblockSkillsFishingXp: Math.floor(profile?.playerData?.skills?.fishing?.xp ?? 0),
      skyblockSkillsEnchantingXp: Math.floor(profile?.playerData?.skills?.enchanting?.xp ?? 0),
      skyblockSkillsAlchemyXp: Math.floor(profile?.playerData?.skills?.alchemy?.xp ?? 0),
      skyblockSkillsCarpentryXp: Math.floor(profile?.playerData?.skills?.carpentry?.xp ?? 0),
      skyblockSkillsRunecraftingXp: Math.floor(profile?.playerData?.skills?.runecrafting?.xp ?? 0),
      skyblockSkillsSocialXp: Math.floor(profile?.playerData?.skills?.social?.xp ?? 0),
      skyblockSkillsTamingXp: Math.floor(profile?.playerData?.skills?.taming?.xp ?? 0),

      skyblockSlayerZombieLevel: Math.floor(profile?.slayers?.zombie?.level?.level ?? 0),
      skyblockSlayerSpiderLevel: Math.floor(profile?.slayers?.spider?.level?.level ?? 0),
      skyblockSlayerWolfLevel: Math.floor(profile?.slayers?.wolf?.level?.level ?? 0),
      skyblockSlayerEndermanLevel: Math.floor(profile?.slayers?.enderman?.level?.level ?? 0),
      skyblockSlayerBlazeLevel: Math.floor(profile?.slayers?.blaze?.level?.level ?? 0),
      skyblockSlayerVampireLevel: Math.floor(profile?.slayers?.vampire?.level?.level ?? 0),

      skyblockSlayerZombieXp: Math.floor(profile?.slayers?.zombie?.level?.xp ?? 0),
      skyblockSlayerSpiderXp: Math.floor(profile?.slayers?.spider?.level?.xp ?? 0),
      skyblockSlayerWolfXp: Math.floor(profile?.slayers?.wolf?.level?.xp ?? 0),
      skyblockSlayerEndermanXp: Math.floor(profile?.slayers?.enderman?.level?.xp ?? 0),
      skyblockSlayerBlazeXp: Math.floor(profile?.slayers?.blaze?.level?.xp ?? 0),
      skyblockSlayerVampireXp: Math.floor(profile?.slayers?.vampire?.level?.xp ?? 0),

      skyblockDungeonsSecrets: Math.floor(profile?.dungeons?.secrets ?? 0),
      skyblockDungeonsXp: Math.floor(profile?.dungeons?.level?.xp ?? 0),
      skyblockDungeonsLevel: Math.floor(profile?.dungeons?.level?.level ?? 0),

      skyblockDungeonsClassAverageLevel: Math.floor(profile?.dungeons?.classes?.average ?? 0),
      skyblockDungeonsClassHealerLevel: Math.floor(profile?.dungeons?.classes?.healer?.level ?? 0),
      skyblockDungeonsClassMageLevel: Math.floor(profile?.dungeons?.classes?.mage?.level ?? 0),
      skyblockDungeonsClassBerserkLevel: Math.floor(profile?.dungeons?.classes?.berserk?.level ?? 0),
      skyblockDungeonsClassArcherLevel: Math.floor(profile?.dungeons?.classes?.archer?.level ?? 0),
      skyblockDungeonsClassTankLevel: Math.floor(profile?.dungeons?.classes?.tank?.level ?? 0),

      skyblockDungeonsClassHealerXp: Math.floor(profile?.dungeons?.classes?.healer?.xp ?? 0),
      skyblockDungeonsClassMageXp: Math.floor(profile?.dungeons?.classes?.mage?.xp ?? 0),
      skyblockDungeonsClassBerserkXp: Math.floor(profile?.dungeons?.classes?.berserk?.xp ?? 0),
      skyblockDungeonsClassArcherXp: Math.floor(profile?.dungeons?.classes?.archer?.xp ?? 0),
      skyblockDungeonsClassTankXp: Math.floor(profile?.dungeons?.classes?.tank?.xp ?? 0),

      skyblockDungeonsEssenceDiamond: Math.floor(profile?.currencies?.diamondEssence ?? 0),
      skyblockDungeonsEssenceDragon: Math.floor(profile?.currencies?.dragonEssence ?? 0),
      skyblockDungeonsEssenceSpider: Math.floor(profile?.currencies?.spiderEssence ?? 0),
      skyblockDungeonsEssenceWither: Math.floor(profile?.currencies?.witherEssence ?? 0),
      skyblockDungeonsEssenceUndead: Math.floor(profile?.currencies?.undeadEssence ?? 0),
      skyblockDungeonsEssenceGold: Math.floor(profile?.currencies?.goldEssence ?? 0),
      skyblockDungeonsEssenceIce: Math.floor(profile?.currencies?.iceEssence ?? 0),
      skyblockDungeonsEssenceCrimson: Math.floor(profile?.currencies?.crimsonEssence ?? 0),

      skyblockCrimsonIsleReputationBarbarian: Math.floor(profile?.crimsonIsle?.barbariansReputation ?? 0),
      skyblockCrimsonIsleReputationMage: Math.floor(profile?.crimsonIsle?.magesReputation ?? 0),

      skyblockCrimsonIsleKuudraBasic: Math.floor(profile?.crimsonIsle?.kuudra?.basicCompletions ?? 0),
      skyblockCrimsonIsleKuudraHot: Math.floor(profile?.crimsonIsle?.kuudra?.hotCompletions ?? 0),
      skyblockCrimsonIsleKuudraBurning: Math.floor(profile?.crimsonIsle?.kuudra?.burningCompletions ?? 0),
      skyblockCrimsonIsleKuudraFiery: Math.floor(profile?.crimsonIsle?.kuudra?.fieryCompletions ?? 0),
      skyblockCrimsonIsleKuudraInfernal: Math.floor(profile?.crimsonIsle?.kuudra?.infernalCompletions ?? 0),

      skyblockNetworth: Math.floor(networth?.networth ?? 0),
      skyblockNetwrothArmor: Math.floor(networth?.types?.armor?.total ?? 0),
      skyblockNetwrothEquipment: Math.floor(networth?.types?.equipment?.total ?? 0),
      skyblockNetwrothWardrobe: Math.floor(networth?.types?.wardrobe?.total ?? 0),
      skyblockNetwrothInventory: Math.floor(networth?.types?.inventory?.total ?? 0),
      skyblockNetwrothEnderchest: Math.floor(networth?.types?.enderchest?.total ?? 0),
      skyblockNetwrothAccessories: Math.floor(networth?.types?.accessories?.total ?? 0),
      skyblockNetwrothPersonalVault: Math.floor(networth?.types?.personal_vault?.total ?? 0),
      skyblockNetwrothFishingBag: Math.floor(networth?.types?.fishing_bag?.total ?? 0),
      skyblockNetwrothStorage: Math.floor(networth?.types?.storage?.total ?? 0),
      skyblockNetwrothMuseum: Math.floor(networth?.types?.museum?.total ?? 0),
      skyblockNetwrothSacks: Math.floor(networth?.types?.sacks?.total ?? 0),
      skyblockNetwrothEssence: Math.floor(networth?.types?.essence?.total ?? 0),
      skyblockNetwrothPets: Math.floor(networth?.types?.pets?.total ?? 0),

      skyblockNetworthUnsoulbound: Math.floor(networth?.unsoulboundNetworth ?? 0),
      skyblockNetwrothArmorUnsoulbound: Math.floor(networth?.types?.armor?.unsoulboundTotal ?? 0),
      skyblockNetwrothEquipmentUnsoulbound: Math.floor(networth?.types?.equipment?.unsoulboundTotal ?? 0),
      skyblockNetwrothWardrobeUnsoulbound: Math.floor(networth?.types?.wardrobe?.unsoulboundTotal ?? 0),
      skyblockNetwrothInventoryUnsoulbound: Math.floor(networth?.types?.inventory?.unsoulboundTotal ?? 0),
      skyblockNetwrothEnderchestUnsoulbound: Math.floor(networth?.types?.enderchest?.unsoulboundTotal ?? 0),
      skyblockNetwrothAccessoriesUnsoulbound: Math.floor(networth?.types?.accessories?.unsoulboundTotal ?? 0),
      skyblockNetwrothPersonalVaultUnsoulbound: Math.floor(networth?.types?.personal_vault?.unsoulboundTotal ?? 0),
      skyblockNetwrothFishingBagUnsoulbound: Math.floor(networth?.types?.fishing_bag?.unsoulboundTotal ?? 0),
      skyblockNetwrothStorageUnsoulbound: Math.floor(networth?.types?.storage?.unsoulboundTotal ?? 0),
      skyblockNetwrothMuseumUnsoulbound: Math.floor(networth?.types?.museum?.unsoulboundTotal ?? 0),
      skyblockNetwrothSacksUnsoulbound: Math.floor(networth?.types?.sacks?.unsoulboundTotal ?? 0),
      skyblockNetwrothEssenceUnsoulbound: Math.floor(networth?.types?.essence?.unsoulboundTotal ?? 0),
      skyblockNetwrothPetsUnsoulbound: Math.floor(networth?.types?.pets?.unsoulboundTotal ?? 0),

      skyblockChocolateFactoryLevel: Math.floor(profile?.chocolateFactory?.prestige ?? 0),
      skyblockChocolateFactoryChocolateCurrent: Math.floor(profile?.chocolateFactory?.currentChocolate ?? 0),
      skyblockChocolateFactoryChocolateSincePrestige: Math.floor(profile?.chocolateFactory?.chocolateSincePrestige ?? 0),
      skyblockChocolateFactoryChocolateTotal: Math.floor(profile?.chocolateFactory?.totalChocolate ?? 0),

      skyblockChocolateFactoryEmployeeBro: Math.floor(profile?.chocolateFactory?.employees?.bro ?? 0),
      skyblockChocolateFactoryEmployeeCousin: Math.floor(profile?.chocolateFactory?.employees?.cousin ?? 0),
      skyblockChocolateFactoryEmployeeSis: Math.floor(profile?.chocolateFactory?.employees?.sis ?? 0),
      skyblockChocolateFactoryEmployeeFather: Math.floor(profile?.chocolateFactory?.employees?.father ?? 0),
      skyblockChocolateFactoryEmployeeGrandma: Math.floor(profile?.chocolateFactory?.employees?.grandma ?? 0),
      skyblockChocolateFactoryEmployeeUncle: Math.floor(profile?.chocolateFactory?.employees?.uncle ?? 0),
      skyblockChocolateFactoryEmployeeDog: Math.floor(profile?.chocolateFactory?.employees?.dog ?? 0),

      skyblockJacobMedalsGold: Math.floor(profile?.jacobContests?.medals?.gold ?? 0),
      skyblockJacobMedalsSilver: Math.floor(profile?.jacobContests?.medals?.silver ?? 0),
      skyblockJacobMedalsBronze: Math.floor(profile?.jacobContests?.medals?.bronze ?? 0),

      skyblockJacobPerksLevelCap: Math.floor(profile?.jacobContests?.perks?.farmingLevelCap ?? 0),
      skyblockJacobPerksDoubleDrops: Math.floor(profile?.jacobContests?.perks?.doubleDrops ?? 0),

      skyblockJacobPersonalBestNetherWart: Math.floor(profile?.jacobContests?.personalBests?.NETHER_STALK ?? 0),
      skyblockJacobPersonalBestCocoBeans: Math.floor(profile?.jacobContests?.personalBests["INK_SACK:3"] ?? 0),
      skyblockJacobPersonalBestMushroom: Math.floor(profile?.jacobContests?.personalBests?.MUSHROOM_COLLECTION ?? 0),
      skyblockJacobPersonalBestWheat: Math.floor(profile?.jacobContests?.personalBests?.WHEAT ?? 0),
      skyblockJacobPersonalBestPotato: Math.floor(profile?.jacobContests?.personalBests?.POTATO_ITEM ?? 0),
      skyblockJacobPersonalBestPumpkin: Math.floor(profile?.jacobContests?.personalBests?.PUMPKIN ?? 0),
      skyblockJacobPersonalBestCarrot: Math.floor(profile?.jacobContests?.personalBests?.CARROT_ITEM ?? 0),
      skyblockJacobPersonalBestCactus: Math.floor(profile?.jacobContests?.personalBests?.CACTUS ?? 0),
      skyblockJacobPersonalBestMelon: Math.floor(profile?.jacobContests?.personalBests?.MELON ?? 0),
      skyblockJacobPersonalBestSugarCane: Math.floor(profile?.jacobContests?.personalBests?.SUGAR_CANE ?? 0)
    };
  }
}

export default LinkedManager;
