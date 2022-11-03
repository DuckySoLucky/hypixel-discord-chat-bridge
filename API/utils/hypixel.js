const getRank = require("../stats/rank.js");
const getHypixelLevel = require("../stats/hypixelLevel.js");

function parseHypixel(playerRes, uuid, res) {
  if (playerRes.data.player === undefined) {
    return res.status(404).json({
      status: 404,
      reason: `Found no Player data for a user with a UUID of '${uuid}'`,
    });
  }
  const data = playerRes.data.player;
  const achievements = data.achievements;

  return {
    name: data.displayname,
    rank: getRank(data),
    hypixelLevel: getHypixelLevel(data),
    karma: data.karma,
    skills: {
      mining: achievements?.skyblock_excavator || 0,
      foraging: achievements?.skyblock_gatherer || 0,
      enchanting: achievements?.skyblock_augmentation || 0,
      farming: achievements?.skyblock_harvester || 0,
      combat: achievements?.skyblock_combat || 0,
      fishing: achievements?.skyblock_angler || 0,
      alchemy: achievements?.skyblock_concoctor || 0,
      taming: achievements?.skyblock_domesticator || 0,
    },
    dungeons: {
      secrets: achievements?.skyblock_treasure_hunter || 0,
    },
  };
}

module.exports = { parseHypixel };
