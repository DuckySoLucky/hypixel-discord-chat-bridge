const { titleCase } = require("../constants/functions.js");
const calcSkill = require("../constants/skills.js");

module.exports = (player, profile) => {
  try {
    const commissions = {
      total: player?.achievements?.skyblock_hard_working_miner ?? 0,
      milestone: 0,
    };

    // credit: https://github.com/SkyCryptWebsite/SkyCrypt/blob/b9842bea6f1494fa2d2fd005b64f57d84646c188/src/stats/mining.js#L129
    if (profile.objectives?.tutorial !== undefined) {
      for (const key of profile.objectives.tutorial) {
        if (key.startsWith("commission_milestone_reward_mining_xp_tier_") === false) {
          continue;
        }

        const tier = parseInt(key.slice(43));
        commissions.milestone = Math.max(commissions.milestone, tier);
      }
    }

    return {
      powder: {
        mithril: {
          total: profile?.mining_core.powder_spent_mithril + profile?.mining_core.powder_mithril,
          spent: profile?.mining_core.powder_spent_mithril,
          current: profile?.mining_core.powder_mithril,
        },
        gemstone: {
          total: profile?.mining_core.powder_spent_gemstone + profile?.mining_core.powder_gemstone,
          spent: profile?.mining_core.powder_spent_gemstone,
          current: profile?.mining_core.powder_gemstone,
        },
      },
      level: calcSkill("hotm", profile?.mining_core?.experience || 0),
      ability: titleCase(profile?.mining_core?.selected_pickaxe_ability || "none", true),
      crystals: {
        jade: {
          state: profile?.mining_core.crystals.jade_crystal.state,
          found: profile?.mining_core.crystals.jade_crystal.total_found || 0,
          placed: profile?.mining_core.crystals.jade_crystal.total_placed || 0,
        },
        amber: {
          state: profile?.mining_core.crystals.amber_crystal.state,
          found: profile?.mining_core.crystals.amber_crystal.total_found || 0,
          placed: profile?.mining_core.crystals.amber_crystal.total_placed || 0,
        },
        amethyst: {
          state: profile?.mining_core.crystals.amethyst_crystal.state,
          found: profile?.mining_core.crystals.amethyst_crystal.total_found || 0,
          placed: profile?.mining_core.crystals.amethyst_crystal.total_placed || 0,
        },
        sapphire: {
          state: profile?.mining_core.crystals.sapphire_crystal.state,
          found: profile?.mining_core.crystals.sapphire_crystal.total_found || 0,
          placed: profile?.mining_core.crystals.sapphire_crystal.total_placed || 0,
        },
        topaz: {
          state: profile?.mining_core.crystals.topaz_crystal.state,
          found: profile?.mining_core.crystals.topaz_crystal.total_found || 0,
          placed: profile?.mining_core.crystals.topaz_crystal.total_placed || 0,
        },
        jasper: {
          state: profile?.mining_core.crystals.jasper_crystal.state,
          found: profile?.mining_core.crystals.jasper_crystal.total_found || 0,
        },
        ruby: {
          state: profile?.mining_core.crystals.ruby_crystal.state,
          found: profile?.mining_core.crystals.ruby_crystal.total_found || 0,
        },
      },
      commissions: commissions,
    };
  } catch (error) {
    return null;
  }
};
