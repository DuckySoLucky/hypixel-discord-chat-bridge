const { getHotM, perks, forgeItemTimes } = require("../constants/mining.js");
const { toFixed, titleCase } = require("../constants/functions.js");
const getSkills = require("./skills.js");

module.exports = (player, profile) => {
  const miningStats = profile?.mining_core;
  const playerPerks = [];
  const disabledPerks = [];

  for (const perk in Object.keys(miningStats?.nodes || {}) || []) {
    if (!Object.keys(miningStats.nodes)[perk].startsWith("toggle_")) {
      const currentPerk = perks[Object.keys(miningStats.nodes)[perk]];
      playerPerks.push({
        name: currentPerk.name,
        id: currentPerk.id,
        level: Object.values(miningStats.nodes)[perk],
        maxLevel: currentPerk.max,
      });
    } else {
      disabledPerks.push(Object.keys(miningStats.nodes)[perk].substring(7));
    }
  }

  for (let statue of miningStats?.biomes?.dwarven?.statues_placed || []) {
    statue = titleCase(statue);
  }

  for (let part of miningStats?.biomes?.precursor?.parts_delivered || []) {
    part = titleCase(part, true);
  }

  //Check if player has the "Quick Forge" perk in the Heart of the Mountain and change the duration of the items in the forge accordingly
  if (miningStats?.nodes?.quick_forge) {
    for (const item of Object.keys(forgeItemTimes)) {
      const lessForgingTime =
        miningStats.mining_core.nodes.forge_time <= 19
          ? 0.1 + miningStats.mining_core.nodes.forge_time * 0.005
          : 0.3;
      forgeItemTimes[item].duration =
        forgeItemTimes[item].duration -
        forgeItemTimes[item].duration * lessForgingTime;
    }
  }

  //Forge Display
  const forgeAPI = profile.forge?.forge_processes || [];
  const forge = [];

  for (const forgeTypes of Object.values(forgeAPI)) {
    for (const item of Object.values(forgeTypes)) {
      if (item?.id === "PET") item.id = "AMMONITE";
      forge.push({
        slot: item.slot,
        item: forgeItemTimes[item.id]?.name || "Unknown",
        id: item.id === "AMMONITE" ? "PET" : item.id,
        ending: Number(
          (item.startTime + forgeItemTimes[item.id]?.duration || 0).toFixed()
        ),
        ended:
          item.startTime + forgeItemTimes[item.id]?.duration || 0 < Date.now()
            ? true
            : false,
      });
    }
  }

  return {
    mining: getSkills(player, profile).mining?.level || 0,
    mithril_powder: {
      current: miningStats?.powder_mithril_total || 0,
      total:
        (miningStats?.powder_mithril_total || 0) +
        (miningStats?.powder_spent_mithril || 0),
    },
    gemstone_powder: {
      current: miningStats?.powder_gemstone_total || 0,
      total:
        (miningStats?.powder_gemstone_total || 0) +
        (miningStats?.powder_spent_gemstone || 0),
    },
    hotM_tree: {
      tokens: {
        current: miningStats?.tokens || 0,
        total: miningStats?.tokens || 0 + miningStats?.tokens_spent || 0,
      },
      level: miningStats?.experience
        ? Number(toFixed(getHotM(miningStats?.experience)))
        : 0,
      perks: playerPerks,
      disabled_perks: disabledPerks,
      last_reset: miningStats?.last_reset || null,
      pickaxe_ability:
        perks[miningStats?.selected_pickaxe_ability]?.name || null,
    },
    crystal_hollows: {
      last_pass: miningStats?.greater_mines_last_access || null,
      crystals: [
        {
          name: "Jade Crystal",
          id: "jade_crystal",
          total_placed: miningStats?.crystals?.jade_crystal?.total_placed || 0,
          statues_placed: miningStats?.biomes?.dwarven?.statues_placed || [],
          state: titleCase(
            miningStats?.crystals?.jade_crystal?.state || "Not Found",
            true
          ),
        },
        {
          name: "Amber Crystal",
          total_placed:
            miningStats?.crystals?.amber_crystal?.total_placed || 0,
          king_quests_completed:
            miningStats?.biomes?.goblin?.king_quests_completed || 0,
          state: titleCase(
            miningStats?.crystals?.amber_crystal?.state || "Not Found",
            true
          ),
        },
        {
          name: "Sapphire Crystal",
          total_placed:
            miningStats?.crystals?.sapphire_crystal?.total_placed || 0,
          parts_delivered:
            miningStats?.biomes?.precursor?.parts_delivered || [],
          state: titleCase(
            miningStats?.crystals?.sapphire_crystal?.state || "Not Found",
            true
          ),
        },
        {
          name: "Amethyst Crystal",
          total_placed:
            miningStats?.crystals?.amethyst_crystal?.total_placed || 0,
          state: titleCase(
            miningStats?.crystals?.amethyst_crystal?.state || "Not Found",
            true
          ),
        },
        {
          name: "Topaz Crystal",
          total_placed:
            miningStats?.crystals?.topaz_crystal?.total_placed || 0,
          state: titleCase(
            miningStats?.crystals?.topaz_crystal?.state || "Not Found",
            true
          ),
        },
        {
          name: "Jasper Crystal",
          total_placed:
            miningStats?.crystals?.jasper_crystal?.total_placed || 0,
          state: titleCase(
            miningStats?.crystals?.jasper_crystal?.state || "Not Found",
            true
          ),
        },
        {
          name: "Ruby Crystal",
          total_placed: miningStats?.crystals?.ruby_crystal?.total_placed || 0,
          state: titleCase(
            miningStats?.crystals?.ruby_crystal?.state || "Not Found",
            true
          ),
        },
      ],
    },
    forge,
  };
};
