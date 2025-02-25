// CREDITS: by @Kathund (https://github.com/Kathund)
const CONSTANTS = require("../constants/mining.js");
const { getLevelByXp } = require("../constants/skills.js");
const moment = require("moment");

/**
 * Returns the player's HotM stats.
 * @param {import("../../types/profiles.js").Member} profile
 * @returns {import("./hotm.types").HotM | null}
 */
function getHotm(profile) {
  try {
    if (!profile?.mining_core) {
      return null;
    }

    return {
      powder: {
        mithril: {
          spent: profile.mining_core.powder_spent_mithril ?? 0,
          current: profile.mining_core.powder_mithril ?? 0,
          total: profile.mining_core.powder_spent_mithril ?? 0 + profile.mining_core.powder_mithril ?? 0
        },
        gemstone: {
          spent: profile.mining_core.powder_spent_gemstone ?? 0,
          current: profile.mining_core.powder_gemstone ?? 0,
          total: profile.mining_core.powder_spent_gemstone ?? 0 + profile.mining_core.powder_gemstone ?? 0
        },
        glacite: {
          spent: profile.mining_core.powder_spent_glacite ?? 0,
          current: profile.mining_core.powder_glacite ?? 0,
          total: profile.mining_core.powder_spent_glacite ?? 0 + profile.mining_core.powder_glacite ?? 0
        }
      },
      level: getLevelByXp(profile.mining_core.experience, { type: "hotm" }),
      // @ts-ignore
      ability: CONSTANTS.hotm.perks[profile.mining_core.selected_pickaxe_ability]?.name ?? "None"
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 *
 * @param {import("../../types/profiles.js").Member} profile
 * @returns {import("./hotm.types").Forge | null}
 */
function getForge(profile) {
  const forgeItems = [];
  if (!profile.forge?.forge_processes?.forge_1) {
    return null;
  }

  const forge = Object.values(profile.forge.forge_processes.forge_1);

  for (const item of forge) {
    const forgeItem = {
      id: item.id,
      name: "Unknown Item",
      slot: item.slot,
      timeStarted: item.startTime,
      timeFinished: 0,
      timeFinishedText: ""
    };

    if (item.id in CONSTANTS.forge.items) {
      // @ts-ignore
      let forgeTime = CONSTANTS.forge.items[item.id].duration;
      const quickForge = profile.mining_core?.nodes?.forge_time;
      if (quickForge != null) {
        // @ts-ignore
        forgeTime *= CONSTANTS.forge.quickForgeMultiplier[quickForge];
      }

      // @ts-ignore
      forgeItem.name = CONSTANTS.forge.items[item.id].name;

      const timeFinished = item.startTime + forgeTime;
      forgeItem.timeStarted = item.startTime;
      forgeItem.timeFinished = timeFinished;
      forgeItem.timeFinishedText = timeFinished < Date.now() ? "(FINISHED)" : ` (${moment(timeFinished).fromNow()})`;
    }

    forgeItems.push(forgeItem);
  }

  return forgeItems;
}

module.exports = {
  getHotm,
  getForge
};
