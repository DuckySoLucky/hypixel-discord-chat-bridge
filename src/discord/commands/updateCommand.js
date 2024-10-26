const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI.js");
const { replaceVariables } = require("../../contracts/helperFunctions.js");
const { SuccessEmbed } = require("../../contracts/embedHandler.js");
const getDungeons = require("../../../API/stats/dungeons.js");
const getCrimson = require("../../../API/stats/crimson.js");
const getSkills = require("../../../API/stats/skills.js");
const getSlayer = require("../../../API/stats/slayer.js");
const { EmbedBuilder } = require("discord.js");
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
          "The linked data file does not exist. Please contact an administrator.",
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
        config.verification.verifiedRole,
        config.verification.guildMemberRole,
        ...config.verification.ranks.map((r) => r.role),
        ...config.verification.levelRoles.map((r) => r.roleId),
      ];

      for (const role of roles) {
        if (role === config.verification.verifiedRole && config.verification.removeVerificationRole === false) {
          continue;
        }

        if (interaction.member.roles.cache.has(role)) {
          await interaction.member.roles.remove(role, "Updated Roles");
        }
      }

      if (uuid === undefined) {
        interaction.member.setNickname(null, "Updated Roles");

        throw new HypixelDiscordChatBridgeError("You are not linked to a Minecraft account.");
      }

      if (!interaction.member.roles.cache.has(config.verification.verifiedRole)) {
        await interaction.member.roles.add(config.verification.verifiedRole, "Updated Roles");
      }

      const [hypixelGuild, player, sbProfile] = await Promise.all([
        hypixelRebornAPI.getGuild("player", bot.username),
        hypixelRebornAPI.getPlayer(uuid),
        getLatestProfile(uuid).catch(() => null),
      ]);

      const [skills, slayer, dungeons, crimson] = await Promise.all([
        sbProfile ? getSkills(sbProfile.profile) : null,
        sbProfile ? getSlayer(sbProfile.profile) : null,
        sbProfile ? getDungeons(sbProfile.profile) : null,
        sbProfile ? getCrimson(sbProfile.profile) : null,
      ]);

      if (hypixelGuild === undefined) {
        throw new HypixelDiscordChatBridgeError("Guild not found.");
      }

      const guildMember = hypixelGuild.members.find((m) => m.uuid === uuid);
      if (guildMember) {
        await interaction.member.roles.add(config.verification.guildMemberRole, "Updated Roles");

        if (config.verification.ranks.length > 0 && guildMember.rank) {
          const rank = config.verification.ranks.find((r) => r.name.toLowerCase() == guildMember.rank.toLowerCase());
          if (rank) {
            for (const role of config.verification.ranks) {
              if (interaction.member.roles.cache.has(role.role)) {
                await interaction.member.roles.remove(role.role, "Updated Roles");
              }
            }

            await interaction.member.roles.add(rank.role, "Updated Roles");
          }
        }
      } else {
        if (interaction.member.roles.cache.has(config.verification.guildMemberRole)) {
          await interaction.member.roles.remove(config.verification.guildMemberRole, "Updated Roles");
        }

        if (config.verification.ranks.length > 0) {
          for (const role of config.verification.ranks) {
            if (interaction.member.roles.cache.has(role.role)) {
              await interaction.member.roles.remove(role.role, "Updated Roles");
            }
          }
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

        skywarsStar: player?.stats?.skywars?.level || 0,
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

        skyblockLevel: Math.floor((sbProfile?.profile?.leveling?.experience || 0) / 100),

        skyblockSkillsFarming: skills?.farming || 0,
        skyblockSkillsMining: skills?.mining || 0,
        skyblockSkillsCombat: skills?.combat || 0,
        skyblockSkillsForaging: skills?.foraging || 0,
        skyblockSkillsFishing: skills?.fishing || 0,
        skyblockSkillsEnchanting: skills?.enchanting || 0,
        skyblockSkillsAlchemy: skills?.alchemy || 0,
        skyblockSkillsCarpentry: skills?.carpentry || 0,
        skyblockSkillsRunecrafting: skills?.runecrafting || 0,
        skyblockSkillsSocial: skills?.social || 0,
        skyblockSkillsTaming: skills?.taming || 0,

        skyblockSlayerZombieXp: slayer?.zombie?.xp || 0,
        skyblockSlayerSpiderXp: slayer?.spider?.xp || 0,
        skyblockSlayerWolfXp: slayer?.wolf?.xp || 0,
        skyblockSlayerEndermanXp: slayer?.enderman?.xp || 0,
        skyblockSlayerBlazeXp: slayer?.blaze?.xp || 0,
        skyblockSlayerVampireXp: slayer?.vampire?.xp || 0,

        skyblockSlayerZombieLevel: slayer?.zombie?.level || 0,
        skyblockSlayerSpiderLevel: slayer?.spider?.level || 0,
        skyblockSlayerWolfLevel: slayer?.wolf?.level || 0,
        skyblockSlayerEndermanLevel: slayer?.enderman?.level || 0,
        skyblockSlayerBlazeLevel: slayer?.blaze?.level || 0,
        skyblockSlayerVampireLevel: slayer?.vampire?.level || 0,

        skyblockDungeonsClassHealerXp: dungeons?.classes?.healer?.xp || 0,
        skyblockDungeonsClassMageXp: dungeons?.classes?.mage?.xp || 0,
        skyblockDungeonsClassBerserkXp: dungeons?.classes?.berserk?.xp || 0,
        skyblockDungeonsClassArcherXp: dungeons?.classes?.archer?.xp || 0,
        skyblockDungeonsClassTankXp: dungeons?.classes?.tank?.xp || 0,

        skyblockDungeonsClassAverage: dungeons?.classes?.healer?.xp || 0,
        skyblockDungeonsClassHealerLevel: dungeons?.classes?.healer?.level || 0,
        skyblockDungeonsClassMageLevel: dungeons?.classes?.mage?.level || 0,
        skyblockDungeonsClassBerserkLevel: dungeons?.classes?.berserk?.level || 0,
        skyblockDungeonsClassArcherLevel: dungeons?.classes?.archer?.level || 0,
        skyblockDungeonsClassTankLevel: dungeons?.classes?.tank?.level || 0,

        skyblockDungeonsEssenceDiamond: dungeons?.essence?.diamond || 0,
        skyblockDungeonsEssenceDragon: dungeons?.essence?.dragon || 0,
        skyblockDungeonsEssenceSpider: dungeons?.essence?.spider || 0,
        skyblockDungeonsEssenceWither: dungeons?.essence?.wither || 0,
        skyblockDungeonsEssenceUndead: dungeons?.essence?.undead || 0,
        skyblockDungeonsEssenceGold: dungeons?.essence?.gold || 0,
        skyblockDungeonsEssenceIce: dungeons?.essence?.ice || 0,
        skyblockDungeonsEssenceCrimson: dungeons?.essence?.crimson || 0,

        skyblockDungeonsSecrets: dungeons?.secrets_found || 0,
        skyblockDungeonsXp: dungeons?.catacombs?.skill?.xp || 0,
        skyblockDungeonsLevel: dungeons?.catacombs?.skill?.level || 0,

        skyblockCrimsonIsleReputationBarbarian: crimson?.reputation?.barbarian || 0,
        skyblockCrimsonIsleReputationMage: crimson?.reputation?.mage || 0,

        skyblockCrimsonIsleKuudrabasic: crimson?.kuudra?.basic || 0,
        skyblockCrimsonIsleKuudrahot: crimson?.kuudra?.hot || 0,
        skyblockCrimsonIsleKuudraburning: crimson?.kuudra?.burning || 0,
        skyblockCrimsonIsleKuudrafiery: crimson?.kuudra?.fiery || 0,
        skyblockCrimsonIsleKuudrainfernal: crimson?.kuudra?.infernal || 0,
      };

      if (config.verification.levelRoles.length > 0) {
        for (const role of config.verification.levelRoles) {
          if (stats[role.type] >= role.requirement) {
            await interaction.member.roles.add(role.roleId, "Updated Roles");
          }
        }
      }

      interaction.member.setNickname(
        replaceVariables(config.verification.name, {
          ...stats,
          duelsTitle: player.stats?.duels?.division || "",
          rank: player.rank,
          username: player.nickname,
          guildRank: hypixelGuild.members.find((m) => m.uuid === uuid)?.rank ?? "Unknown",
          guildName: hypixelGuild.name,
        }),
        "Updated Roles",
      );

      const updateRole = new SuccessEmbed(
        `<@${interaction.user.id}>'s roles have been successfully synced with \`${player.nickname ?? "Unknown"}\`!`,
        { text: `by @.kathund | /help [command] for more information`, iconURL: "https://i.imgur.com/uUuZx2E.png" },
      );

      await interaction.followUp({ embeds: [updateRole], ephemeral: true });
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setColor(15548997)
        .setAuthor({ name: "An Error has occurred" })
        .setDescription(`\`\`\`${error}\`\`\``)
        .setFooter({
          text: `by @.kathund | /help [command] for more information`,
          iconURL: "https://i.imgur.com/uUuZx2E.png",
        });

      await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
