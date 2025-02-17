const calcSkill = require("../constants/skills.js");

module.exports = (profile) => {
  return {
    level: calcSkill("gardenXp", profile?.garden_experience || 0),
    cropMilesstone: {
      wheat: calcSkill("wheat", profile?.resources_collected?.WHEAT || 0),
      carrot: calcSkill("carrot", profile?.resources_collected?.CARROT_ITEM || 0),
      sugarCane: calcSkill("sugarCane", profile?.resources_collected?.SUGAR_CANE || 0),
      potato: calcSkill("potato", profile?.resources_collected?.POTATO_ITEM || 0),
      netherWart: calcSkill("netherWart", profile?.resources_collected?.NETHER_STALK || 0),
      pumpkin: calcSkill("pumpkin", profile?.resources_collected?.PUMPKIN || 0),
      melon: calcSkill("melon", profile?.resources_collected?.MELON || 0),
      mushroom: calcSkill("mushroom", profile?.resources_collected?.MUSHROOM_COLLECTION || 0),
      cocoaBeans: calcSkill("cocoaBeans", profile?.resources_collected?.["INK_SACK:3"] || 0),
      cactus: calcSkill("cactus", profile?.resources_collected?.CACTUS || 0)
    }
  };
};
