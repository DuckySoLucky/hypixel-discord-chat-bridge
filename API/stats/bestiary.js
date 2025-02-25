const { getBestiaryConstants } = require("../constants/bestiary.js");

/**
 * @typedef {import('../constants/bestiary.types').BestiaryConstant} BestiaryConstants
 * @typedef {import('../constants/bestiary.types').Mob} Mob
 * @typedef {import('./bestiary.types').Bestiary} Bestiary
 */

/** @type {Partial<BestiaryConstants | null>} */
let BESTIARY_CONSTANTS = {};
async function updateConstants() {
  BESTIARY_CONSTANTS = await getBestiaryConstants();
}

setInterval(updateConstants, 1000 * 60 * 60 * 12);
updateConstants();

/**
 * @param {import("../../types/profiles.js").Member['bestiary']} bestiary
 * @param {Mob[]} categoryMobs
 */
function formatMobs(bestiary, categoryMobs) {
  if (!BESTIARY_CONSTANTS?.brackets) {
    return [];
  }

  const result = [];
  for (const mob of categoryMobs) {
    const mobBracket = BESTIARY_CONSTANTS.brackets[mob.bracket];

    const totalKills = bestiary ? mob.mobs.reduce((a, b) => a + (bestiary?.kills?.[b] || 0), 0) : 0;
    const nextTierKills = mobBracket.find((tier) => totalKills < tier && tier <= mob.cap);
    const currentTier = nextTierKills ? mobBracket.indexOf(nextTierKills) : mobBracket.indexOf(mob.cap) + 1;
    const nextTier = nextTierKills ? nextTierKills - totalKills : null;

    result.push({
      name: mob.name,
      kills: totalKills,
      nextTierKills: nextTierKills,
      nextTier: nextTier,
      maxKills: mob.cap,
      tier: currentTier,
      maxTier: mobBracket.findLastIndex((a) => a <= mob.cap) + 1
    });
  }
  return result;
}

/**
 * @param {import("../../types/profiles.js").Member} profile
 * @returns {Bestiary | null}
 */
function getBestiary(profile) {
  if (!BESTIARY_CONSTANTS) {
    return null;
  }

  try {
    /** @type {Bestiary['categories']} */
    const output = {};

    const islands = JSON.parse(JSON.stringify(BESTIARY_CONSTANTS.islands));
    for (const [id, island] of Object.entries(islands)) {
      const mobs = formatMobs(profile.bestiary, island.mobs);
      output[id] = {
        ...island,
        mobs,
        familiesCompleted: mobs.filter((mob) => mob.tier === mob.maxTier).length,
        familiesUnlocked: mobs.filter((mob) => mob.kills > 0).length,
        totalFamilies: mobs.length,
        familyTiers: mobs.reduce((a, b) => a + b.tier, 0),
        maxFamilyTiers: mobs.reduce((a, b) => a + b.maxTier, 0)
      };
    }

    const bestiaryData = Object.values(output);
    return {
      level: bestiaryData.reduce((a, b) => a + b.familyTiers, 0) / 10,
      maxLevel: bestiaryData.reduce((a, b) => a + b.maxFamilyTiers, 0) / 10,
      familiesUnlocked: bestiaryData.reduce((a, b) => a + b.familiesUnlocked, 0),
      familiesCompleted: bestiaryData.reduce((a, b) => a + b.familiesCompleted, 0),
      totalFamilies: bestiaryData.reduce((a, b) => a + b.totalFamilies, 0),
      familyTiers: bestiaryData.reduce((a, b) => a + b.familyTiers, 0),
      maxFamilyTiers: bestiaryData.reduce((a, b) => a + b.maxFamilyTiers, 0),
      categories: output
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = {
  getBestiary
};
