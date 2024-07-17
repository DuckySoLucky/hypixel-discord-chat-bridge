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

  execute: async (interaction, user, hidden = false) => {
    user = await guild.members.fetch(user ?? interaction.user);
    if (user === undefined) {
      throw new HypixelDiscordChatBridgeError("No user found.");
    }

    const linkedData = readFileSync("data/linked.json");
    if (!linkedData) {
      throw new HypixelDiscordChatBridgeError("The linked data file does not exist. Please contact an administrator.");
    }

    const linked = JSON.parse(linkedData);
    if (!linked) {
      throw new HypixelDiscordChatBridgeError("The linked data file is malformed. Please contact an administrator.");
    }

    const linkedUser = linked.find((data) => data.id === user.id);
    if (linkedUser === undefined) {
      user.setNickname(null, "Updated Roles").catch((_) => {});
      user.roles.add(config.verification.role, "Updated Roles").catch((_) => {});
      user.roles.remove(config.verification.role, "Updated Roles").catch((_) => {});
      user.roles.remove(config.verification.guildMemberRole, "Updated Roles").catch((_) => {});
      if (config.verification.ranks.length > 0) {
        config.verification.ranks.forEach((rank) => {
          user.roles.remove(rank.role, "Updated Roles").catch((_) => {});
        });
      }
      const embed = new EmbedBuilder().setDescription(`<@${user.id}> is not verified.`).setColor(15548997).setFooter({
        text: `by @kathund. | /help [command] for more information`,
        iconURL: "https://i.imgur.com/uUuZx2E.png",
      });
      if (hidden) return await interaction.followUp({ embeds: [embed] });
    }

    const [hypixelGuild, player] = await Promise.all([
      hypixelRebornAPI.getGuild("player", bot.username).catch(() => undefined),
      hypixelRebornAPI.getPlayer(linkedUser.uuid, { guild: true }).catch(() => undefined),
    ]).catch((e) => {
      console.log(e);
    });

    if (hypixelGuild === undefined) {
      throw new HypixelDiscordChatBridgeError("Guild not found.");
    }

    const playerIsInGuild = hypixelGuild.members.find((m) => m.uuid == linkedUser.uuid);
    if (playerIsInGuild) {
      user.roles.add(config.verification.guildMemberRole, "Updated Roles").catch((_) => {});
      if (config.verification.ranks.length > 0) {
        const rank = config.verification.ranks.find((r) => r.name.toLowerCase() == playerIsInGuild.rank.toLowerCase());
        if (rank) user.roles.add(rank.role, "Updated Roles").catch((_) => {});
      }
    } else {
      user.roles.remove(config.verification.guildMemberRole, "Updated Roles").catch((_) => {});
      if (config.verification.ranks.length > 0) {
        config.verification.ranks.forEach((rank) => {
          user.roles.remove(rank.role, "Updated Roles").catch((_) => {});
        });
      }
    }

    if (user.roles.cache.find((r) => r.id === config.verification.role) === undefined) {
      user.roles.add(config.verification.role, "Updated Roles").catch((_) => {});
    }

    user
      .setNickname(
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

          duelsTitle: player.stats.duels.division,
          duelsKills: player.stats.duels.kills,
          duelsDeaths: player.stats.duels.deaths,
          duelsKDRatio: player.stats.duels.KDRatio,
          duelsWins: player.stats.duels.wins,
          duelsLosses: player.stats.duels.losses,
          duelsWLRatio: player.stats.duels.WLRatio,
          duelsPlayedGames: player.stats.duels.playedGames,

          level: player.level,
          rank: player.rank,
          karma: player.karma,
          achievementPoints: player.achievementPoints,
          username: player.nickname,

          guildRank: player.guild ? player.guild.me.rank : "",
          guildName: player.guild ? player.guild.name : "",
        }),
        "Updated Roles",
      )
      .catch((_) => {});

    const updateRole = new SuccessEmbed(
      `<@${user.id}>'s roles have been successfully synced with \`${player.nickname ?? "Unknown"}\`!`,
    );
    if (hidden !== null) await interaction.followUp({ embeds: [updateRole], ephemeral: hidden });
  },
};
