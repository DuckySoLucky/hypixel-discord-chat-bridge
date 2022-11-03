const { calculateTotalSenitherWeight,} = require("../../../API/stats/senitherWeight.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");

async function getSenitherWeight(username) {
  const profile = await getLatestProfile(username);
  return await calculateTotalSenitherWeight(profile.profile);
}

module.exports = { getSenitherWeight };
