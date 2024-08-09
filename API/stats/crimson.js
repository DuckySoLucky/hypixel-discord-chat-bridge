// CREDITS: by @Kathund (https://github.com/Kathund)
const { titleCase } = require("../constants/functions.js");
const { errorMessage } = require("../../src/Logger.js");

module.exports = (profile) => {
  try {
    const crimsonIsle = profile.nether_island_player_data ?? {};
    if (profile?.nether_island_player_data === undefined && profile?.trophy_fish === undefined) {
      return;
    }

    const dojo = {
      belt: getBelt(
        Object.keys(crimsonIsle.dojo ?? {})
          .filter((key) => key.startsWith("dojo_points"))
          .reduce((acc, key) => acc + (crimsonIsle.dojo[key] ?? 0), 0)
      ),
      force: {
        points: crimsonIsle.dojo?.dojo_points_mob_kb ?? 0,
        rank: getScore(crimsonIsle.dojo?.dojo_points_mob_kb ?? 0),
      },
      stamina: {
        points: crimsonIsle.dojo?.dojo_points_wall_jump ?? 0,
        rank: getScore(crimsonIsle.dojo?.dojo_points_wall_jump ?? 0),
      },
      mastery: {
        points: crimsonIsle.dojo?.dojo_points_archer ?? 0,
        rank: getScore(crimsonIsle.dojo?.dojo_points_archer ?? 0),
      },
      discipline: {
        points: crimsonIsle.dojo?.dojo_points_sword_swap ?? 0,
        rank: getScore(crimsonIsle.dojo?.dojo_points_sword_swap ?? 0),
      },
      swiftness: {
        points: crimsonIsle.dojo?.dojo_points_snake ?? 0,
        rank: getScore(crimsonIsle.dojo?.dojo_points_snake ?? 0),
      },
      control: {
        points: crimsonIsle.dojo?.dojo_points_lock_head ?? 0,
        rank: getScore(crimsonIsle.dojo?.dojo_points_lock_head ?? 0),
      },
      tenacity: {
        points: crimsonIsle.dojo?.dojo_points_fireball ?? 0,
        rank: getScore(crimsonIsle.dojo?.dojo_points_fireball ?? 0),
      },
    };

    return {
      faction: titleCase(crimsonIsle.selected_faction || "none"),
      reputation: {
        barbarian: crimsonIsle.barbarians_reputation ?? 0,
        mage: crimsonIsle.mages_reputation ?? 0,
      },
      kuudra: {
        basic: crimsonIsle.kuudra_completed_tiers?.none ?? 0,
        hot: crimsonIsle.kuudra_completed_tiers?.hot ?? 0,
        burning: crimsonIsle.kuudra_completed_tiers?.burning ?? 0,
        fiery: crimsonIsle.kuudra_completed_tiers?.fiery ?? 0,
        infernal: crimsonIsle.kuudra_completed_tiers?.infernal ?? 0,
      },
      dojo: dojo,
      trophyFishing: getTrophyFish(profile),
    };
  } catch (error) {
    errorMessage(error);
    return null;
  }
};

function getScore(points) {
  if (points >= 1000) {
    return "S";
  } else if (points >= 800) {
    return "A";
  } else if (points >= 600) {
    return "B";
  } else if (points >= 400) {
    return "C";
  } else if (points >= 200) {
    return "D";
  } else {
    return "F";
  }
}

function getBelt(points) {
  if (points >= 7000) {
    return "Black";
  } else if (points >= 6000) {
    return "Brown";
  } else if (points >= 4000) {
    return "Blue";
  } else if (points >= 2000) {
    return "Green";
  } else if (points >= 1000) {
    return "Yellow";
  }

  return "White";
}

function getTrophyFishRank(rewards) {
  const names = ["None", "Bronze", "Silver", "Gold", "Diamond"];

  return names[rewards];
}

function getTrophyFish(profile) {
  const trophyFish = profile?.trophy_fish ?? {};
  const trophyFishKeys = Object.keys(trophyFish);

  return {
    rank: getTrophyFishRank((trophyFish.rewards ?? []).length),
    caught: {
      total: trophyFish.total_caught ?? 0,
      bronze: trophyFishKeys.filter((key) => key.endsWith("_bronze")).length,
      silver: trophyFishKeys.filter((key) => key.endsWith("_silver")).length,
      gold: trophyFishKeys.filter((key) => key.endsWith("_gold")).length,
      diamond: trophyFishKeys.filter((key) => key.endsWith("_diamond")).length,
    },
  };
}
