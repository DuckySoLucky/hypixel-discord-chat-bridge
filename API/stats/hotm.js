// CREDITS: by @Kathund (https://github.com/Kathund)
const { titleCase } = require("../constants/functions.js");
const { errorMessage } = require("../../src/Logger.js");
const miningConst = require("../constants/mining.js");
const calcSkill = require("../constants/skills.js");
const moment = require("moment");

module.exports = (player, profile) => {
  try {
    const commissions = {
      total: player?.achievements?.skyblock_hard_working_miner ?? 0,
      milestone: 0,
    };

    // CREDITS: https://github.com/SkyCryptWebsite/SkyCrypt/blob/b9842bea6f1494fa2d2fd005b64f57d84646c188/src/stats/mining.js#L129
    if (profile.objectives?.tutorial !== undefined) {
      for (const key of profile.objectives.tutorial) {
        if (key.startsWith("commission_milestone_reward_mining_xp_tier_") === false) {
          continue;
        }

        const tier = parseInt(key.slice(43));
        commissions.milestone = Math.max(commissions.milestone, tier);
      }
    }

    const forgeItems = [];
    if (profile.forge?.forge_processes?.forge_1) {
      const forge = Object.values(profile.forge.forge_processes.forge_1);

      for (const item of forge) {
        const forgeItem = {
          id: item.id,
          slot: item.slot,
          timeStarted: item.startTime,
          timeFinished: 0,
          timeFinishedText: "",
        };

        if (item.id in miningConst.forge.items) {
          let forgeTime = miningConst.forge.items[item.id].time * 60 * 1000;
          const quickForge = profile.mining_core?.nodes?.forge_time;
          if (quickForge != null) {
            forgeTime *= miningConst.forge.quickForgeMultiplier[quickForge];
          }

          forgeItem.name = miningConst.forge.items[item.id].name;

          const timeFinished = item.startTime + forgeTime;
          forgeItem.timeStarted = item.startTime;
          forgeItem.timeFinished = timeFinished;
          forgeItem.timeFinishedText =
            timeFinished < Date.now() ? "Finished" : `ending ${moment(timeFinished).fromNow()}`;
        } else {
          errorMessage(item);
          forgeItem.name = "Unknown Item";
          forgeItem.id = `UNKNOWN-${item.id}`;
        }

        forgeItems.push(forgeItem);
      }
    }

    return {
      powder: {
        mithril: {
          spent: profile?.mining_core?.powder_spent_mithril || 0,
          current: profile?.mining_core?.powder_mithril || 0,
          total: profile?.mining_core?.powder_spent_mithril || 0 + profile?.mining_core?.powder_mithril || 0,
        },
        gemstone: {
          spent: profile?.mining_core?.powder_spent_gemstone || 0,
          current: profile?.mining_core?.powder_gemstone || 0,
          total: profile?.mining_core?.powder_spent_gemstone || 0 + profile?.mining_core?.powder_gemstone || 0,
        },
        glacite: {
          spent: profile?.mining_core?.powder_spent_glacite || 0,
          current: profile?.mining_core?.powder_glacite || 0,
          total: profile?.mining_core?.powder_spent_glacite || 0 + profile?.mining_core?.powder_glacite || 0,
        },
      },
      level: calcSkill("hotm", profile?.mining_core?.experience || 0),
      ability: titleCase(profile?.mining_core?.selected_pickaxe_ability || "none", true),
      commissions: commissions,
      forge: forgeItems,
    };
  } catch (error) {
    errorMessage(error);
    return null;
  }
};
