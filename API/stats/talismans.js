const { decodeData } = require("../../src/contracts/helperFunctions.js");
const { titleCase } = require("../constants/functions.js");

module.exports = async (profile) => {
  try {
    const names = [];
    const output = {
      mythic: 0,
      legendary: 0,
      epic: 0,
      rare: 0,
      uncommon: 0,
      common: 0,
      special: 0,
      very: 0,
      recombed: 0,
      enriched: 0,
      total: 0,
      magicPower: 0,
      power: "unknown",
    };
    if (
      profile.inventory?.bag_contents?.talisman_bag.data !== undefined &&
      profile.inventory?.inv_contents?.data !== null
    ) {
      const { i: talisman_bag_data } = await decodeData(
        Buffer.from(profile.inventory.bag_contents.talisman_bag.data, "base64"),
      );

      output.power = titleCase(profile.accessory_bag_storage?.selected_power);

      for (const talisman of talisman_bag_data) {
        if (talisman?.tag?.ExtraAttributes === undefined) {
          continue;
        }

        output.total++;
        output[getRarity(talisman.tag.display.Lore)]++;

        if (!names.includes(talisman.tag.ExtraAttributes.id)) {
          if (talisman.tag.ExtraAttributes.id === "ABICASE") {
            output.magicPower += Math.floor(profile.nether_island_player_data.abiphone.active_contacts.length / 2);
            output.magicPower += power[getRarity(talisman.tag.display.Lore)]
          } else if (talisman.tag.ExtraAttributes.id === "HEGEMONY_ARTIFACT") {
            output.magicPower += power[getRarity(talisman.tag.display.Lore)] * 2;
          } else {
            output.magicPower += power[getRarity(talisman.tag.display.Lore)];
          }

          if (
            talisman.tag.ExtraAttributes.id === "PARTY_HAT_CRAB_ANIMATED" ||
            talisman.tag.ExtraAttributes.id === "PARTY_HAT_CRAB"
          ) {
            names.push("PARTY_HAT_CRAB");
            names.push("PARTY_HAT_CRAB_ANIMATED");
          } else {
            names.push(talisman.tag.ExtraAttributes.id);
          }
        }

        if (talisman.tag.ExtraAttributes?.rarity_upgrades !== undefined) {
          output.recombed++;
        }

        if (talisman.tag.ExtraAttributes?.talisman_enrichment !== undefined) {
          output.enriched++;
        }
      }
      if (profile?.rift?.access?.consumed_prism === true) {
        output.magicPower += 11
      }

      return output;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
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

const power = {
  mythic: 22,
  legendary: 16,
  epic: 12,
  rare: 8,
  uncommon: 5,
  common: 3,
  special: 3,
  very: 5,
};
