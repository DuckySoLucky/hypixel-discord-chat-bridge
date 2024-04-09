const { titleCase } = require("../constants/functions.js");

module.exports = (profile) => {
  try {
    if (profile?.nether_island_player_data !== undefined || profile?.trophy_fish !== undefined) {
      const dojo = {
        totalPoints: 0,
        belt: "unknown",
        force: {
          points: profile?.nether_island_player_data?.dojo?.dojo_points_mob_kb ?? 0,
          time: profile?.nether_island_player_data?.dojo?.dojo_time_mob_kb ?? 0,
          rank: "unknown",
        },
        stamina: {
          points: profile?.nether_island_player_data?.dojo?.dojo_points_wall_jump ?? 0,
          time: profile?.nether_island_player_data?.dojo?.dojo_time_wall_jump ?? 0,
          rank: "unknown",
        },
        mastery: {
          points: profile?.nether_island_player_data?.dojo?.dojo_points_archer ?? 0,
          time: profile?.nether_island_player_data?.dojo?.dojo_time_archer ?? 0,
          rank: "unknown",
        },
        discipline: {
          points: profile?.nether_island_player_data?.dojo?.dojo_points_sword_swap ?? 0,
          time: profile?.nether_island_player_data?.dojo?.dojo_time_sword_swap ?? 0,
          rank: "unknown",
        },
        swiftness: {
          points: profile?.nether_island_player_data?.dojo?.dojo_points_snake ?? 0,
          time: profile?.nether_island_player_data?.dojo?.dojo_time_snake ?? 0,
          rank: "unknown",
        },
        control: {
          points: profile?.nether_island_player_data?.dojo?.dojo_points_lock_head ?? 0,
          time: profile?.nether_island_player_data?.dojo?.dojo_time_lock_head ?? 0,
          rank: "unknown",
        },
        tenacity: {
          points: profile?.nether_island_player_data?.dojo?.dojo_points_fireball ?? 0,
          time: profile?.nether_island_player_data?.dojo?.dojo_time_fireball ?? 0,
          rank: "unknown",
        },
      };

      Object.keys(dojo).forEach((key) => {
        if (key === "totalPoints" || key === "belt") return;
        dojo[key].rank = getScore(dojo[key].points);
        dojo.totalPoints += dojo[key].points;
      });

      if (dojo.totalPoints >= 7000) {
        dojo.belt = "Black";
      } else if (dojo.totalPoints >= 6000) {
        dojo.belt = "Brown";
      } else if (dojo.totalPoints >= 4000) {
        dojo.belt = "Blue";
      } else if (dojo.totalPoints >= 2000) {
        dojo.belt = "Green";
      } else if (dojo.totalPoints >= 1000) {
        dojo.belt = "Yellow";
      } else {
        dojo.belt = "White";
      }

      const trophyFishing = {
        rank: getTrophyFishRank(profile?.trophy_fish?.rewards.length ?? 0),
        caught: {
          total: profile?.trophy_fish?.total_caught ?? 0,
          bronze: 0,
          silver: 0,
          gold: 0,
          diamond: 0,
        },
        sulphurSkitter: {
          total: profile?.trophy_fish?.sulphur_skitter ?? 0,
          bronze: profile?.trophy_fish?.sulphur_skitter_bronze ?? 0,
          silver: profile?.trophy_fish?.sulphur_skitter_silver ?? 0,
          gold: profile?.trophy_fish?.sulphur_skitter_gold ?? 0,
          diamond: profile?.trophy_fish?.sulphur_skitter_diamond ?? 0,
        },
        obfuscatedFish1: {
          total: profile?.trophy_fish?.obfuscated_fish_1 ?? 0,
          bronze: profile?.trophy_fish?.obfuscated_fish_1_bronze ?? 0,
          silver: profile?.trophy_fish?.obfuscated_fish_1_silver ?? 0,
          gold: profile?.trophy_fish?.obfuscated_fish_1_gold ?? 0,
          diamond: profile?.trophy_fish?.obfuscated_fish_1_diamond ?? 0,
        },
        steamingHotFlounder: {
          total: profile?.trophy_fish?.steaming_hot_flounder ?? 0,
          bronze: profile?.trophy_fish?.steaming_hot_flounder_bronze ?? 0,
          silver: profile?.trophy_fish?.steaming_hot_flounder_silver ?? 0,
          gold: profile?.trophy_fish?.steaming_hot_flounder_gold ?? 0,
          diamond: profile?.trophy_fish?.steaming_hot_flounder_diamond ?? 0,
        },
        obfuscatedFish2: {
          total: profile?.trophy_fish?.obfuscated_fish_2 ?? 0,
          bronze: profile?.trophy_fish?.obfuscated_fish_2_bronze ?? 0,
          silver: profile?.trophy_fish?.obfuscated_fish_2_silver ?? 0,
          gold: profile?.trophy_fish?.obfuscated_fish_2_gold ?? 0,
          diamond: profile?.trophy_fish?.obfuscated_fish_2_diamond ?? 0,
        },
        gusher: {
          total: profile?.trophy_fish?.gusher ?? 0,
          bronze: profile?.trophy_fish?.gusher_bronze ?? 0,
          silver: profile?.trophy_fish?.gusher_silver ?? 0,
          gold: profile?.trophy_fish?.gusher_gold ?? 0,
          diamond: profile?.trophy_fish?.gusher_diamond ?? 0,
        },
        blobfish: {
          total: profile?.trophy_fish?.blobfish ?? 0,
          bronze: profile?.trophy_fish?.blobfish_bronze ?? 0,
          silver: profile?.trophy_fish?.blobfish_silver ?? 0,
          gold: profile?.trophy_fish?.blobfish_gold ?? 0,
          diamond: profile?.trophy_fish?.blobfish_diamond ?? 0,
        },
        slugfish: {
          total: profile?.trophy_fish?.slugfish ?? 0,
          bronze: profile?.trophy_fish?.slugfish_bronze ?? 0,
          silver: profile?.trophy_fish?.slugfish_silver ?? 0,
          gold: profile?.trophy_fish?.slugfish_gold ?? 0,
          diamond: profile?.trophy_fish?.slugfish_diamond ?? 0,
        },
        obfuscatedFish3: {
          total: profile?.trophy_fish?.obfuscated_fish_3 ?? 0,
          bronze: profile?.trophy_fish?.obfuscated_fish_3_bronze ?? 0,
          silver: profile?.trophy_fish?.obfuscated_fish_3_silver ?? 0,
          gold: profile?.trophy_fish?.obfuscated_fish_3_gold ?? 0,
          diamond: profile?.trophy_fish?.obfuscated_fish_3_diamond ?? 0,
        },
        flyfish: {
          total: profile?.trophy_fish?.flyfish ?? 0,
          bronze: profile?.trophy_fish?.flyfish_bronze ?? 0,
          silver: profile?.trophy_fish?.flyfish_silver ?? 0,
          gold: profile?.trophy_fish?.flyfish_gold ?? 0,
          diamond: profile?.trophy_fish?.flyfish_diamond ?? 0,
        },
        lavaHorse: {
          total: profile?.trophy_fish?.lava_horse ?? 0,
          bronze: profile?.trophy_fish?.lava_horse_bronze ?? 0,
          silver: profile?.trophy_fish?.lava_horse_silver ?? 0,
          gold: profile?.trophy_fish?.lava_horse_gold ?? 0,
          diamond: profile?.trophy_fish?.lava_horse_diamond ?? 0,
        },
        volcanicStonefish: {
          total: profile?.trophy_fish?.volcanic_stonefish ?? 0,
          bronze: profile?.trophy_fish?.volcanic_stonefish_bronze ?? 0,
          silver: profile?.trophy_fish?.volcanic_stonefish_silver ?? 0,
          gold: profile?.trophy_fish?.volcanic_stonefish_gold ?? 0,
          diamond: profile?.trophy_fish?.volcanic_stonefish_diamond ?? 0,
        },
        vanille: {
          total: profile?.trophy_fish?.vanille ?? 0,
          bronze: profile?.trophy_fish?.vanille_bronze ?? 0,
          silver: profile?.trophy_fish?.vanille_silver ?? 0,
          gold: profile?.trophy_fish?.vanille_gold ?? 0,
          diamond: profile?.trophy_fish?.vanille_diamond ?? 0,
        },
        skeletonFish: {
          total: profile?.trophy_fish?.skeleton_fish ?? 0,
          bronze: profile?.trophy_fish?.skeleton_fish_bronze ?? 0,
          silver: profile?.trophy_fish?.skeleton_fish_silver ?? 0,
          gold: profile?.trophy_fish?.skeleton_fish_gold ?? 0,
          diamond: profile?.trophy_fish?.skeleton_fish_diamond ?? 0,
        },
        moldfin: {
          total: profile?.trophy_fish?.moldfin ?? 0,
          bronze: profile?.trophy_fish?.moldfin_bronze ?? 0,
          silver: profile?.trophy_fish?.moldfin_silver ?? 0,
          gold: profile?.trophy_fish?.moldfin_gold ?? 0,
          diamond: profile?.trophy_fish?.moldfin_diamond ?? 0,
        },
        soulFish: {
          total: profile?.trophy_fish?.soul_fish ?? 0,
          bronze: profile?.trophy_fish?.soul_fish_bronze ?? 0,
          silver: profile?.trophy_fish?.soul_fish_silver ?? 0,
          gold: profile?.trophy_fish?.soul_fish_gold ?? 0,
          diamond: profile?.trophy_fish?.soul_fish_diamond ?? 0,
        },
        manaRay: {
          total: profile?.trophy_fish?.mana_ray ?? 0,
          bronze: profile?.trophy_fish?.mana_ray_bronze ?? 0,
          silver: profile?.trophy_fish?.mana_ray_silver ?? 0,
          gold: profile?.trophy_fish?.mana_ray_gold ?? 0,
          diamond: profile?.trophy_fish?.mana_ray_diamond ?? 0,
        },
        karateFish: {
          total: profile?.trophy_fish?.karate_fish ?? 0,
          bronze: profile?.trophy_fish?.karate_fish_bronze ?? 0,
          silver: profile?.trophy_fish?.karate_fish_silver ?? 0,
          gold: profile?.trophy_fish?.karate_fish_gold ?? 0,
          diamond: profile?.trophy_fish?.karate_fish_diamond ?? 0,
        },
        goldenFish: {
          total: profile?.trophy_fish?.golden_fish ?? 0,
          bronze: profile?.trophy_fish?.golden_fish_bronze ?? 0,
          silver: profile?.trophy_fish?.golden_fish_silver ?? 0,
          gold: profile?.trophy_fish?.golden_fish_gold ?? 0,
          diamond: profile?.trophy_fish?.golden_fish_diamond ?? 0,
        },
      };

      Object.keys(trophyFishing).forEach((key) => {
        if (key === "rank" || key === "caught") return;
        trophyFishing.caught.bronze += trophyFishing[key].bronze;
        trophyFishing.caught.silver += trophyFishing[key].silver;
        trophyFishing.caught.gold += trophyFishing[key].gold;
        trophyFishing.caught.diamond += trophyFishing[key].diamond;
      });

      return {
        faction: titleCase(profile?.nether_island_player_data?.selected_faction || "none"),
        reputation: {
          barbarian: profile?.nether_island_player_data?.barbarians_reputation ?? 0,
          mage: profile?.nether_island_player_data?.mages_reputation ?? 0,
        },
        kuudra: {
          basic: profile?.nether_island_player_data?.kuudra_completed_tiers?.none ?? 0,
          hot: profile?.nether_island_player_data?.kuudra_completed_tiers?.hot ?? 0,
          burning: profile?.nether_island_player_data?.kuudra_completed_tiers?.burning ?? 0,
          fiery: profile?.nether_island_player_data?.kuudra_completed_tiers?.fiery ?? 0,
          infernal: profile?.nether_island_player_data?.kuudra_completed_tiers?.infernal ?? 0,
        },
        dojo: dojo,
        trophyFishing: trophyFishing,
      };
    } else {
      return null;
    }
  } catch (error) {
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

function getTrophyFishRank(rewards) {
  const names = ["None", "Bronze", "Silver", "Gold", "Diamond"];
  return names[rewards];
}
