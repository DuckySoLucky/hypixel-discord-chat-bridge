const { getLevelByXp } = require("../constants/skills.js");

/**
 * Returns the garden stats of the user.
 * @param {import("../../types/garden.js").Garden} garden
 * @returns {import("./garden.types").Garden | null}
 */
function getGarden(garden) {
  try {
    if (!garden) {
      return null;
    }

    return {
      level: getLevelByXp(garden.garden_experience),
      cropMilesstone: {
        wheat: getLevelByXp(garden.resources_collected?.WHEAT, { type: "garden" }),
        carrot: getLevelByXp(garden.resources_collected?.CARROT_ITEM, { type: "CARROT_ITEM" }),
        sugarCane: getLevelByXp(garden.resources_collected?.SUGAR_CANE, { type: "SUGAR_CANE" }),
        potato: getLevelByXp(garden.resources_collected?.POTATO_ITEM, { type: "POTATO_ITEM" }),
        netherWart: getLevelByXp(garden.resources_collected?.NETHER_STALK, { type: "NETHER_STALK" }),
        pumpkin: getLevelByXp(garden.resources_collected?.PUMPKIN, { type: "PUMPKIN" }),
        melon: getLevelByXp(garden.resources_collected?.MELON, { type: "MELON" }),
        mushroom: getLevelByXp(garden.resources_collected?.MUSHROOM_COLLECTION, { type: "MUSHROOM_COLLECTION" }),
        cocoaBeans: getLevelByXp(garden.resources_collected?.["INK_SACK:3"], { type: "INK_SACK:3" }),
        cactus: getLevelByXp(garden.resources_collected?.CACTUS, { type: "CACTUS" })
      }
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = {
  getGarden
};
