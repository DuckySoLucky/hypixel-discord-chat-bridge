// CREDITS: by @Kathund (https://github.com/Kathund)
module.exports = (profile) => {
  try {
    if (profile?.jacobs_contest !== undefined) {
      return {
        medals: {
          gold: profile.jacobs_contest?.medals_inv?.gold ?? 0,
          silver: profile.jacobs_contest?.medals_inv?.silver ?? 0,
          bronze: profile.jacobs_contest?.medals_inv?.bronze ?? 0,
        },
        perks: {
          personalBests: profile.jacobs_contest.perks.personal_bests ?? false,
          levelCap: profile.jacobs_contest.perks.farming_level_cap ?? 0,
          doubleDrops: profile.jacobs_contest.perks.double_drops ?? 0,
        },
        personalBests: {
          netherWart: profile.jacobs_contest.personal_bests?.NETHER_STALK ?? 0,
          cocoBeans: profile.jacobs_contest.personal_bests?.["INK_SACK:3"] ?? 0,
          mushroom: profile.jacobs_contest.personal_bests?.MUSHROOM_COLLECTION ?? 0,
          wheat: profile.jacobs_contest.personal_bests?.WHEAT ?? 0,
          potato: profile.jacobs_contest.personal_bests?.POTATO_ITEM ?? 0,
          pumpkin: profile.jacobs_contest.personal_bests?.PUMPKIN ?? 0,
          carrot: profile.jacobs_contest.personal_bests?.CARROT_ITEM ?? 0,
          cactus: profile.jacobs_contest.personal_bests?.CACTUS ?? 0,
          melon: profile.jacobs_contest.personal_bests?.MELON ?? 0,
          sugarCane: profile.jacobs_contest.personal_bests?.SUGAR_CANE ?? 0,
        },
      };
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};
