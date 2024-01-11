const { decodeData } = require("../../src/contracts/helperFunctions.js");

module.exports = async (profile) => {
  try {
    const output = {
      common: 0,
      uncommon: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
      mythic: 0,
      special: 0,
      very: 0,
      recombed: 0,
      enriched: 0,
      total: 0,
    };
    if (profile.talisman_bag?.data !== undefined && profile.inv_contents?.data !== null) {
      const { i: talisman_bag_data } = await decodeData(Buffer.from(profile.talisman_bag.data, "base64"));

      for (const talisman of talisman_bag_data) {
        if (talisman?.tag?.ExtraAttributes === undefined) {
          continue;
        }

        output.total++;
        output[getRarity(talisman.tag.display.Lore)]++;

        if (talisman.tag.ExtraAttributes?.rarity_upgrades !== undefined) {
          output.recombed++;
        }

        if (talisman.tag.ExtraAttributes?.talisman_enrichment !== undefined) {
          output.enriched++;
        }
      }

      return output;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

function getRarity(lore) {
  let last_index = lore[lore.length - 1];
  last_index = last_index.replace(/\u00A7[0-9A-FK-OR]/gi, "").toLowerCase();
  if (last_index.startsWith("a ")) last_index = last_index.substring(2);
  last_index = last_index.substring(0, last_index.indexOf(" "));
  return last_index;
}
