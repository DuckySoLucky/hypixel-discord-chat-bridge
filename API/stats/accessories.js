const { MAGICAL_POWER } = require("../constants/accessories.js");
const { decodeData } = require("../utils/nbt.js");

/**
 * Returns the amount of magical power an accessory provides.
 * @param {string} rarity
 * @param {string} rarity
 * @param {string} id
 * @returns {number}
 */
function getMagicalPower(rarity, id) {
  if (rarity === undefined) {
    return 0;
  }

  if (id !== null && typeof id === "string") {
    // Hegemony artifact provides double MP
    if (id === "HEGEMONY_ARTIFACT") {
      return 2 * (MAGICAL_POWER[rarity] ?? 0);
    }

    // Rift Prism grants 11 MP
    if (id === "RIFT_PRISM") {
      return 11;
    }
  }

  return MAGICAL_POWER[rarity] ?? 0;
}

/**
 * Returns the rarity of an accessory.
 * @param {string[]} lore
 * @returns {string}
 */
function getRarity(lore) {
  let last_index = lore[lore.length - 1];
  last_index = last_index.replace(/\u00A7[0-9A-FK-OR]/gi, "").toLowerCase();
  if (last_index.startsWith("a ")) last_index = last_index.substring(2);
  last_index = last_index.substring(0, last_index.indexOf(" "));
  return last_index;
}

/**
 *
 * @param {import("../../types/profiles.js").Member} profile
 * @returns {Promise<import("./accessories.types").Accessories | null>}
 */

async function getAccessories(profile) {
  try {
    /** @type {import("./accessories.types").Accessories}*/
    const output = {
      amount: 0,
      magicalPower: 0,
      recombed: 0,
      enriched: 0,
      rarities: {
        common: 0,
        uncommon: 0,
        rare: 0,
        epic: 0,
        legendary: 0,
        mythic: 0,
        special: 0,
        very: 0
      }
    };

    const talismanBag = profile.inventory?.bag_contents?.talisman_bag?.data ?? "";
    const accessories = (await decodeData(Buffer.from(talismanBag, "base64")))?.i;
    if (!accessories?.length) {
      return output;
    }

    for (const accessory of accessories) {
      if (accessory.tag === undefined) {
        continue;
      }

      const rarity = getRarity(accessory.tag.display.Lore);
      const id = accessory.tag.ExtraAttributes.id;

      output.amount++;
      output.rarities[rarity]++;
      output.magicalPower += getMagicalPower(rarity, id);
      output.recombed += accessory.tag.ExtraAttributes.rarity_upgrades ? 1 : 0;
      output.enriched += accessory.tag.ExtraAttributes.talisman_enrichment ? 1 : 0;
    }

    return output;
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = {
  getAccessories
};
