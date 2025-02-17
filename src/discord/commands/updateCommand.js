const { formatNumber, replaceVariables } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { SuccessEmbed, ErrorEmbed } = require("../../contracts/embedHandler.js");
const getChocolateFactory = require("../../../API/stats/chocolateFactory.js");
const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI.js");
const getDungeons = require("../../../API/stats/dungeons.js");
const getCrimson = require("../../../API/stats/crimson.js");
const getSkills = require("../../../API/stats/skills.js");
const getSlayer = require("../../../API/stats/slayer.js");
const getJacob = require("../../../API/stats/jacob.js");
const { getNetworth } = require("skyhelper-networth");
const config = require("../../../config.json");
const { readFileSync } = require("fs");

module.exports = {
  name: "update",
  verificationCommand: true,
  description: "Update your current roles",

  execute: async (interaction, user) => {
    try {
      const linkedData = readFileSync("data/linked.json");
      if (!linkedData) {
        throw new HypixelDiscordChatBridgeError(
          "The linked data file does not exist. Please contact an administrator."
        );
      }

      const linked = JSON.parse(linkedData);
      if (!linked) {
        throw new HypixelDiscordChatBridgeError("The linked data file is malformed. Please contact an administrator.");
      }

      if (user !== undefined) {
        interaction.user = user;
        interaction.member = await guild.members.fetch(interaction.user.id);
      }

      if (!interaction.member) {
        interaction.member = await guild.members.fetch(interaction.user.id);
      }

      const uuid = linked[interaction.user.id];

      const roles = [
        config.verification.guildMemberRole,
        ...config.verification.ranks.map((r) => r.role),
        ...config.verification.levelRoles.map((r) => r.roleId)
      ];
      const giveRoles = [];

      if (uuid === undefined) {
        interaction.member.setNickname(null, "Updated Roles");

        if (interaction.member.roles.cache.has(config.verification.verifiedRole)) {
          await interaction.member.roles.remove(config.verification.verifiedRole, "Updated Roles");
        }

        for (const role of roles) {
          if (interaction.member.roles.cache.has(role)) await interaction.member.roles.remove(role, "Updated Roles");
        }

        throw new HypixelDiscordChatBridgeError("You are not linked to a Minecraft account.");
      }

      if (!interaction.member.roles.cache.has(config.verification.verifiedRole)) {
        giveRoles.push(config.verification.verifiedRole);
        await interaction.member.roles.add(config.verification.verifiedRole, "Updated Roles");
      }

      const [hypixelGuild, player, sbProfile] = await Promise.all([
        hypixelRebornAPI.getGuild("player", bot.username),
        hypixelRebornAPI.getPlayer(uuid),
        getLatestProfile(uuid).catch(() => null)
      ]);

      const [skills, slayer, dungeons, crimson, networth, chocolateFactory, jacob] = await Promise.all([
        sbProfile ? getSkills(sbProfile.profile) : null,
        sbProfile ? getSlayer(sbProfile.profile) : null,
        sbProfile ? getDungeons(sbProfile.profile) : null,
        sbProfile ? getCrimson(sbProfile.profile) : null,
        sbProfile
          ? getNetworth(sbProfile.profile, sbProfile.profileData?.banking?.balance || 0, {
              onlyNetworth: true,
              v2Endpoint: true,
              cache: true
            })
          : null,
        sbProfile ? getChocolateFactory(sbProfile.profile) : null,
        sbProfile ? getJacob(sbProfile.profile) : null
      ]);

      if (hypixelGuild === undefined) {
        throw new HypixelDiscordChatBridgeError("Guild not found.");
      }

      const guildMember = hypixelGuild.members.find((m) => m.uuid === uuid);
      if (guildMember) {
        giveRoles.push(config.verification.guildMemberRole);
        await interaction.member.roles.add(config.verification.guildMemberRole, "Updated Roles");

        if (config.verification.ranks.length > 0 && guildMember.rank) {
          const rank = config.verification.ranks.find((r) => r.name.toLowerCase() == guildMember.rank.toLowerCase());
          if (rank) {
            for (const role of config.verification.ranks) {
              if (interaction.member.roles.cache.has(role.role)) {
                await interaction.member.roles.remove(role.role, "Updated Roles");
              }
            }

            giveRoles.push(rank.role);
            await interaction.member.roles.add(rank.role, "Updated Roles");
          }
        }
      } else {
        if (interaction.member.roles.cache.has(config.verification.guildMemberRole)) {
          await interaction.member.roles.remove(config.verification.guildMemberRole, "Updated Roles");
        }
      }

      const stats = {
        bedwarsStar: player?.stats?.bedwars?.level || 0,
        bedwarsTokens: player?.stats?.bedwars?.tokens || 0,
        bedwarsKills: player?.stats?.bedwars?.kills || 0,
        bedwarsDeaths: player?.stats?.bedwars?.deaths || 0,
        bedwarsKDRatio: player?.stats?.bedwars?.KDRatio || 0,
        bedwarsFinalKills: player?.stats?.bedwars?.finalKills || 0,
        bedwarsFinalDeathss: player?.stats?.bedwars?.finalDeaths || 0,
        bedwarsFinalKDRatio: player?.stats?.bedwars?.finalKDRatio || 0,
        bedwarsWins: player?.stats?.bedwars?.wins || 0,
        bedwarsLosses: player?.stats?.bedwars?.losses || 0,
        bedwarsWLRatio: player?.stats?.bedwars?.WLRatio || 0,
        bedwarsBedsBroken: player?.stats?.bedwars?.beds.broken || 0,
        bedwarsBedsLost: player?.stats?.bedwars?.beds.lost || 0,
        bedwarsBedsBLRatio: player?.stats?.bedwars?.beds.BLRatio || 0,
        bedwarsPlayedGames: player?.stats?.bedwars?.playedGames || 0,

        skywarsLevel: player?.stats?.skywars?.level || 0,
        skywarsCoins: player?.stats?.skywars?.coins || 0,
        skywarsTokens: player?.stats?.skywars?.tokens || 0,
        skywarsSouls: player?.stats?.skywars?.souls || 0,
        skywarsOpals: player?.stats?.skywars?.opals || 0,
        skywarsKills: player?.stats?.skywars?.kills || 0,
        skywarsDeaths: player?.stats?.skywars?.deaths || 0,
        skywarsKDRatio: player?.stats?.skywars?.KDRatio || 0,
        skywarsWins: player?.stats?.skywars?.wins || 0,
        skywarsLosses: player?.stats?.skywars?.losses || 0,
        skywarsWLRatio: player?.stats?.skywars?.WLRatio || 0,
        skywarsPlayedGames: player?.stats?.skywars?.playedGames || 0,

        duelsKills: player.stats?.duels?.kills || 0,
        duelsDeaths: player.stats?.duels?.deaths || 0,
        duelsKDRatio: player.stats?.duels?.KDRatio || 0,
        duelsWins: player.stats?.duels?.wins || 0,
        duelsLosses: player.stats?.duels?.losses || 0,
        duelsWLRatio: player.stats?.duels?.WLRatio || 0,
        duelsPlayedGames: player.stats?.duels?.playedGames || 0,

        level: player?.level || 0,
        karma: player?.karma || 0,
        achievementPoints: player?.achievementPoints || 0,

        skyblockBank: networth?.bank || 0,
        skyblockPurse: networth?.purse || 0,
        skyblockLevel: Math.floor((sbProfile?.profile?.leveling?.experience || 0) / 100),

        skyblockSkillsAverageLevel: 0,
        skyblockSkillsFarmingLevel: skills?.farming?.level || 0,
        skyblockSkillsMiningLevel: skills?.mining?.level || 0,
        skyblockSkillsCombatLevel: skills?.combat?.level || 0,
        skyblockSkillsForagingLevel: skills?.foraging?.level || 0,
        skyblockSkillsFishingLevel: skills?.fishing?.level || 0,
        skyblockSkillsEnchantingLevel: skills?.enchanting?.level || 0,
        skyblockSkillsAlchemyLevel: skills?.alchemy?.level || 0,
        skyblockSkillsCarpentryLevel: skills?.carpentry?.level || 0,
        skyblockSkillsRunecraftingLevel: skills?.runecrafting?.level || 0,
        skyblockSkillsSocialLevel: skills?.social?.level || 0,
        skyblockSkillsTamingLevel: skills?.taming?.level || 0,

        skyblockSkillsFarmingXp: skills?.farming?.xp || 0,
        skyblockSkillsMiningXp: skills?.mining?.xp || 0,
        skyblockSkillsCombatXp: skills?.combat?.xp || 0,
        skyblockSkillsForagingXp: skills?.foraging?.xp || 0,
        skyblockSkillsFishingXp: skills?.fishing?.xp || 0,
        skyblockSkillsEnchantingXp: skills?.enchanting?.xp || 0,
        skyblockSkillsAlchemyXp: skills?.alchemy?.xp || 0,
        skyblockSkillsCarpentryXp: skills?.carpentry?.xp || 0,
        skyblockSkillsRunecraftingXp: skills?.runecrafting?.xp || 0,
        skyblockSkillsSocialXp: skills?.social?.xp || 0,
        skyblockSkillsTamingXp: skills?.taming?.xp || 0,

        skyblockSlayerZombieLevel: slayer?.zombie?.level || 0,
        skyblockSlayerSpiderLevel: slayer?.spider?.level || 0,
        skyblockSlayerWolfLevel: slayer?.wolf?.level || 0,
        skyblockSlayerEndermanLevel: slayer?.enderman?.level || 0,
        skyblockSlayerBlazeLevel: slayer?.blaze?.level || 0,
        skyblockSlayerVampireLevel: slayer?.vampire?.level || 0,

        skyblockSlayerZombieXp: slayer?.zombie?.xp || 0,
        skyblockSlayerSpiderXp: slayer?.spider?.xp || 0,
        skyblockSlayerWolfXp: slayer?.wolf?.xp || 0,
        skyblockSlayerEndermanXp: slayer?.enderman?.xp || 0,
        skyblockSlayerBlazeXp: slayer?.blaze?.xp || 0,
        skyblockSlayerVampireXp: slayer?.vampire?.xp || 0,

        skyblockDungeonsSecrets: dungeons?.secrets_found || 0,
        skyblockDungeonsXp: dungeons?.catacombs?.skill?.xp || 0,
        skyblockDungeonsLevel: dungeons?.catacombs?.skill?.level || 0,

        skyblockDungeonsClassAverageLevel: 0,
        skyblockDungeonsClassHealerLevel: dungeons?.classes?.healer?.level || 0,
        skyblockDungeonsClassMageLevel: dungeons?.classes?.mage?.level || 0,
        skyblockDungeonsClassBerserkLevel: dungeons?.classes?.berserk?.level || 0,
        skyblockDungeonsClassArcherLevel: dungeons?.classes?.archer?.level || 0,
        skyblockDungeonsClassTankLevel: dungeons?.classes?.tank?.level || 0,

        skyblockDungeonsClassHealerXp: dungeons?.classes?.healer?.xp || 0,
        skyblockDungeonsClassMageXp: dungeons?.classes?.mage?.xp || 0,
        skyblockDungeonsClassBerserkXp: dungeons?.classes?.berserk?.xp || 0,
        skyblockDungeonsClassArcherXp: dungeons?.classes?.archer?.xp || 0,
        skyblockDungeonsClassTankXp: dungeons?.classes?.tank?.xp || 0,

        skyblockDungeonsEssenceDiamond: dungeons?.essence?.diamond || 0,
        skyblockDungeonsEssenceDragon: dungeons?.essence?.dragon || 0,
        skyblockDungeonsEssenceSpider: dungeons?.essence?.spider || 0,
        skyblockDungeonsEssenceWither: dungeons?.essence?.wither || 0,
        skyblockDungeonsEssenceUndead: dungeons?.essence?.undead || 0,
        skyblockDungeonsEssenceGold: dungeons?.essence?.gold || 0,
        skyblockDungeonsEssenceIce: dungeons?.essence?.ice || 0,
        skyblockDungeonsEssenceCrimson: dungeons?.essence?.crimson || 0,

        skyblockCrimsonIsleReputationBarbarian: crimson?.reputation?.barbarian || 0,
        skyblockCrimsonIsleReputationMage: crimson?.reputation?.mage || 0,

        skyblockCrimsonIsleKuudraBasic: crimson?.kuudra?.basic || 0,
        skyblockCrimsonIsleKuudraHot: crimson?.kuudra?.hot || 0,
        skyblockCrimsonIsleKuudraBurning: crimson?.kuudra?.burning || 0,
        skyblockCrimsonIsleKuudraFiery: crimson?.kuudra?.fiery || 0,
        skyblockCrimsonIsleKuudraInfernal: crimson?.kuudra?.infernal || 0,

        skyblockNetworth: networth?.networth || 0,
        skyblockNetwrothArmor: networth?.types?.armor?.total || 0,
        skyblockNetwrothEquipment: networth?.types?.equipment?.total || 0,
        skyblockNetwrothWardrobe: networth?.types?.wardrobe?.total || 0,
        skyblockNetwrothInventory: networth?.types?.inventory?.total || 0,
        skyblockNetwrothEnderchest: networth?.types?.enderchest?.total || 0,
        skyblockNetwrothAccessories: networth?.types?.accessories?.total || 0,
        skyblockNetwrothPersonalVault: networth?.types?.personal_vault?.total || 0,
        skyblockNetwrothFishingBag: networth?.types?.fishing_bag?.total || 0,
        skyblockNetwrothStorage: networth?.types?.storage?.total || 0,
        skyblockNetwrothMuseum: networth?.types?.museum?.total || 0,
        skyblockNetwrothSacks: networth?.types?.sacks?.total || 0,
        skyblockNetwrothEssence: networth?.types?.essence?.total || 0,
        skyblockNetwrothPets: networth?.types?.pets?.total || 0,

        skyblockNetworthNetworthUnsoulbound: networth?.unsoulboundNetworth || 0,
        skyblockNetwrothArmorUnsoulbound: networth?.types?.armor?.unsoulboundTotal || 0,
        skyblockNetwrothEquipmentUnsoulbound: networth?.types?.equipment?.unsoulboundTotal || 0,
        skyblockNetwrothWardrobeUnsoulbound: networth?.types?.wardrobe?.unsoulboundTotal || 0,
        skyblockNetwrothInventoryUnsoulbound: networth?.types?.inventory?.unsoulboundTotal || 0,
        skyblockNetwrothEnderchestUnsoulbound: networth?.types?.enderchest?.unsoulboundTotal || 0,
        skyblockNetwrothAccessoriesUnsoulbound: networth?.types?.accessories?.unsoulboundTotal || 0,
        skyblockNetwrothPersonalVaultUnsoulbound: networth?.types?.personal_vault?.unsoulboundTotal || 0,
        skyblockNetwrothFishingBagUnsoulbound: networth?.types?.fishing_bag?.unsoulboundTotal || 0,
        skyblockNetwrothStorageUnsoulbound: networth?.types?.storage?.unsoulboundTotal || 0,
        skyblockNetwrothMuseumUnsoulbound: networth?.types?.museum?.unsoulboundTotal || 0,
        skyblockNetwrothSacksUnsoulbound: networth?.types?.sacks?.unsoulboundTotal || 0,
        skyblockNetwrothEssenceUnsoulbound: networth?.types?.essence?.unsoulboundTotal || 0,
        skyblockNetwrothPetsUnsoulbound: networth?.types?.pets?.unsoulboundTotal || 0,

        skyblockChocolateFactoryLevel: chocolateFactory?.level || 0,
        skyblockChocolateFactoryChocolateCurrent: chocolateFactory?.chocolate?.current || 0,
        skyblockChocolateFactoryChocolateSincePrestige: chocolateFactory?.chocolate?.sincePrestige || 0,
        skyblockChocolateFactoryChocolateTotal: chocolateFactory?.chocolate?.total || 0,

        skyblockChocolateFactoryEmployeeBro: chocolateFactory?.employees?.bro || 0,
        skyblockChocolateFactoryEmployeeCousin: chocolateFactory?.employees?.cousin || 0,
        skyblockChocolateFactoryEmployeeSis: chocolateFactory?.employees?.sis || 0,
        skyblockChocolateFactoryEmployeeFather: chocolateFactory?.employees?.father || 0,
        skyblockChocolateFactoryEmployeeGrandma: chocolateFactory?.employees?.grandma || 0,

        skyblockJacobMedalsGold: jacob?.medals?.gold || 0,
        skyblockJacobMedalsSilver: jacob?.medals?.silver || 0,
        skyblockJacobMedalsBronze: jacob?.medals?.bronze || 0,

        skyblockJacobPerksLevelCap: jacob?.perks?.levelCap || 0,
        skyblockJacobPerksDoubleDrops: jacob?.perks?.doubleDrops || 0,

        skyblockJacobPersonalBestNetherWart: jacob?.personalBests?.netherWart || 0,
        skyblockJacobPersonalBestCocoBeans: jacob?.personalBests?.cocoBeans || 0,
        skyblockJacobPersonalBestMushroom: jacob?.personalBests?.mushroom || 0,
        skyblockJacobPersonalBestWheat: jacob?.personalBests?.wheat || 0,
        skyblockJacobPersonalBestPotato: jacob?.personalBests?.potato || 0,
        skyblockJacobPersonalBestPumpkin: jacob?.personalBests?.pumpkin || 0,
        skyblockJacobPersonalBestCarrot: jacob?.personalBests?.carrot || 0,
        skyblockJacobPersonalBestCactus: jacob?.personalBests?.cactus || 0,
        skyblockJacobPersonalBestMelon: jacob?.personalBests?.melon || 0,
        skyblockJacobPersonalBestSugarCane: jacob?.personalBests?.sugarCane || 0
      };

      stats["skyblockSkillsAverageLevel"] = (
        Object.keys(stats)
          .filter((stat) => stat.startsWith("skyblockSkills"))
          .filter((stat) => stat.endsWith("Level"))
          .filter((skill) => !["skyblockSkillsRunecraftingLevel", "skyblockSkillsSocialLevel"].includes(skill))
          .map((skill) => stats[skill] || 0)
          .reduce((a, b) => a + b, 0) /
        Object.keys(stats)
          .filter((stat) => stat.startsWith("skyblockSkills"))
          .filter((stat) => stat.endsWith("Level"))
          .filter((skill) => !["skyblockSkillsRunecraftingLevel", "skyblockSkillsSocialLevel"].includes(skill)).length
      ).toFixed(2);

      stats["skyblockDungeonsClassAverageLevel"] = (
        Object.keys(stats)
          .filter((stat) => stat.startsWith("skyblockDungeonsClass"))
          .filter((stat) => stat.endsWith("Level"))
          .map((className) => stats[className] || 0)
          .reduce((a, b) => a + b, 0) /
        Object.keys(stats)
          .filter((stat) => stat.startsWith("skyblockDungeonsClass"))
          .filter((stat) => stat.endsWith("Level")).length
      ).toFixed(2);

      if (config.verification.levelRoles.length > 0) {
        for (const role of config.verification.levelRoles) {
          if (stats[role.type] >= role.requirement) {
            giveRoles.push(role.roleId);
            await interaction.member.roles.add(role.roleId, "Updated Roles");
          }
        }
      }

      interaction.member.setNickname(
        replaceVariables(config.verification.name, {
          ...stats,
          rank: player.rank,
          username: player.nickname,
          guildRank: hypixelGuild.members.find((m) => m.uuid === uuid)?.rank ?? "",

          duelsTitle: player.stats?.duels?.division || "",

          skyblockPurseFormatted: formatNumber(stats.skyblockPurse),
          skyblockBankFormatted: formatNumber(stats.skyblockBank),

          skyblockSkillsFarmingXpFormated: formatNumber(stats.skyblockSkillsFarmingXp),
          skyblockSkillsMiningXpFormated: formatNumber(stats.skyblockSkillsMiningXp),
          skyblockSkillsCombatXpFormated: formatNumber(stats.skyblockSkillsCombatXp),
          skyblockSkillsForagingXpFormated: formatNumber(stats.skyblockSkillsForagingXp),
          skyblockSkillsFishingXpFormated: formatNumber(stats.skyblockSkillsFishingXp),
          skyblockSkillsEnchantingXpFormated: formatNumber(stats.skyblockSkillsEnchantingXp),
          skyblockSkillsAlchemyXpFormated: formatNumber(stats.skyblockSkillsAlchemyXp),
          skyblockSkillsCarpentryXpFormated: formatNumber(stats.skyblockSkillsCarpentryXp),
          skyblockSkillsRunecraftingXpFormated: formatNumber(stats.skyblockSkillsRunecraftingXp),
          skyblockSkillsSocialXpFormated: formatNumber(stats.skyblockSkillsSocialXp),
          skyblockSkillsTamingXpFormated: formatNumber(stats.skyblockSkillsTamingXp),

          skyblockSlayerZombieXpFormatted: formatNumber(stats.skyblockSlayerZombieXp),
          skyblockSlayerSpiderXpFormatted: formatNumber(stats.skyblockSlayerSpiderXp),
          skyblockSlayerWolfXpFormatted: formatNumber(stats.skyblockSlayerWolfXp),
          skyblockSlayerEndermanXpFormatted: formatNumber(stats.skyblockSlayerEndermanXp),
          skyblockSlayerBlazeXpFormatted: formatNumber(stats.skyblockSlayerBlazeXp),
          skyblockSlayerVampireXpFormatted: formatNumber(stats.skyblockSlayerVampireXp),

          skyblockDungeonsXpFormatted: formatNumber(stats.skyblockDungeonsXp),

          skyblockDungeonsClassHealerXpFormatted: formatNumber(stats.skyblockDungeonsClassHealerXp),
          skyblockDungeonsClassMageXpFormatted: formatNumber(stats.skyblockDungeonsClassMageXp),
          skyblockDungeonsClassBerserkXpFormatted: formatNumber(stats.skyblockDungeonsClassBerserkXp),
          skyblockDungeonsClassArcherXpFormatted: formatNumber(stats.skyblockDungeonsClassArcherXp),
          skyblockDungeonsClassTankXpFormatted: formatNumber(stats.skyblockDungeonsClassTankXp),

          skyblockNetworthFormatted: formatNumber(stats.skyblockNetworth),
          skyblockNetworthNetworthUnsoulboundFormatted: formatNumber(stats.skyblockNetworthNetworthUnsoulbound),

          skyblockJacobPersonalBestNetherWartFormatted: formatNumber(stats.skyblockJacobPersonalBestNetherWart),
          skyblockJacobPersonalBestCocoBeansFormatted: formatNumber(stats.skyblockJacobPersonalBestCocoBeans),
          skyblockJacobPersonalBestMushroomFormatted: formatNumber(stats.skyblockJacobPersonalBestMushroom),
          skyblockJacobPersonalBestWheatFormatted: formatNumber(stats.skyblockJacobPersonalBestWheat),
          skyblockJacobPersonalBestPotatoFormatted: formatNumber(stats.skyblockJacobPersonalBestPotato),
          skyblockJacobPersonalBestPumpkinFormatted: formatNumber(stats.skyblockJacobPersonalBestPumpkin),
          skyblockJacobPersonalBestCarrotFormatted: formatNumber(stats.skyblockJacobPersonalBestCarrot),
          skyblockJacobPersonalBestCactusFormatted: formatNumber(stats.skyblockJacobPersonalBestCactus),
          skyblockJacobPersonalBestMelonFormatted: formatNumber(stats.skyblockJacobPersonalBestMelon),
          skyblockJacobPersonalBestSugarCaneFormatted: formatNumber(stats.skyblockJacobPersonalBestSugarCane)
        }),
        "Updated Roles"
      );

      for (const role of roles) {
        if (giveRoles.includes(role)) return;
        if (interaction.member.roles.cache.has(role)) await interaction.member.roles.remove(role, "Updated Roles");
      }

      const updateRole = new SuccessEmbed(
        `<@${interaction.user.id}>'s roles have been successfully synced with \`${player.nickname ?? "Unknown"}\`!`,
        { text: `by @.kathund | /help [command] for more information`, iconURL: "https://i.imgur.com/uUuZx2E.png" }
      );

      await interaction.followUp({ embeds: [updateRole], ephemeral: true });
    } catch (error) {
      const errorEmbed = new ErrorEmbed(`\`\`\`${error}\`\`\``).setFooter({
        text: `by @.kathund | /help [command] for more information`,
        iconURL: "https://i.imgur.com/uUuZx2E.png"
      });

      await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};
