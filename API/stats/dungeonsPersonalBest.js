/**
 * Returns Personal Best Dungeons runs of the player.
 * @param {import("../../types/profiles").Member} profile
 * @returns {import("./dungeonsPersonalBest.types").PersonalBest | null}
 */
function getPersonalBest(profile) {
  try {
    const catacombs = profile?.dungeons?.dungeon_types.catacombs ?? {};
    const masterCatacombs = profile?.dungeons?.dungeon_types.master_catacombs ?? {};

    const availableFloors = Object.keys(profile?.dungeons?.dungeon_types.catacombs.times_played || [])
      .filter((floor) => floor !== "total" && floor !== "best")
      .map((floor) => parseInt(floor));

    /** @type {Partial<import("./dungeonsPersonalBest.types").PersonalBestFloor>} */
    const floors = {},
      master = {};
    for (let i = 0; i <= Math.max(...availableFloors); i++) {
      // @ts-ignore
      floors[`floor_${i}`] = {
        fastest: catacombs.fastest_time?.[i] ?? null,
        fastest_s: catacombs.fastest_time_s?.[i] || null,
        fastest_s_plus: catacombs.fastest_time_s_plus?.[i] || null
      };

      // @ts-ignore

      master[`floor_${i}`] = {
        fastest: masterCatacombs.fastest_time?.[i] ?? null,
        fastest_s: masterCatacombs.fastest_time_s?.[i] || null,
        fastest_s_plus: masterCatacombs.fastest_time_s_plus?.[i] || null
      };
    }

    return {
      // @ts-ignore
      normal: floors,
      // @ts-ignore
      master: master
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}

module.exports = { getPersonalBest };
