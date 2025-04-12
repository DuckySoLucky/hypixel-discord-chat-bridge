const { formatNumber, replaceVariables } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { SuccessEmbed, ErrorEmbed } = require("../../contracts/embedHandler.js");
const { getChocolateFactory } = require("../../../API/stats/chocolateFactory.js");
const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI.js");
const { getCrimsonIsle, getKuudra } = require("../../../API/stats/crimson.js");
const { getSkillAverage } = require("../../../API/constants/skills.js");
const { getDungeons } = require("../../../API/stats/dungeons.js");
const { getEssence } = require("../../../API/stats/essence.js");
const { getSlayer } = require("../../../API/stats/slayer.js");
const { getSkills } = require("../../../API/stats/skills.js");
const { getJacob } = require("../../../API/stats/jacob.js");
const { getNetworth } = require("skyhelper-networth");
const config = require("../../../config.json");
const fs = require("fs");
const { getUsername } = require("../../contracts/API/mowojangAPI.js");

async function updateRoles({ discordId, uuid }) {
  const member = await guild.members.fetch(discordId);
  if (!member) {
    return;
  }

  const verificationRoles = config.verification.roles;
  const roles = [verificationRoles.guildMember.roleId, ...verificationRoles.custom.flatMap((r) => r.roleId)];
  const addedRoles = [];

  if (!uuid) {
    member.setNickname(null, "Updated Roles");
    if (verificationRoles.verified.enabled && member.roles.cache.has(verificationRoles.verified.roleId)) {
      await member.roles.remove(verificationRoles.verified.roleId, "Updated Roles");
      // console.log("Removed verified role");
    }

    throw new HypixelDiscordChatBridgeError("You are not linked to a Minecraft account.");
  }

  if (verificationRoles.verified.enabled) {
    await member.roles.add(verificationRoles.verified.roleId, "Updated Roles");
    addedRoles.push(verificationRoles.verified.roleId);
    // console.log("Added verified role");
  }

  const [hypixelGuild, player, skyblock] = await Promise.all([
    hypixelRebornAPI.getGuild("player", bot.username, { noCaching: true, noCacheCheck: true }),
    hypixelRebornAPI.getPlayer(uuid),
    getLatestProfile(uuid).catch(() => ({ profile: null, profileData: null }))
  ]);

  if (hypixelGuild === undefined) {
    throw new HypixelDiscordChatBridgeError("Guild not found.");
  }

  const profile = /** @type {import("../../../types/profiles.js").Member} */ (skyblock.profile ?? {});
  const profileData = /** @type {import("../../../types/profiles.js").Profile} */ (skyblock.profileData ?? {});
  const [skills, slayer, dungeons, crimson, networth, chocolateFactory, jacob, essence, kuudra] = await Promise.all([
    getSkills(profile, profileData),
    getSlayer(profile),
    getDungeons(profile),
    getCrimsonIsle(profile),
    getNetworth(profile, profileData?.banking?.balance ?? 0, { onlyNetworth: true, v2Endpoint: true, cache: true }),
    getChocolateFactory(profile),
    getJacob(profile),
    getEssence(profile),
    getKuudra(profile)
  ]);

  const guildMember = hypixelGuild.members.find((m) => m.uuid === uuid);
  if (guildMember) {
    if (verificationRoles.guildMember.enabled) {
      await member.roles.add(verificationRoles.guildMember.roleId, "Updated Roles");
      addedRoles.push(verificationRoles.guildMember.roleId);
      // console.log("Added guild member role");
    }

    const guildRank = verificationRoles.custom.find((r) =>
      r.requirements
        .filter((req) => r.enabled !== false && req.type === "guildRank")
        .map((req) => req.value)
        .includes(guildMember.rank)
    );
    if (guildRank && guildRank.enabled !== false) {
      await member.roles.add(guildRank.roleId, "Updated Roles");
      addedRoles.push(guildRank.roleId);

      // console.log(`Added ${(await guild.roles.fetch(guildRank.roleId)).name}`);
    }
  } else {
    if (verificationRoles.guildMember.enabled) {
      await member.roles.remove(verificationRoles.guildMember.roleId, "Updated Roles");
      // console.log("Removed guild member role");
    }
  }

  const stats = {
    username: player.nickname,
    guildRank: guildMember?.rank ?? "",

    bedwarsStar: player?.stats?.bedwars?.level ?? 0,
    bedwarsTokens: player?.stats?.bedwars?.tokens ?? 0,
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

    skywarsLevel: player?.stats?.skywars?.level ?? 0,
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
    skywarsPlayedGames: player?.stats?.skywars?.gamesPlayed ?? 0,

    duelsDivision: player.stats?.duels?.title ?? "Unknown",
    duelsKills: player.stats?.duels?.kills ?? 0,
    duelsDeaths: player.stats?.duels?.deaths ?? 0,
    duelsKDRatio: player.stats?.duels?.KDRatio ?? 0,
    duelsWins: player.stats?.duels?.wins ?? 0,
    duelsLosses: player.stats?.duels?.losses ?? 0,
    duelsWLRatio: player.stats?.duels?.WLRatio ?? 0,
    duelsPlayedGames: player.stats?.duels?.playedGames ?? 0,

    level: player?.level ?? 0,
    karma: player?.karma ?? 0,
    achievementPoints: player?.achievementPoints ?? 0,

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

    skyblockDungeonsClassAverageLevel: dungeons?.classAverage,
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

  if (verificationRoles.custom.length > 0) {
    for (const role of verificationRoles.custom.filter((r) => r.requirements.some((req) => req.type !== "guildRank"))) {
      if (role.enabled === false) {
        continue;
      }

      const meetsRequirements = role.requirements.every((req) => req.value <= stats[req.type]);
      if (meetsRequirements) {
        await member.roles.add(role.roleId, "Updated Roles");
        addedRoles.push(role.roleId);
        // console.log(
        //   `Added ${(await guild.roles.fetch(role.roleId)).name} cuz he meets the requirements for ${role.requirements.map((req) => `${req.type} >= ${req.value}`).join(" and ")}`
        // );
      }
    }
  }

  member.setNickname(
    replaceVariables(
      config.verification.nickname,
      Object.fromEntries(Object.entries(stats).map(([key, value]) => [key, typeof value === "number" ? formatNumber(value) : value]))
    ),
    "Updated Roles"
  );

  for (const role of roles) {
    if (addedRoles.includes(role)) return;
    if (member.roles.cache.has(role)) {
      await member.roles.remove(role, "Updated Roles");
      // console.log(`Removed ${(await guild.roles.fetch(role)).name}`);
    }
  }
}

module.exports = {
  name: "update",
  verificationCommand: true,
  description: "Update your current roles",

  execute: async (interaction, extra = { discordId: null, hidden: false }) => {
    try {
      const linkedData = fs.readFileSync("data/linked.json");
      if (!linkedData) {
        throw new HypixelDiscordChatBridgeError("The linked data file does not exist. Please contact an administrator.");
      }

      const linked = JSON.parse(linkedData.toString());
      if (!linked) {
        throw new HypixelDiscordChatBridgeError("The linked data file is malformed. Please contact an administrator.");
      }

      const discordId = extra.discordId ?? interaction.user.id;
      const uuid = Object.entries(linked).find(([, value]) => value === discordId)?.[0];
      if (!uuid) {
        throw new HypixelDiscordChatBridgeError("You are not linked to a Minecraft account.");
      }

      await updateRoles({ discordId, uuid });

      if (!extra.hidden) {
        const updateRole = new SuccessEmbed(
          `Successfully synced ${extra.discordId ? `<@${extra.discordId}>` : "your"} roles with \`${await getUsername(uuid)}\`'s stats!`
        ).setFooter({
          text: `by @.kathund | /help [command] for more information`,
          iconURL: "https://i.imgur.com/uUuZx2E.png"
        });

        await interaction.followUp({ embeds: [updateRole], ephemeral: true });
      }
    } catch (error) {
      console.log(error);
      if (!extra.hidden) {
        const errorEmbed = new ErrorEmbed(`\`\`\`${error}\`\`\``).setFooter({
          text: `by @.kathund | /help [command] for more information`,
          iconURL: "https://i.imgur.com/uUuZx2E.png"
        });

        await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
      }
    }
  },

  updateRoles
};
