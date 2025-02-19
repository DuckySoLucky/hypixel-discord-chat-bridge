const { getLevelByXp } = require("../constants/skills.js");

module.exports = (profile) => {
  return {
    level: getLevelByXp(profile?.garden_experience),
    cropMilesstone: {
      wheat: getLevelByXp(profile?.resources_collected?.WHEAT, { type: "garden" }),
      carrot: getLevelByXp(profile?.resources_collected?.CARROT_ITEM, { type: "CARROT_ITEM" }),
      sugarCane: getLevelByXp(profile?.resources_collected?.SUGAR_CANE, { type: "SUGAR_CANE" }),
      potato: getLevelByXp(profile?.resources_collected?.POTATO_ITEM, { type: "POTATO_ITEM" }),
      netherWart: getLevelByXp(profile?.resources_collected?.NETHER_STALK, { type: "NETHER_STALK" }),
      pumpkin: getLevelByXp(profile?.resources_collected?.PUMPKIN, { type: "PUMPKIN" }),
      melon: getLevelByXp(profile?.resources_collected?.MELON, { type: "MELON" }),
      mushroom: getLevelByXp(profile?.resources_collected?.MUSHROOM_COLLECTION, { type: "MUSHROOM_COLLECTION" }),
      cocoaBeans: getLevelByXp(profile?.resources_collected?.["INK_SACK:3"], { type: "INK_SACK:3" }),
      cactus: getLevelByXp(profile?.resources_collected?.CACTUS, { type: "CACTUS" })
    }
  };
};
