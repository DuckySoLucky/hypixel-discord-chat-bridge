// CREDITS: by @Kathund (https://github.com/Kathund)

/**
 * Returns Jacob's Contest stats of the specified user.
 * @param {import("../../types/profiles").Member} profile
 * @returns {import("./jacob.types").Jacob | null}
 */
function getJacob(profile) {
  try {
    if (profile?.jacobs_contest === undefined) {
      return null;
    }

    return {
      medals: {
        gold: profile.jacobs_contest.medals_inv?.gold ?? 0,
        silver: profile.jacobs_contest.medals_inv?.silver ?? 0,
        bronze: profile.jacobs_contest.medals_inv?.bronze ?? 0
      },
      perks: {
        levelCap: profile.jacobs_contest.perks?.farming_level_cap ?? 0,
        doubleDrops: profile.jacobs_contest.perks?.double_drops ?? 0
      },
      personalBests: {
        nether_wart: profile.jacobs_contest.personal_bests?.NETHER_STALK ?? 0,
        coco_beans: profile.jacobs_contest.personal_bests?.["INK_SACK:3"] ?? 0,
        mushroom: profile.jacobs_contest.personal_bests?.MUSHROOM_COLLECTION ?? 0,
        wheat: profile.jacobs_contest.personal_bests?.WHEAT ?? 0,
        potato: profile.jacobs_contest.personal_bests?.POTATO_ITEM ?? 0,
        pumpkin: profile.jacobs_contest.personal_bests?.PUMPKIN ?? 0,
        carrot: profile.jacobs_contest.personal_bests?.CARROT_ITEM ?? 0,
        cactus: profile.jacobs_contest.personal_bests?.CACTUS ?? 0,
        melon: profile.jacobs_contest.personal_bests?.MELON ?? 0,
        sugar_cane: profile.jacobs_contest.personal_bests?.SUGAR_CANE ?? 0
      }
    };
  } catch {
    return null;
  }
}

module.exports = {
  getJacob
};
