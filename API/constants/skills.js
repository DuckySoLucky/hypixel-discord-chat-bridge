const { cropTables, skillTables } = require("./leveling.js");

/**
 * Gets the xp table for the given type.
 * @param {string} [type='default'] The skill table type. Defaults to the "default" table for skills.
 * @returns {number[]} xp table
 */
function getXpTable(type = "default") {
  // @ts-ignore
  return cropTables[type] ?? skillTables[type] ?? skillTables.default;
}

/**
 * Gets the level and some other information from an xp amount.
 * @param {number} xp The experience points to calculate level information from.
 * @param {Object} [extra={}] Additional options for level calculation.
 * @param {string} [extra.type] The ID of the skill (used to determine xp table and default cap).
 * @param {number} [extra.cap] Override for the highest level the player can reach.
 * @returns {import("../stats/skills.types.js").Level} The level information.
 */
function getLevelByXp(xp, extra = {}) {
  const xpTable = getXpTable(extra.type);

  if (typeof xp !== "number" || isNaN(xp)) {
    xp = 0;
  }

  /** the level that this player is caped at */
  // @ts-ignore
  const levelCap = extra.cap ?? skillTables.defaultSkillCaps[extra.type] ?? Math.max(...Object.keys(xpTable).map(Number));

  /** the level ignoring the cap and using only the table */
  let uncappedLevel = 0;

  /** the amount of xp over the amount required for the level (used for calculation progress to next level) */
  let xpCurrent = xp;

  /** like xpCurrent but ignores cap */
  let xpRemaining = xp;

  while (xpTable[uncappedLevel + 1] <= xpRemaining) {
    uncappedLevel++;
    xpRemaining -= xpTable[uncappedLevel];
    if (uncappedLevel <= levelCap) {
      xpCurrent = xpRemaining;
    }
  }

  /** Whether the skill has infinite leveling (dungeoneering and skyblock level) */
  // @ts-ignore
  const isInfiniteLevelable = skillTables.infiniteLeveling.includes(extra.type);

  /** adds support for infinite leveling (dungeoneering and skyblock level) */
  if (isInfiniteLevelable) {
    const maxExperience = Object.values(xpTable).at(-1);

    // @ts-ignore
    uncappedLevel += Math.floor(xpRemaining / maxExperience);
    // @ts-ignore
    xpRemaining %= maxExperience;
    xpCurrent = xpRemaining;
  }

  /** the maximum level that any player can achieve (used for gold progress bars) */
  // @ts-ignore
  const maxLevel = isInfiniteLevelable ? Math.max(uncappedLevel, levelCap) : (skillTables.maxedSkillCaps[extra.type] ?? levelCap);

  /** the level as displayed by in game UI */
  const level = isInfiniteLevelable ? uncappedLevel : Math.min(levelCap, uncappedLevel);

  /** the amount amount of xp needed to reach the next level (used for calculation progress to next level) */
  const xpForNext = level < maxLevel ? Math.ceil(xpTable[level + 1] ?? Object.values(xpTable).at(-1)) : isInfiniteLevelable ? Object.values(xpTable).at(-1) : Infinity;

  /** the fraction of the way toward the next level */
  // @ts-ignore
  const progress = level >= maxLevel && !isInfiniteLevelable ? 0 : Math.max(0, Math.min(xpCurrent / xpForNext, 1));

  /** a floating point value representing the current level for example if you are half way to level 5 it would be 4.5 */
  const levelWithProgress = isInfiniteLevelable ? uncappedLevel + progress : Math.min(uncappedLevel + progress, levelCap);

  /** a floating point value representing the current level ignoring the in-game unlockable caps for example if you are half way to level 5 it would be 4.5 */
  const unlockableLevelWithProgress = extra.cap ? Math.min(uncappedLevel + progress, maxLevel) : levelWithProgress;

  /** the amount of xp needed to max out the skill */
  // @ts-ignore
  const maxExperience = getSkillExperience(extra.type, levelCap);

  return {
    xp,
    level,
    maxLevel,
    xpCurrent,
    // @ts-ignore
    xpForNext,
    progress,
    levelCap,
    uncappedLevel,
    levelWithProgress,
    unlockableLevelWithProgress,
    maxExperience
  };
}

/**
 * Calculates the average skill level for a player's profile data.
 * @param {import("../../types/profiles.js").Member} profileData
 * @param {import("../../types/player.js").Player | null} hypixelPlayer
 * @param {{
 *  decimals?: number;
 *  progress?: boolean;
 *  cosmetic?: boolean;
 * }} [options={}]
 * @returns {string} The average skill level.
 */
function getSkillAverage(profileData, hypixelPlayer, options = { decimals: 2, progress: false, cosmetic: false }) {
  const skillLevelCaps = getSkillLevelCaps(profileData, hypixelPlayer);

  let totalLevel = 0;
  for (const skillId of skillTables.skills) {
    if (!options.cosmetic && skillTables.cosmeticSkills.includes(skillId)) {
      continue;
    }

    // @ts-ignore
    const skill = getLevelByXp(profileData.player_data?.experience?.[`SKILL_${skillId.toUpperCase()}`], {
      type: skillId,
      // @ts-ignore
      cap: skillLevelCaps[skillId]
    });

    totalLevel += options.progress ? skill.levelWithProgress : skill.level;
  }

  const average = totalLevel / skillTables.skills.filter((skill) => !(!options.cosmetic && skillTables.cosmeticSkills.includes(skill))).length;

  return average.toFixed(options.decimals);
}

/**
 * Calculates the skill level caps for different skills based on the profile data and Hypixel player data.
 * @param {import("../../types/profiles.js").Member} profileData
 * @param {import("../../types/player.js").Player | null} hypixelPlayer
 * @returns {{
 *  farming: number;
 *  taming: number;
 *  runecrafting: number;
 * }} An object containing the skill level caps for farming, taming, and runecrafting.
 */
function getSkillLevelCaps(profileData, hypixelPlayer) {
  return {
    farming: 50 + (profileData.jacobs_contest?.perks?.farming_level_cap || 0),
    taming: 50 + (profileData.pets_data?.pet_care?.pet_types_sacrificed?.length || 0),
    runecrafting: 25 // hypixelPlayer?.newPackageRank ? 25 : 3
  };
}

/**
 * Calculates the total experience required to reach a certain level in a skill.
 * @param {string} skill The ID of the skill used to determine the xp table.
 * @param {number} level The target level.
 * @returns {number} The total experience required.
 */
function getSkillExperience(skill, level) {
  const skillTable = getXpTable(skill);

  // @ts-ignore
  return Object.entries(skillTable).reduce((acc, [key, value]) => (key <= level ? acc + value : acc), 0);
}

/**
 * Calculates the total social skill experience for a given profile.
 * @param {import("../../types/profiles.js").Profile} profile The profile object containing skill data.
 * @returns {number} The total social skill experience.
 */
function getSocialSkillExperience(profile) {
  return Object.keys(profile.members).reduce((acc, member) => {
    return acc + (profile.members[member]?.player_data?.experience?.SKILL_SOCIAL || 0);
  }, 0);
}

module.exports = {
  getSkillAverage,
  getLevelByXp,
  getXpTable,
  getSkillLevelCaps,
  getSkillExperience,
  getSocialSkillExperience
};
