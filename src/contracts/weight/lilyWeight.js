const LilyWeight = require("lilyweight");
const config = require("../../../config.json");
const lily = new LilyWeight(config.api.hypixelAPIkey);

async function getLilyWeightUsername(username) {
  return await lily.getWeightFromUsername(username);
}

async function getLilyWeight(uuid) {
  return await lily.getWeight(uuid);
}

module.exports = { getLilyWeight, getLilyWeightUsername };
