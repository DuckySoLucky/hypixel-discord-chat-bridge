function parseHypixel(playerRes, uuid, res) {
    if (
      playerRes.data.hasOwnProperty("player") &&
      playerRes.data.player == null
    ) {
      return res.status(404).json({
        status: 404,
        reason: `Found no Player data for a user with a UUID of '${uuid}'`,
      });
    }
    const data = playerRes.data.player;
    const achievements = data.achievements;
  
    return {
      name: data.displayname,
      rank: getRank(data),
      hypixelLevel: getHypixelLevel(data),
      karma: data.karma,
      skills: {
        mining: achievements?.skyblock_excavator || 0,
        foraging: achievements?.skyblock_gatherer || 0,
        enchanting: achievements?.skyblock_augmentation || 0,
        farming: achievements?.skyblock_harvester || 0,
        combat: achievements?.skyblock_combat || 0,
        fishing: achievements?.skyblock_angler || 0,
        alchemy: achievements?.skyblock_concoctor || 0,
        taming: achievements?.skyblock_domesticator || 0,
      },
      dungeons: {
        secrets: achievements?.skyblock_treasure_hunter || 0,
      },
    };
  }
  
  // CREDIT: https://github.com/slothpixel/core (modified)
  
  const colorToCode = {
    BLACK: "0",
    DARK_BLUE: "1",
    DARK_GREEN: "2",
    DARK_AQUA: "3",
    DARK_RED: "4",
    DARK_PURPLE: "5",
    GOLD: "6",
    GRAY: "7",
    DARK_GRAY: "8",
    BLUE: "9",
    GREEM: "a",
    AQUA: "b",
    RED: "c",
    LIGHT_PURPLE: "d",
    YELLOW: "e",
    WHITE: "f",
    RESET: "r",
  };
  
  function getRank(player) {
    const rank = getPlayerRank(
      player.rank,
      player.packageRank,
      player.newPackageRank,
      player.monthlyPackageRank
    );
    const plusColor = `§${colorToCode[player.rankPlusColor || "RED"]}`;
    const plusPlusColor = `§${colorToCode[player.monthlyRankColor || "GOLD"]}`;
    const prefix = player.prefix
      ? player.prefix.replace(/Â§/g, "§").replace(/§/g, "&")
      : null;
  
    return generateFormattedRank(rank, plusColor, plusPlusColor, prefix);
  };
  
  function getPlayerRank(rank, packageRank, newPackageRank, monthlyPackageRank) {
    let playerRank =
      rank === "NORMAL"
        ? newPackageRank || packageRank || null
        : rank || newPackageRank || packageRank || null;
    if (playerRank === "MVP_PLUS" && monthlyPackageRank === "SUPERSTAR")
      playerRank = "MVP_PLUS_PLUS";
    if (rank === "NONE") playerRank = null;
    return playerRank;
  }
  
  function generateFormattedRank(rank, plusColor, plusPlusColor, prefix) {
    if (prefix) return prefix;
  
    const ranks = {
      VIP: "§a[VIP]",
      VIP_PLUS: "§a[VIP§6+§a]",
      MVP: "§b[MVP]",
      MVP_PLUS: `§b[MVP${plusColor}+§b]`,
      MVP_PLUS_PLUS: `${plusPlusColor}[MVP${plusColor}++${plusPlusColor}]`,
      HELPER: "§9[HELPER]",
      MODERATOR: "§2[MOD]",
      GAME_MASTER: "§2[GM]",
      ADMIN: "§c[ADMIN]",
      YOUTUBER: "§c[§fYOUTUBE§c]",
    };
  
    return ranks[rank] || "§7";
  }
  
  function getHypixelLevel(player) {
    const BASE = 10000;
    const GROWTH = 2500;
  
    const REVERSE_PQ_PREFIX = -(BASE - 0.5 * GROWTH) / GROWTH;
    const REVERSE_CONST = REVERSE_PQ_PREFIX * REVERSE_PQ_PREFIX;
    const GROWTH_DIVIDES_2 = 2 / GROWTH;
  
    const experience = player?.networkExp || 0;
  
    const level =
      experience <= 1
        ? 1
        : 1 +
          REVERSE_PQ_PREFIX +
          Math.sqrt(REVERSE_CONST + GROWTH_DIVIDES_2 * experience);
    return level;
  };
  
  module.exports = { parseHypixel };