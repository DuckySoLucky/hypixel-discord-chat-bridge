const MINION_SLOTS = require("../constants/minion_slots.js");

module.exports = (profile) => {
  const constants = require("../constants/minions.js");

  let unlockedMinions = {};
  for (const member of Object.keys(profile.members)) {
    const minions = profile.members[member]?.crafted_generators;
    if (minions) {
      for (const minion of minions) {
        const MINION_LEVEL = Number(minion.replace(/\D/g, ""));
        const MINION_NAME = minion.substring(
          0,
          minion.length - MINION_LEVEL.toString().length - 1
        );
        if (
          unlockedMinions[MINION_NAME] < MINION_LEVEL ||
          !(MINION_NAME in unlockedMinions) ||
          unlockedMinions[MINION_NAME]?.tier < MINION_LEVEL
        ) {
          const FOUND_MINION = constants[MINION_NAME];
          if (FOUND_MINION) {
            FOUND_MINION.tier = MINION_LEVEL;
            unlockedMinions[MINION_NAME] = FOUND_MINION;
          }
        }
      }
    }
  }
  unlockedMinions = Object.values(unlockedMinions);

  let uniqueMinions = 0;
  for (const uniques of unlockedMinions) {
    uniqueMinions += uniques.tier;
  }

  let slots = 5;
  let nextSlot = 0;
  for (let i = 0; i < Object.keys(MINION_SLOTS).length; i++) {
    if (uniqueMinions > Object.keys(MINION_SLOTS)[i]) {
      slots = i + 5;
      nextSlot = Object.keys(MINION_SLOTS)[i + 1] - uniqueMinions;
    }
  }

  let bonusSlots = 0;
  const COMMUNITY_UPGRADES = profile.community_upgrades?.upgrade_states || 0;
  for (let i = 0; i < COMMUNITY_UPGRADES.length; i++) {
    if (
      COMMUNITY_UPGRADES[i].upgrade === "minion_slots" &&
      COMMUNITY_UPGRADES[i].tier > bonusSlots
    ) {
      bonusSlots = COMMUNITY_UPGRADES[i].tier;
    }
  }

  return {
    uniqueMinions,
    minionSlots: slots,
    bonusSlots: bonusSlots,
    nextSlot,
    unlockedMinions: unlockedMinions,
  };
};
