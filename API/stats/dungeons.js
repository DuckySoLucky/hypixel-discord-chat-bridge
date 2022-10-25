const calcSkill = require("../constants/skills");
const { titleCase } = require("../constants/functions");

module.exports = (player, profile) => {
  try {
    const dungeons = profile?.dungeons;
    const catacombs = dungeons?.dungeon_types.catacombs;
    const master_catacombs = dungeons?.dungeon_types.master_catacombs;

    const floors = {};
    const available_floors = Object.keys(
      dungeons?.dungeon_types.catacombs.times_played || []
    );

    for (const floor in available_floors) {
      let floor_name = "entrance";
      if (floor != 0) floor_name = `floor_${floor}`;
      floors[floor_name] = {
        times_played: catacombs?.times_played
          ? catacombs?.times_played[floor] || 0
          : 0,
        completions: catacombs?.tier_completions
          ? catacombs?.tier_completions[floor] || 0
          : 0,
        best_score: {
          score: catacombs?.best_score ? catacombs?.best_score[floor] || 0 : 0,
          name: getScoreName(
            catacombs?.best_score ? catacombs?.best_score[floor] || 0 : 0
          ),
        },
        fastest: catacombs?.fastest_time
          ? catacombs?.fastest_time[floor] || 0
          : 0,
        fastest_s: catacombs?.fastest_time_s
          ? catacombs?.fastest_time_s[floor] || 0
          : 0,
        fastest_s_plus: catacombs?.fastest_time_s_plus
          ? catacombs?.fastest_time_s_plus[floor] || 0
          : 0,
        mobs_killed: catacombs?.mobs_killed
          ? catacombs?.mobs_killed[floor] || 0
          : 0,
      };
    }

    const master_mode_floors = {};

    for (
      let i = 1;
      i <= dungeons?.dungeon_types.master_catacombs.highest_tier_completed;
      i++
    ) {
      master_mode_floors[`floor_${i}`] = {
        completions: master_catacombs?.tier_completions[i] ?? 0,
        best_score: {
          score: master_catacombs?.best_score[i] ?? 0,
          name: getScoreName(master_catacombs?.best_score[i] ?? 0),
        },
        fastest: master_catacombs?.fastest_time[i] ?? 0,
        fastest_s: master_catacombs?.fastest_time_s[i] ?? 0,
        fastest_s_plus: master_catacombs?.fastest_time_s_plus?.[i] || 0,
        mobs_killed: master_catacombs?.mobs_killed[i] ?? 0,
      };
    }

    const highest_tier_completed = master_catacombs?.highest_tier_completed
      ? `M${master_catacombs?.highest_tier_completed}`
      : catacombs?.highest_tier_completed
      ? `F${catacombs?.highest_tier_completed}`
      : null;

    const perks = {
      catacombs_boss_luck: profile?.perks.catacombs_boss_luck ?? 0,
      catacombs_looting: profile?.perks.catacombs_looting ?? 0,
      catacombs_intelligence: profile?.perks.catacombs_intelligence ?? 0,
      catacombs_health: profile?.perks.catacombs_health ?? 0,
      catacombs_strength: profile?.perks.catacombs_strength ?? 0,
      catacombs_crit_damage: profile?.perks.catacombs_crit_damage ?? 0,
      catacombs_defense: profile?.perks.catacombs_defense ?? 0,
      permanent_speed: profile?.perks.permanent_defense ?? 0,
      permanent_intelligence: profile?.perks.permanent_intelligence ?? 0,
      permanent_health: profile?.perks.permanent_health ?? 0,
      permanent_defense: profile?.perks.permanent_defense ?? 0,
      permanent_strength: profile?.perks.permanent_strength ?? 0,
      forbidden_blessing: profile?.perks.forbidden_blessing ?? 0,
      revive_stone: profile?.perks.revive_stone ?? 0,
    };

    return {
      selected_class: titleCase(dungeons?.selected_dungeon_class),
      secrets_found: player.dungeons.secrets,
      classes: {
        healer: calcSkill(
          "dungeoneering",
          dungeons?.player_classes.healer.experience || 0
        ),
        mage: calcSkill(
          "dungeoneering",
          dungeons?.player_classes.mage.experience || 0
        ),
        berserk: calcSkill(
          "dungeoneering",
          dungeons?.player_classes.berserk.experience || 0
        ),
        archer: calcSkill(
          "dungeoneering",
          dungeons?.player_classes.archer.experience || 0
        ),
        tank: calcSkill(
          "dungeoneering",
          dungeons?.player_classes.tank.experience || 0
        ),
      },
      catacombs: {
        skill: calcSkill(
          "dungeoneering",
          dungeons?.dungeon_types.catacombs.experience || 0
        ),
        perks,
        highest_tier_completed,
        floors,
        master_mode_floors,
      },
    };
  } catch (error) {
    return null;
  }
};

function getScoreName(score) {
  if (score >= 300) return "S+";
  if (score >= 270) return "S";
  if (score >= 240) return "A";
  if (score >= 175) return "B";
  return "C";
}
