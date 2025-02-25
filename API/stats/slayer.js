const xp_tables = require("../constants/xp_tables.js");

/**
 * Get slayer level of a player.
 * @param {import("../../types/profiles.js").Member} profile
 * @param {string} slayer
 * @returns {import("./slayer.types.js").SlayerLevel}
 */
function getSlayerLevel(profile, slayer) {
  const slayers = profile?.slayer?.slayer_bosses?.[slayer];
  const experience = slayers?.xp || 0;
  if (experience <= 0) {
    return {
      xp: 0,
      level: 0,
      // @ts-ignore
      xpForNext: xp_tables.slayer[slayer][0],
      progress: 0,
      totalKills: 0,
      kills: {}
    };
  }

  let level = 0;
  let xpForNext = 0;
  let progress = 0;
  const maxLevel = 9;

  // @ts-ignore
  for (let i = 0; i < xp_tables.slayer[slayer].length; i++) {
    // @ts-ignore
    if (xp_tables.slayer[slayer][i] <= experience) {
      level = i + 1;
    }
  }

  if (level < maxLevel) {
    // @ts-ignore
    xpForNext = Math.ceil(xp_tables.slayer[slayer][level]);
  }

  progress = level >= maxLevel ? 0 : Math.max(0, Math.min(experience / xpForNext, 1));

  /** @type {Record<string, number>} */
  const kills = {};
  let total = 0;
  if (slayer === "zombie") kills["5"] = 0;
  for (let i = 0; i < Object.keys(slayers).length; i++) {
    if (Object.keys(slayers)[i].startsWith("boss_kills_tier_")) {
      // @ts-ignore
      total += Object.values(slayers)[i];
      // @ts-ignore
      kills[(Number(Object.keys(slayers)[i].charAt(Object.keys(slayers)[i].length - 1)) + 1).toString()] = Object.values(slayers)[i];
    }
  }

  return {
    xp: experience,
    totalKills: total,
    level,
    xpForNext,
    progress,
    kills
  };
}

/**
 * Get slayer stats of a player.
 * @param {import("../../types/profiles.js").Member} profile
 * @returns {import("./slayer.types.js").Slayer | null}
 */

function getSlayer(profile) {
  try {
    return {
      zombie: getSlayerLevel(profile, "zombie"),
      spider: getSlayerLevel(profile, "spider"),
      wolf: getSlayerLevel(profile, "wolf"),
      enderman: getSlayerLevel(profile, "enderman"),
      blaze: getSlayerLevel(profile, "blaze"),
      vampire: getSlayerLevel(profile, "vampire")
    };
  } catch (error) {
    return null;
  }
}

module.exports = {
  getSlayer
};
