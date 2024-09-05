const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI.js");
const { replaceVariables } = require("../../contracts/helperFunctions.js");
const { SuccessEmbed } = require("../../contracts/embedHandler.js");
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
      if (uuid === undefined) {
        const roles = [
          config.verification.verifiedRole,
          config.verification.guildMemberRole,
          ...config.verification.ranks.map((r) => r.role),
        ];

        for (const role of roles) {
          if (role === config.verification.verifiedRole && config.verification.removeVerificationRole === false) {
            continue;
          }

          if (interaction.member.roles.cache.has(role)) {
            await interaction.member.roles.remove(role, "Updated Roles");
          }
        }

        interaction.member.setNickname(null, "Updated Roles");

        throw new HypixelDiscordChatBridgeError("You are not linked to a Minecraft account.");
      }

      if (!interaction.member.roles.cache.has(config.verification.verifiedRole)) {
        await interaction.member.roles.add(config.verification.verifiedRole, "Updated Roles");
      }

      const [hypixelGuild, player] = await Promise.all([
        hypixelRebornAPI.getGuild("player", bot.username),
        hypixelRebornAPI.getPlayer(uuid),
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

      interaction.member.setNickname(
        replaceVariables(config.verification.name, {
          bedwarsStar: player.stats.bedwars.level,
          bedwarsTokens: player.stats.bedwars.tokens,
          bedwarsKills: player.stats.bedwars.kills,
          bedwarsDeaths: player.stats.bedwars.deaths,
          bedwarsKDRatio: player.stats.bedwars.KDRatio,
          bedwarsFinalKills: player.stats.bedwars.finalKills,
          bedwarsFinalDeathss: player.stats.bedwars.finalDeaths,
          bedwarsFinalKDRatio: player.stats.bedwars.finalKDRatio,
          bedwarsWins: player.stats.bedwars.wins,
          bedwarsLosses: player.stats.bedwars.losses,
          bedwarsWLRatio: player.stats.bedwars.WLRatio,
          bedwarsBedsBroken: player.stats.bedwars.beds.broken,
          bedwarsBedsLost: player.stats.bedwars.beds.lost,
          bedwarsBedsBLRatio: player.stats.bedwars.beds.BLRatio,
          bedwarsPlayedGames: player.stats.bedwars.playedGames,

          skywarsStar: player.stats.skywars.level,
          skywarsCoins: player.stats.skywars.coins,
          skywarsTokens: player.stats.skywars.tokens,
          skywarsSouls: player.stats.skywars.souls,
          skywarsOpals: player.stats.skywars.opals,
          skywarsKills: player.stats.skywars.kills,
          skywarsDeaths: player.stats.skywars.deaths,
          skywarsKDRatio: player.stats.skywars.KDRatio,
          skywarsWins: player.stats.skywars.wins,
          skywarsLosses: player.stats.skywars.losses,
          skywarsWLRatio: player.stats.skywars.WLRatio,
          skywarsPlayedGames: player.stats.skywars.playedGames,

          duelsTitle: player.stats?.duels?.division,
          duelsKills: player.stats?.duels?.kills,
          duelsDeaths: player.stats?.duels?.deaths,
          duelsKDRatio: player.stats?.duels?.KDRatio,
          duelsWins: player.stats?.duels?.wins,
          duelsLosses: player.stats?.duels?.losses,
          duelsWLRatio: player.stats?.duels?.WLRatio,
          duelsPlayedGames: player.stats?.duels?.playedGames,

          level: player.level,
          rank: player.rank,
          karma: player.karma,
          achievementPoints: player.achievementPoints,
          username: player.nickname,

          guildRank: hypixelGuild.members.find((m) => m.uuid === uuid)?.rank ?? "Unknown",
          guildName: hypixelGuild.name,
        }),
        "Updated Roles",
      );

      const updateRole = new SuccessEmbed(
        `<@${interaction.user.id}>'s roles have been successfully synced with \`${player.nickname ?? "Unknown"}\`!`,
        { text: `by @kathund. | /help [command] for more information`, iconURL: "https://i.imgur.com/uUuZx2E.png" },
      );

      await interaction.followUp({ embeds: [updateRole], ephemeral: true });
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setColor(15548997)
        .setAuthor({ name: "An Error has occurred" })
        .setDescription(`\`\`\`${error}\`\`\``)
        .setFooter({
          text: `by @kathund. | /help [command] for more information`,
          iconURL: "https://i.imgur.com/uUuZx2E.png",
        });

      await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
