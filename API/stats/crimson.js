// CREDITS: by @Kathund (https://github.com/Kathund)
const { titleCase } = require("../../src/contracts/helperFunctions.js");

/**
 * Returns the Crimson Isle stats of a player.
 * @param {import("../../types/profiles.js").Member} profile
 * @returns {import("./crimson.types").CrimsonIsle | null}
 */
function getCrimsonIsle(profile) {
  try {
    const crimsonIsle = profile.nether_island_player_data;
    if (crimsonIsle === undefined) {
      return null;
    }

    return {
      faction: titleCase(crimsonIsle.selected_faction || "none"),
      reputation: {
        barbarian: crimsonIsle.barbarians_reputation ?? 0,
        mage: crimsonIsle.mages_reputation ?? 0
      }
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Returns the Dojo stats of a player.
 * @param {import("../../types/profiles.js").Member} profile
 * @returns {import("./crimson.types").Dojo | null}
 */
function getDojo(profile) {
  try {
    const crimsonIsle = profile.nether_island_player_data;
    if (crimsonIsle === undefined) {
      return null;
    }

    return {
      belt: getBelt(
        Object.keys(crimsonIsle.dojo ?? {})
          .filter((key) => key.startsWith("dojo_points"))
          .reduce((acc, key) => acc + (crimsonIsle.dojo[key] ?? 0), 0)
      ),
      force: {
        points: crimsonIsle.dojo?.dojo_points_mob_kb ?? 0,
        rank: getScore(crimsonIsle.dojo?.dojo_points_mob_kb ?? 0)
      },
      stamina: {
        points: crimsonIsle.dojo?.dojo_points_wall_jump ?? 0,
        rank: getScore(crimsonIsle.dojo?.dojo_points_wall_jump ?? 0)
      },
      mastery: {
        points: crimsonIsle.dojo?.dojo_points_archer ?? 0,
        rank: getScore(crimsonIsle.dojo?.dojo_points_archer ?? 0)
      },
      discipline: {
        points: crimsonIsle.dojo?.dojo_points_sword_swap ?? 0,
        rank: getScore(crimsonIsle.dojo?.dojo_points_sword_swap ?? 0)
      },
      swiftness: {
        points: crimsonIsle.dojo?.dojo_points_snake ?? 0,
        rank: getScore(crimsonIsle.dojo?.dojo_points_snake ?? 0)
      },
      control: {
        points: crimsonIsle.dojo?.dojo_points_lock_head ?? 0,
        rank: getScore(crimsonIsle.dojo?.dojo_points_lock_head ?? 0)
      },
      tenacity: {
        points: crimsonIsle.dojo?.dojo_points_fireball ?? 0,
        rank: getScore(crimsonIsle.dojo?.dojo_points_fireball ?? 0)
      }
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Returns the score rank of a dojo.
 * @param {number} points
 * @returns {string}
 */

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

/**
 * Returns the belt of a dojo.
 * @param {number} points
 * @returns {string}
 */
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

/**
 * Returns the Kuudra stats of a player.
 * @param {import("../../types/profiles.js").Member} profile
 * @returns {import("./crimson.types").Kuudra | null}
 */
function getKuudra(profile) {
  try {
    const crimsonIsle = profile.nether_island_player_data;
    if (!crimsonIsle) {
      return null;
    }

    return {
      basic: crimsonIsle.kuudra_completed_tiers?.none ?? 0,
      hot: crimsonIsle.kuudra_completed_tiers?.hot ?? 0,
      burning: crimsonIsle.kuudra_completed_tiers?.burning ?? 0,
      fiery: crimsonIsle.kuudra_completed_tiers?.fiery ?? 0,
      infernal: crimsonIsle.kuudra_completed_tiers?.infernal ?? 0
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Returns the trophy fish rank of a player.
 * @param {number} rewards
 * @returns {string}
 */
function getTrophyFishRank(rewards) {
  const names = ["None", "Bronze", "Silver", "Gold", "Diamond"];

  return names[rewards] ?? "None";
}

/**
 * Returns the trophy fish stats of a player.
 * @param {import("../../types/profiles.js").Member} profile
 * @returns {import("./crimson.types").TrophyFishing | null}
 */
function getTrophyFish(profile) {
  try {
    const trophyFish = profile?.trophy_fish;
    if (trophyFish === undefined) {
      return null;
    }

    const trophyFishKeys = Object.keys(trophyFish);
    return {
      rank: getTrophyFishRank(trophyFish.rewards ? trophyFish.rewards[trophyFish.rewards.length - 1] : 0),
      caught: {
        total: trophyFish.total_caught ?? 0,
        bronze: trophyFishKeys.filter((key) => key.endsWith("_bronze")).length,
        silver: trophyFishKeys.filter((key) => key.endsWith("_silver")).length,
        gold: trophyFishKeys.filter((key) => key.endsWith("_gold")).length,
        diamond: trophyFishKeys.filter((key) => key.endsWith("_diamond")).length
      }
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = {
  getCrimsonIsle,
  getTrophyFish,
  getKuudra,
  getDojo
};
