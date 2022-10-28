const { calculateTotalSenitherWeight,} = require("../../../API/stats/senitherWeight");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile");

async function getSenitherWeight(username) {
  const profile = await getLatestProfile(username);
  return await calculateTotalSenitherWeight(profile.profile);
}

module.exports = { getSenitherWeight };
