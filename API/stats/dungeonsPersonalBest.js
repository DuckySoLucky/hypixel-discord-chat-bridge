module.exports = (profile) => {
  try {
    const catacombs = profile?.dungeons?.dungeon_types.catacombs ?? {};
    const masterCatacombs = profile?.dungeons?.dungeon_types.master_catacombs ?? {};

    const availableFloors = Object.keys(profile?.dungeons?.dungeon_types.catacombs.times_played || [])
      .filter((floor) => floor !== "total" && floor !== "best")
      .map((floor) => parseInt(floor));

    const floors = {},
      master = {};
    for (let i = 0; i <= Math.max(...availableFloors); i++) {
      floors[`floor_${i}`] = {
        fastest: catacombs.fastest_time?.[i] ?? null,
        fastest_s: catacombs.fastest_time_s?.[i] || null,
        fastest_s_plus: catacombs.fastest_time_s_plus?.[i] || null
      };

      master[`floor_${i}`] = {
        fastest: masterCatacombs.fastest_time?.[i] ?? null,
        fastest_s: masterCatacombs.fastest_time_s?.[i] || null,
        fastest_s_plus: masterCatacombs.fastest_time_s_plus?.[i] || null
      };
    }

    return {
      normal: floors,
      master: master
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};
