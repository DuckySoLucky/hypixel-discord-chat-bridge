// CREDITS: by @Kathund (https://github.com/Kathund)
const { titleCase } = require("../constants/functions.js");
const miningConst = require("../constants/mining.js");
const calcSkill = require("../constants/skills.js");
const moment = require("moment");

module.exports = (profile) => {
  try {
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
          console.log(item);
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
      forge: forgeItems,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
