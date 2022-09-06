const constants = require("../constants/farming");
const getSkills = require("./skills");

module.exports = (player, profile) => {
  const jacob = {
    talked: profile.jacob2?.talked || false,
  };
  const trapper_quest = {
    last_task_time: "None",
    pelt_count: 0,
  };

  if (profile.trapper_quest) {
    trapper_quest.last_task_time = profile.trapper_quest?.last_task_time
      ? profile.trapper_quest?.last_task_time
      : "None";
    trapper_quest.pelt_count = profile.trapper_quest.pelt_count ?? 0;
  }

  if (jacob.talked) {
    jacob.medals = {
      bronze: profile.jacob2.medals_inv.bronze || 0,
      silver: profile.jacob2.medals_inv.silver || 0,
      gold: profile.jacob2.medals_inv.gold || 0,
    };
    jacob.total_badges = {
      bronze: 0,
      silver: 0,
      gold: 0,
    };
    jacob.perks = {
      double_drops: profile.jacob2.perks?.double_drops || 0,
      farming_level_cap: profile.jacob2.perks?.farming_level_cap || 0,
    };
    jacob.unique_golds = profile.jacob2.unique_golds2?.length || 0;
    jacob.crops = {};

    for (const crop in constants.jacob_crops) {
      jacob.crops[crop] = constants.jacob_crops[crop];

      Object.assign(jacob.crops[crop], {
        participated: false,
        unique_gold: profile.jacob2.unique_golds2?.includes(crop) || false,
        contests: 0,
        personal_best: 0,
        badges: {
          gold: 0,
          silver: 0,
          bronze: 0,
        },
      });
    }

    const contests = {
      attended_contests: 0,
      all_contests: [],
    };

    for (const contest_id in profile.jacob2.contests) {
      const data = profile.jacob2.contests[contest_id];
      const contest_name = contest_id.split(":");
      const date = `${contest_name[1]}_${contest_name[0]}`;
      const crop = contest_name.slice(2).join(":");

      jacob.crops[crop].contests++;
      jacob.crops[crop].participated = true;
      if (data.collected > jacob.crops[crop].personal_best)
        jacob.crops[crop].personal_best = data.collected;

      const contest = {
        date: date,
        crop: crop,
        collected: data.collected,
        claimed: data.claimed_rewards || false,
        medal: null,
      };

      const placing = {};
      if (contest.claimed) {
        placing.position = data.claimed_position || 0;
        placing.percentage =
          (data.claimed_position / data.claimed_participants) * 100;

        if (placing.percentage <= 5) {
          contest.medal = "gold";
          jacob.total_badges.gold++;
          jacob.crops[crop].badges.gold++;
        } else if (placing.percentage <= 25) {
          contest.medal = "silver";
          jacob.total_badges.silver++;
          jacob.crops[crop].badges.silver++;
        } else if (placing.percentage <= 60) {
          contest.medal = "bronze";
          jacob.total_badges.bronze++;
          jacob.crops[crop].badges.bronze++;
        }
      }

      contest.placing = placing;
      contests.attended_contests++;
      contests.all_contests.push(contest);
    }

    jacob.contests = contests;
  }

  return {
    farming: getSkills(player, profile).farming?.level || 0,
    trapper_quest,
    jacob,
  };
};
