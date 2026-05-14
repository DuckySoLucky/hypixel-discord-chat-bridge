import HypixelAPIReborn from "../Private/HypixelAPIReborn.js";
import HypixelDiscordChatBridgeError from "../Private/Error.js";
import LinkedUser from "./Private/LinkedUser.js";
import MowojangAPI from "../Private/MowojangAPI.js";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { getNetworthCalculator, getSelectedProfile } from "../Utils/HypixelUtils.js";
import type Application from "../Application.js";
import type { Guild, Player, SkyBlockMember, SkyblockProfileWithMe } from "hypixel-api-reborn";
import type { LinkedData } from "../Types/Linked.js";

class LinkedManager {
  readonly app: Application;
  constructor(app: Application) {
    this.app = app;

    if (!existsSync("./data/")) mkdirSync("./data/", { recursive: true });
    if (!existsSync("./data/linked.json")) writeFileSync("./data/linked.json", JSON.stringify({}));
  }

  getLinkedFile(): LinkedData {
    const linkedData = readFileSync("data/linked.json");
    if (!linkedData) throw new HypixelDiscordChatBridgeError("The linked data file does not exist. Please contact an administrator.");
    const linked = JSON.parse(linkedData.toString());
    if (!linked) throw new HypixelDiscordChatBridgeError("The linked data file is malformed. Please contact an administrator.");
    return linked;
  }

  unparseLinkedData(data: LinkedUser[]): LinkedData {
    return data
      .map((user) => user.toJSON())
      .reduce<LinkedData>((acc, user) => {
        acc[user.uuid] = user.discordId;
        return acc;
      }, {});
  }

  parseLinkedData(data: LinkedData): LinkedUser[] {
    return Object.entries(data).map(([uuid, discordId]) => new LinkedUser({ uuid, discordId }, this));
  }

  getLinkedUsers(): LinkedUser[] {
    return this.parseLinkedData(this.getLinkedFile());
  }

  writeLinkedUsers(data: LinkedData): LinkedUser[] {
    writeFileSync("./data/linked.json", JSON.stringify(data, null, 2));
    return this.parseLinkedData(data);
  }

  writeLinkedUsersParsed(users: LinkedUser[]): LinkedUser[] {
    return this.writeLinkedUsers(this.unparseLinkedData(users));
  }

  getUser(linkedUser: LinkedUser): LinkedUser | undefined {
    const users = this.getLinkedUsers();
    return users.find((user) => user === linkedUser);
  }

  getUserByDiscordId(discordId: string): LinkedUser | undefined {
    const users = this.getLinkedUsers();
    return users.find((user) => user.discordId === discordId);
  }

  async getUserByUsername(username: string): Promise<LinkedUser | undefined> {
    const UUID = await MowojangAPI.getUUID(username);
    if (UUID === null) throw new HypixelDiscordChatBridgeError("User doesn't exist");
    return this.getUserByUUID(UUID);
  }

  getUserByUUID(UUID: string): LinkedUser | undefined {
    const users = this.getLinkedUsers();
    return users.find((user) => user.uuid === UUID);
  }

  async getPlayerVariableStats(
    uuid: string,
    hypixelGuild: Guild | null = null,
    player: Player | null = null,
    skyblock: SkyblockProfileWithMe | null = null
  ): Promise<Record<string, string | number>> {
    if (!this.app.minecraft.isBotOnline()) throw new HypixelDiscordChatBridgeError("Bot doesn't seem to be connected to Hypixel. Please try again.");
    const fetches = [];

    if (!hypixelGuild) fetches.push(this.app.getBotGuild().then((guild) => (hypixelGuild = guild)));
    if (!player) {
      fetches.push(
        HypixelAPIReborn.getPlayer(uuid).then((playerData) => {
          if (playerData.isRaw()) throw new HypixelDiscordChatBridgeError("Failed to fetch Player data.");
          player = playerData;
          return playerData;
        })
      );
    }
    if (!skyblock) fetches.push(getSelectedProfile(uuid).then((s) => (skyblock = s)));

    await Promise.all(fetches);
    if (!hypixelGuild) throw new HypixelDiscordChatBridgeError("In game Hypixel Guild not found.");
    if (!player) throw new HypixelDiscordChatBridgeError("Failed to fetch Player data");
    if (!skyblock) throw new HypixelDiscordChatBridgeError("Failed to fetch SkyBlock data");

    const networth = await getNetworthCalculator(skyblock).then((manager) => manager.getNetworth({ onlyNetworth: true }));
    const profile: SkyBlockMember = skyblock.me;
    const guildMember = hypixelGuild.members.find((m) => m.uuid === uuid);

    return {
      username: player.nickname,
      level: player.level.level,
      karma: player.karma,
      achievementPoints: player.achievements.points,
      guildRank: guildMember?.rank ?? "",
      guildName: hypixelGuild.name,

      bedwarsStar: player.stats.BedWars.level,
      bedwarsTokens: player.stats.BedWars.tokens,
      bedwarsKills: player.stats.BedWars.kills.total.kills,
      bedwarsDeaths: player.stats.BedWars.kills.total.deaths,
      bedwarsKDRatio: player.stats.BedWars.kills.total.ratio,
      bedwarsFinalKills: player.stats.BedWars.finals.total.kills,
      bedwarsFinalDeathss: player.stats.BedWars.finals.total.deaths,
      bedwarsFinalKDRatio: player.stats.BedWars.finals.total.ratio,
      bedwarsWins: player.stats.BedWars.wins,
      bedwarsLosses: player.stats.BedWars.losses,
      bedwarsWLRatio: player.stats.BedWars.winLossRatio,
      bedwarsBedsBroken: player.stats.BedWars.beds.broken,
      bedwarsBedsLost: player.stats.BedWars.beds.lost,
      bedwarsBedsBLRatio: player.stats.BedWars.beds.ratio,
      bedwarsPlayedGames: player.stats.BedWars.gamesPlayed,

      bedwarsSoloKills: player.stats.BedWars.eightOne.kills.total.kills,
      bedwarsSoloDeaths: player.stats.BedWars.eightOne.kills.total.deaths,
      bedwarsSoloKDRatio: player.stats.BedWars.eightOne.kills.total.ratio,
      bedwarsSoloFinalKills: player.stats.BedWars.eightOne.finals.total.kills,
      bedwarsSoloFinalDeathss: player.stats.BedWars.eightOne.finals.total.deaths,
      bedwarsSoloFinalKDRatio: player.stats.BedWars.eightOne.finals.total.ratio,
      bedwarsSoloWins: player.stats.BedWars.eightOne.wins,
      bedwarsSoloLosses: player.stats.BedWars.eightOne.losses,
      bedwarsSoloWLRatio: player.stats.BedWars.eightOne.winLossRatio,
      bedwarsSoloBedsBroken: player.stats.BedWars.eightOne.beds.broken,
      bedwarsSoloBedsLost: player.stats.BedWars.eightOne.beds.lost,
      bedwarsSoloBedsBLRatio: player.stats.BedWars.eightOne.beds.ratio,
      bedwarsSoloPlayedGames: player.stats.BedWars.eightOne.gamesPlayed,

      bedwarsDoublesKills: player.stats.BedWars.eightTwo.kills.total.kills,
      bedwarsDoublesDeaths: player.stats.BedWars.eightTwo.kills.total.deaths,
      bedwarsDoublesKDRatio: player.stats.BedWars.eightTwo.kills.total.ratio,
      bedwarsDoublesFinalKills: player.stats.BedWars.eightTwo.finals.total.kills,
      bedwarsDoublesFinalDeathss: player.stats.BedWars.eightTwo.finals.total.deaths,
      bedwarsDoublesFinalKDRatio: player.stats.BedWars.eightTwo.finals.total.ratio,
      bedwarsDoublesWins: player.stats.BedWars.eightTwo.wins,
      bedwarsDoublesLosses: player.stats.BedWars.eightTwo.losses,
      bedwarsDoublesWLRatio: player.stats.BedWars.eightTwo.winLossRatio,
      bedwarsDoublesBedsBroken: player.stats.BedWars.eightTwo.beds.broken,
      bedwarsDoublesBedsLost: player.stats.BedWars.eightTwo.beds.lost,
      bedwarsDoublesBedsBLRatio: player.stats.BedWars.eightTwo.beds.ratio,
      bedwarsDoublesPlayedGames: player.stats.BedWars.eightTwo.gamesPlayed,

      bedwarsThreesKills: player.stats.BedWars.fourThree.kills.total.kills,
      bedwarsThreesDeaths: player.stats.BedWars.fourThree.kills.total.deaths,
      bedwarsThreesKDRatio: player.stats.BedWars.fourThree.kills.total.ratio,
      bedwarsThreesFinalKills: player.stats.BedWars.fourThree.finals.total.kills,
      bedwarsThreesFinalDeathss: player.stats.BedWars.fourThree.finals.total.deaths,
      bedwarsThreesFinalKDRatio: player.stats.BedWars.fourThree.finals.total.ratio,
      bedwarsThreesWins: player.stats.BedWars.fourThree.wins,
      bedwarsThreesLosses: player.stats.BedWars.fourThree.losses,
      bedwarsThreesWLRatio: player.stats.BedWars.fourThree.winLossRatio,
      bedwarsThreesBedsBroken: player.stats.BedWars.fourThree.beds.broken,
      bedwarsThreesBedsLost: player.stats.BedWars.fourThree.beds.lost,
      bedwarsThreesBedsBLRatio: player.stats.BedWars.fourThree.beds.ratio,
      bedwarsThreesPlayedGames: player.stats.BedWars.fourThree.gamesPlayed,

      bedwarsFoursKills: player.stats.BedWars.fourFour.kills.total.kills,
      bedwarsFoursDeaths: player.stats.BedWars.fourFour.kills.total.deaths,
      bedwarsFoursKDRatio: player.stats.BedWars.fourFour.kills.total.ratio,
      bedwarsFoursFinalKills: player.stats.BedWars.fourFour.finals.total.kills,
      bedwarsFoursFinalDeathss: player.stats.BedWars.fourFour.finals.total.deaths,
      bedwarsFoursFinalKDRatio: player.stats.BedWars.fourFour.finals.total.ratio,
      bedwarsFoursWins: player.stats.BedWars.fourFour.wins,
      bedwarsFoursLosses: player.stats.BedWars.fourFour.losses,
      bedwarsFoursWLRatio: player.stats.BedWars.fourFour.winLossRatio,
      bedwarsFoursBedsBroken: player.stats.BedWars.fourFour.beds.broken,
      bedwarsFoursBedsLost: player.stats.BedWars.fourFour.beds.lost,
      bedwarsFoursBedsBLRatio: player.stats.BedWars.fourFour.beds.ratio,
      bedwarsFoursPlayedGames: player.stats.BedWars.fourFour.gamesPlayed,

      bedwars4v4Kills: player.stats.BedWars.twoFour.kills.total.kills,
      bedwars4v4Deaths: player.stats.BedWars.twoFour.kills.total.deaths,
      bedwars4v4KDRatio: player.stats.BedWars.twoFour.kills.total.ratio,
      bedwars4v4FinalKills: player.stats.BedWars.twoFour.finals.total.kills,
      bedwars4v4FinalDeathss: player.stats.BedWars.twoFour.finals.total.deaths,
      bedwars4v4FinalKDRatio: player.stats.BedWars.twoFour.finals.total.ratio,
      bedwars4v4Wins: player.stats.BedWars.twoFour.wins,
      bedwars4v4Losses: player.stats.BedWars.twoFour.losses,
      bedwars4v4WLRatio: player.stats.BedWars.twoFour.winLossRatio,
      bedwars4v4BedsBroken: player.stats.BedWars.twoFour.beds.broken,
      bedwars4v4BedsLost: player.stats.BedWars.twoFour.beds.lost,
      bedwars4v4BedsBLRatio: player.stats.BedWars.twoFour.beds.ratio,
      bedwars4v4PlayedGames: player.stats.BedWars.twoFour.gamesPlayed,

      skywarsStar: player.stats.SkyWars.level,
      skywarsCoins: player.stats.SkyWars.coins,
      skywarsTokens: player.stats.SkyWars.tokens,
      skywarsSouls: player.stats.SkyWars.souls,
      skywarsOpals: player.stats.SkyWars.opals,
      skywarsKills: player.stats.SkyWars.kills.total.kills,
      skywarsDeaths: player.stats.SkyWars.deaths.total.deaths,
      skywarsKDRatio: player.stats.SkyWars.kills.total.ratio,
      skywarsWins: player.stats.SkyWars.wins,
      skywarsLosses: player.stats.SkyWars.losses,
      skywarsWLRatio: player.stats.SkyWars.WLRatio,
      skywarsPlayedGames: player.stats.SkyWars.gamesPlayed,

      duelsDivision: player.stats.Duels.title ?? "",
      duelsKills: player.stats.Duels.kills,
      duelsDeaths: player.stats.Duels.deaths,
      duelsKDRatio: player.stats.Duels.KDR,
      duelsWins: player.stats.Duels.wins,
      duelsLosses: player.stats.Duels.losses,
      duelsWLRatio: player.stats.Duels.WLR,
      duelsPlayedGames: player.stats.Duels.playedGames,

      skyblockBank: networth.bank,
      skyblockPurse: networth.purse,
      skyblockLevel: profile.leveling.level,

      skyblockSkillsAverageLevel: profile.playerData.skills.average,
      skyblockSkillsNonCosmeticAverageLevel: profile.playerData.skills.nonCosmeticAverage,
      skyblockSkillsFarmingLevel: profile.playerData.skills.farming.level,
      skyblockSkillsMiningLevel: profile.playerData.skills.mining.level,
      skyblockSkillsCombatLevel: profile.playerData.skills.combat.level,
      skyblockSkillsForagingLevel: profile.playerData.skills.foraging.level,
      skyblockSkillsFishingLevel: profile.playerData.skills.fishing.level,
      skyblockSkillsEnchantingLevel: profile.playerData.skills.enchanting.level,
      skyblockSkillsAlchemyLevel: profile.playerData.skills.alchemy.level,
      skyblockSkillsCarpentryLevel: profile.playerData.skills.carpentry.level,
      skyblockSkillsRunecraftingLevel: profile.playerData.skills.runecrafting.level,
      skyblockSkillsSocialLevel: profile.playerData.skills.social.level,
      skyblockSkillsTamingLevel: profile.playerData.skills.taming.level,

      skyblockSkillsFarmingXp: profile.playerData.skills.farming.xp,
      skyblockSkillsMiningXp: profile.playerData.skills.mining.xp,
      skyblockSkillsCombatXp: profile.playerData.skills.combat.xp,
      skyblockSkillsForagingXp: profile.playerData.skills.foraging.xp,
      skyblockSkillsFishingXp: profile.playerData.skills.fishing.xp,
      skyblockSkillsEnchantingXp: profile.playerData.skills.enchanting.xp,
      skyblockSkillsAlchemyXp: profile.playerData.skills.alchemy.xp,
      skyblockSkillsCarpentryXp: profile.playerData.skills.carpentry.xp,
      skyblockSkillsRunecraftingXp: profile.playerData.skills.runecrafting.xp,
      skyblockSkillsSocialXp: profile.playerData.skills.social.xp,
      skyblockSkillsTamingXp: profile.playerData.skills.taming.xp,

      skyblockSlayerZombieLevel: profile.slayers.zombie.level.level,
      skyblockSlayerSpiderLevel: profile.slayers.spider.level.level,
      skyblockSlayerWolfLevel: profile.slayers.wolf.level.level,
      skyblockSlayerEndermanLevel: profile.slayers.enderman.level.level,
      skyblockSlayerBlazeLevel: profile.slayers.blaze.level.level,
      skyblockSlayerVampireLevel: profile.slayers.vampire.level.level,

      skyblockSlayerZombieXp: profile.slayers.zombie.level.xp,
      skyblockSlayerSpiderXp: profile.slayers.spider.level.xp,
      skyblockSlayerWolfXp: profile.slayers.wolf.level.xp,
      skyblockSlayerEndermanXp: profile.slayers.enderman.level.xp,
      skyblockSlayerBlazeXp: profile.slayers.blaze.level.xp,
      skyblockSlayerVampireXp: profile.slayers.vampire.level.xp,

      skyblockDungeonsSecrets: profile.dungeons.secrets,
      skyblockDungeonsXp: profile.dungeons.level.xp,
      skyblockDungeonsLevel: profile.dungeons.level.level,

      skyblockDungeonsClassAverageLevel: profile.dungeons.classes.average,
      skyblockDungeonsClassHealerLevel: profile.dungeons.classes.healer.level,
      skyblockDungeonsClassMageLevel: profile.dungeons.classes.mage.level,
      skyblockDungeonsClassBerserkLevel: profile.dungeons.classes.berserk.level,
      skyblockDungeonsClassArcherLevel: profile.dungeons.classes.archer.level,
      skyblockDungeonsClassTankLevel: profile.dungeons.classes.tank.level,

      skyblockDungeonsClassHealerXp: profile.dungeons.classes.healer.xp,
      skyblockDungeonsClassMageXp: profile.dungeons.classes.mage.xp,
      skyblockDungeonsClassBerserkXp: profile.dungeons.classes.berserk.xp,
      skyblockDungeonsClassArcherXp: profile.dungeons.classes.archer.xp,
      skyblockDungeonsClassTankXp: profile.dungeons.classes.tank.xp,

      skyblockDungeonsEssenceDiamond: profile.currencies.diamondEssence,
      skyblockDungeonsEssenceDragon: profile.currencies.dragonEssence,
      skyblockDungeonsEssenceSpider: profile.currencies.spiderEssence,
      skyblockDungeonsEssenceWither: profile.currencies.witherEssence,
      skyblockDungeonsEssenceUndead: profile.currencies.undeadEssence,
      skyblockDungeonsEssenceGold: profile.currencies.goldEssence,
      skyblockDungeonsEssenceIce: profile.currencies.iceEssence,
      skyblockDungeonsEssenceCrimson: profile.currencies.crimsonEssence,

      skyblockCrimsonIsleReputationBarbarian: profile.crimsonIsle.barbariansReputation,
      skyblockCrimsonIsleReputationMage: profile.crimsonIsle.magesReputation,

      skyblockCrimsonIsleKuudraBasic: profile.crimsonIsle.kuudra.basicCompletions,
      skyblockCrimsonIsleKuudraHot: profile.crimsonIsle.kuudra.hotCompletions,
      skyblockCrimsonIsleKuudraBurning: profile.crimsonIsle.kuudra.burningCompletions,
      skyblockCrimsonIsleKuudraFiery: profile.crimsonIsle.kuudra.fieryCompletions,
      skyblockCrimsonIsleKuudraInfernal: profile.crimsonIsle.kuudra.infernalCompletions,

      skyblockNetworth: networth.networth,
      skyblockNetwrothArmor: networth.types.armor.total,
      skyblockNetwrothEquipment: networth.types.equipment.total,
      skyblockNetwrothWardrobe: networth.types.wardrobe.total,
      skyblockNetwrothInventory: networth.types.inventory.total,
      skyblockNetwrothEnderchest: networth.types.enderchest.total,
      skyblockNetwrothAccessories: networth.types.accessories.total,
      skyblockNetwrothPersonalVault: networth.types.personal_vault.total,
      skyblockNetwrothFishingBag: networth.types.fishing_bag.total,
      skyblockNetwrothStorage: networth.types.storage.total,
      skyblockNetwrothMuseum: networth.types.museum.total,
      skyblockNetwrothSacks: networth.types.sacks.total,
      skyblockNetwrothEssence: networth.types.essence.total,
      skyblockNetwrothPets: networth.types.pets.total,

      skyblockNetworthNetworthUnsoulbound: networth.unsoulboundNetworth,
      skyblockNetwrothArmorUnsoulbound: networth.types.armor.unsoulboundTotal,
      skyblockNetwrothEquipmentUnsoulbound: networth.types.equipment.unsoulboundTotal,
      skyblockNetwrothWardrobeUnsoulbound: networth.types.wardrobe.unsoulboundTotal,
      skyblockNetwrothInventoryUnsoulbound: networth.types.inventory.unsoulboundTotal,
      skyblockNetwrothEnderchestUnsoulbound: networth.types.enderchest.unsoulboundTotal,
      skyblockNetwrothAccessoriesUnsoulbound: networth.types.accessories.unsoulboundTotal,
      skyblockNetwrothPersonalVaultUnsoulbound: networth.types.personal_vault.unsoulboundTotal,
      skyblockNetwrothFishingBagUnsoulbound: networth.types.fishing_bag.unsoulboundTotal,
      skyblockNetwrothStorageUnsoulbound: networth.types.storage.unsoulboundTotal,
      skyblockNetwrothMuseumUnsoulbound: networth.types.museum.unsoulboundTotal,
      skyblockNetwrothSacksUnsoulbound: networth.types.sacks.unsoulboundTotal,
      skyblockNetwrothEssenceUnsoulbound: networth.types.essence.unsoulboundTotal,
      skyblockNetwrothPetsUnsoulbound: networth.types.pets.unsoulboundTotal,

      skyblockChocolateFactoryLevel: profile.chocolateFactory.prestige,
      skyblockChocolateFactoryChocolateCurrent: profile.chocolateFactory.currentChocolate,
      skyblockChocolateFactoryChocolateSincePrestige: profile.chocolateFactory.chocolateSincePrestige,
      skyblockChocolateFactoryChocolateTotal: profile.chocolateFactory.totalChocolate,

      skyblockChocolateFactoryEmployeeBro: profile.chocolateFactory.employees.bro,
      skyblockChocolateFactoryEmployeeCousin: profile.chocolateFactory.employees.cousin,
      skyblockChocolateFactoryEmployeeSis: profile.chocolateFactory.employees.sis,
      skyblockChocolateFactoryEmployeeFather: profile.chocolateFactory.employees.father,
      skyblockChocolateFactoryEmployeeGrandma: profile.chocolateFactory.employees.grandma,
      skyblockChocolateFactoryEmployeeUncle: profile.chocolateFactory.employees.uncle,
      skyblockChocolateFactoryEmployeeDog: profile.chocolateFactory.employees.dog,

      skyblockJacobMedalsGold: profile.jacobContests.medals.gold,
      skyblockJacobMedalsSilver: profile.jacobContests.medals.silver,
      skyblockJacobMedalsBronze: profile.jacobContests.medals.bronze,

      skyblockJacobPerksLevelCap: profile.jacobContests.perks?.farmingLevelCap,
      skyblockJacobPerksDoubleDrops: profile.jacobContests.perks?.doubleDrops,

      skyblockJacobPersonalBestNetherWart: profile.jacobContests.personalBests.NETHER_STALK ?? 0,
      skyblockJacobPersonalBestCocoBeans: profile.jacobContests.personalBests["INK_SACK:3"] ?? 0,
      skyblockJacobPersonalBestMushroom: profile.jacobContests.personalBests?.MUSHROOM_COLLECTION ?? 0,
      skyblockJacobPersonalBestWheat: profile.jacobContests.personalBests?.WHEAT ?? 0,
      skyblockJacobPersonalBestPotato: profile.jacobContests.personalBests?.POTATO_ITEM ?? 0,
      skyblockJacobPersonalBestPumpkin: profile.jacobContests.personalBests?.PUMPKIN ?? 0,
      skyblockJacobPersonalBestCarrot: profile.jacobContests.personalBests?.CARROT_ITEM ?? 0,
      skyblockJacobPersonalBestCactus: profile.jacobContests.personalBests?.CACTUS ?? 0,
      skyblockJacobPersonalBestMelon: profile.jacobContests.personalBests?.MELON ?? 0,
      skyblockJacobPersonalBestSugarCane: profile.jacobContests.personalBests?.SUGAR_CANE ?? 0
    };
  }
}

export default LinkedManager;
