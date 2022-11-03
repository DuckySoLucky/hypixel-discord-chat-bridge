const minionSlots = require("../constants/minion_slots.js");

module.exports = (profile) => {
  const constants = require("../constants/minions.js");

  let unlockedMinions = {};
  for (const member of Object.keys(profile.members)) {
    const minions = profile.members[member]?.crafted_generators;
    if (minions) {
      for (const minion of minions) {
        const minionLevel = Number(minion.replace(/\D/g, ""));
        const minionName = minion.substring(
          0,
          minion.length - minionLevel.toString().length - 1
        );
        if (
          unlockedMinions[minionName] < minionLevel ||
          !(minionName in unlockedMinions) ||
          unlockedMinions[minionName]?.tier < minionLevel
        ) {
          const foundMinion = constants[minionName];
          if (foundMinion) {
            foundMinion.tier = minionLevel;
            unlockedMinions[minionName] = foundMinion;
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
  for (let i = 0; i < Object.keys(minionSlots).length; i++) {
    if (uniqueMinions > Object.keys(minionSlots)[i]) {
      slots = i + 5;
      nextSlot = Object.keys(minionSlots)[i + 1] - uniqueMinions;
    }
  }

  let bonusSlots = 0;
  const communityUpgrades = profile.community_upgrades?.upgrade_states || 0;
  for (let i = 0; i < communityUpgrades.length; i++) {
    if (
      communityUpgrades[i].upgrade === "minion_slots" &&
      communityUpgrades[i].tier > bonusSlots
    ) {
      bonusSlots = communityUpgrades[i].tier;
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
