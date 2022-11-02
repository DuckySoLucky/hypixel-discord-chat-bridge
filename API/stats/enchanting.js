const getSkills = require("./skills");

module.exports = (player, profile) => {
  const enchanting = {
    simon: {},
    pairings: {},
    numbers: {},
    claims_resets: 0,
    claims_resets_timestamp: "None",
  };
  if (profile.experimentation) {
    enchanting.simon = profile.experimentation.simon;
    enchanting.pairings = profile.experimentation.pairings;
    enchanting.numbers = profile.experimentation.numbers;
    enchanting.claims_resets = profile.experimentation.claims_resets;
    enchanting.claims_resets_timestamp =
      profile.experimentation.claims_resets_timestamp;
  }

  return {
    enchanting: getSkills(player, profile).enchanting?.level || 0,
    experimentation: enchanting,
  };
};
