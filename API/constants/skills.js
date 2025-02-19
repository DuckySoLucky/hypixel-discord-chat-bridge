const { cropTables, skillTables } = require("./leveling.js");

/**
 * Gets the xp table for the given type.
 * @param {string} [type='default'] The skill table type. Defaults to the "default" table for skills.
 * @returns {number[]} xp table
 */
function getXpTable(type = "default") {
  return cropTables[type] ?? skillTables[type] ?? skillTables.default;
}

/**
 * Gets the level and some other information from an xp amount.
 * @param {number} xp The experience points to calculate level information from.
 * @param {Object} [extra={}] Additional options for level calculation.
 * @param {string} [extra.type] The ID of the skill (used to determine xp table and default cap).
 * @param {number} [extra.cap] Override for the highest level the player can reach.
 */
function getLevelByXp(xp, extra = {}) {
  const xpTable = getXpTable(extra.type);

  if (typeof xp !== "number" || isNaN(xp)) {
    xp = 0;
  }

  /** the level that this player is caped at */
  const levelCap =
    extra.cap ?? skillTables.defaultSkillCaps[extra.type] ?? Math.max(...Object.keys(xpTable).map(Number));

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
  const isInfiniteLevelable = skillTables.infiniteLeveling.includes(extra.type);

  /** adds support for infinite leveling (dungeoneering and skyblock level) */
  if (isInfiniteLevelable) {
    const maxExperience = Object.values(xpTable).at(-1);

    uncappedLevel += Math.floor(xpRemaining / maxExperience);
    xpRemaining %= maxExperience;
    xpCurrent = xpRemaining;
  }

  /** the maximum level that any player can achieve (used for gold progress bars) */
  const maxLevel = isInfiniteLevelable
    ? Math.max(uncappedLevel, levelCap)
    : skillTables.maxedSkillCaps[extra.type] ?? levelCap;

  /** the level as displayed by in game UI */
  const level = isInfiniteLevelable ? uncappedLevel : Math.min(levelCap, uncappedLevel);

  /** the amount amount of xp needed to reach the next level (used for calculation progress to next level) */
  const xpForNext =
    level < maxLevel
      ? Math.ceil(xpTable[level + 1] ?? Object.values(xpTable).at(-1))
      : isInfiniteLevelable
        ? Object.values(xpTable).at(-1)
        : Infinity;

  /** the fraction of the way toward the next level */
  const progress = level >= maxLevel && !isInfiniteLevelable ? 0 : Math.max(0, Math.min(xpCurrent / xpForNext, 1));

  /** a floating point value representing the current level for example if you are half way to level 5 it would be 4.5 */
  const levelWithProgress = isInfiniteLevelable
    ? uncappedLevel + progress
    : Math.min(uncappedLevel + progress, levelCap);

  /** a floating point value representing the current level ignoring the in-game unlockable caps for example if you are half way to level 5 it would be 4.5 */
  const unlockableLevelWithProgress = extra.cap ? Math.min(uncappedLevel + progress, maxLevel) : levelWithProgress;

  /** the amount of xp needed to max out the skill */
  const maxExperience = getSkillExperience(extra.type, levelCap);

  return {
    xp,
    level,
    maxLevel,
    xpCurrent,
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
 *
 * @param {Object} profileData The player's profile data.
 * @param {Object} hypixelPlayer The player's Hypixel data.
 * @param {Object} [options] Additional options for calculating the average.
 * @param {number} [options.decimals=2] The number of decimal places to round the average to. Default is 1.
 * @param {boolean} [options.progress=false] Whether to include progress towards the next level in the calculation. Default is false.
 * @param {boolean} [options.cosmetic=false] Whether to include cosmetic skills in the calculation. Default is false.
 * @returns {string} The average skill level rounded to the specified number of decimal places.
 */
function getSkillAverage(profileData, hypixelPlayer, options = { decimals: 2, progress: false, cosmetic: false }) {
  const skillLevelCaps = getSkillLevelCaps(profileData, hypixelPlayer);

  let totalLevel = 0;
  for (const skillId of skillTables.skills) {
    if (!options.cosmetic && skillTables.cosmeticSkills.includes(skillId)) {
      continue;
    }

    const skill = getLevelByXp(profileData.player_data?.experience?.[`SKILL_${skillId.toUpperCase()}`], {
      type: skillId,
      cap: skillLevelCaps[skillId]
    });

    totalLevel += options.progress ? skill.levelWithProgress : skill.level;
  }

  const average =
    totalLevel /
    skillTables.skills.filter((skill) => !(!options.cosmetic && skillTables.cosmeticSkills.includes(skill))).length;

  return average.toFixed(options.decimals);
}

/**
 * Calculates the skill level caps for different skills based on the profile data and Hypixel player data.
 * @param {Object} profileData The profile data containing information about the player's skills.
 * @param {Object} hypixelPlayer The Hypixel player data containing information about the player's achievements.
 * @returns {Object} An object containing the skill level caps for farming, taming, and runecrafting.
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

  return Object.entries(skillTable).reduce((acc, [key, value]) => (key <= level ? acc + value : acc), 0);
}

/**
 * Calculates the total social skill experience for a given profile.
 * @param {Object} profile The profile object containing skill data.
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
