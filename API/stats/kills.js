const { titleCase } = require("../constants/functions.js");
const mobs = require("../constants/mobs.js");

module.exports = (profile) => {
  const stats = profile?.stats;
  if (stats) {
    const kills = [];

    for (const mob in stats) {
      if (mob.startsWith("kills_") && stats[mob] > 0) {
        kills.push({
          name: mob.replace("kills_", ""),
          id: mob.replace("kills_", ""),
          kills: stats[mob],
        });
      }
    }

    for (const mob of kills) {
      if (mob in mobs) {
        mob.name = mobs[mob];
      }
      mob.name = titleCase(mob.name.replace(/_/g, " "));
    }

    return {
      totalKills: stats.kills,
      types: kills.sort((a, b) => b.kills - a.kills),
    };
  } else {
    return [];
  }
};
