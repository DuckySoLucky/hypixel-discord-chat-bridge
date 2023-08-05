const { talismans: allTalismans } = require("../constants/talismans.js");
const { capitalize, decodeData } = require("../../src/contracts/helperFunctions.js");

module.exports = async (profile) => {
  if (profile.talisman_bag?.data) {
    const talismans = {
      talismanBagUpgrades: profile.accessory_bag_storage?.bag_upgrades_purchased || 0,
      currentReforge: profile.accessory_bag_storage?.selected_power || null,
      unlockedReforges: profile.accessory_bag_storage?.unlocked_powers || [],
      tuningsSlots: profile.accessory_bag_storage.tuning?.highest_unlocked_slot || 0,
      tunings: profile?.accessory_bag_storage?.tuning || {},
      talismans: {
        common: [],
        uncommon: [],
        rare: [],
        epic: [],
        legendary: [],
        mythic: [],
        special: [],
        very: [],
      },
    };
    const talisman_bag = (await decodeData(Buffer.from(profile.talisman_bag.data, "base64"))).i;

    for (const talisman of talisman_bag) {
      if (talisman.tag?.display.Name && talisman.tag?.ExtraAttributes) {
        let name = talisman.tag?.display.Name.replace(/\u00A7[0-9A-FK-OR]/gi, "") || null;
        const reforge = capitalize(talisman.tag?.ExtraAttributes.modifier || null);
        if (reforge) name = name.substring(name.indexOf(" ") + 1);
        const isRecombed = talisman.tag?.ExtraAttributes.rarity_upgrades > 0 ? true : false || false;
        let new_talisman = {};

        if (
          getRarity(talisman.tag?.display.Lore) != "common" &&
          getRarity(talisman.tag?.display.Lore) != "uncommon" &&
          getRarity(talisman.tag?.display.Lore) != "rare" &&
          getRarity(talisman.tag?.display.Lore) != "epic"
        ) {
          new_talisman = {
            name: allTalismans[talisman.tag?.ExtraAttributes.id]?.name || name,
            id: talisman.tag?.ExtraAttributes.id || null,
            reforge: reforge ?? "None",
            rarity: getRarity(talisman.tag?.display.Lore).toUpperCase(),
            recombobulated: isRecombed,
            enrichment: talisman.tag?.ExtraAttributes?.talisman_enrichment,
          };
        } else {
          new_talisman = {
            name: allTalismans[talisman.tag?.ExtraAttributes.id]?.name || name,
            id: talisman.tag?.ExtraAttributes.id || null,
            reforge: reforge ?? "None",
            rarity: getRarity(talisman.tag?.display.Lore).toUpperCase(),
            recombobulated: isRecombed,
          };
        }

        if (talismans.talismans[getRarity(talisman.tag?.display.Lore)]) {
          talismans.talismans[getRarity(talisman.tag?.display.Lore)].push(new_talisman);
        } else {
          talismans.talismans[getRarity(talisman.tag?.display.Lore)] = new_talisman;
        }
      }
    }

    return talismans;
  } else {
    return {
      talismanBagUpgrades: profile.accessory_bag_storage?.bag_upgrades_purchased || 0,
      currentReforge: profile.accessory_bag_storage?.selected_power || null,
      unlockedReforges: profile.accessory_bag_storage?.unlocked_powers || [],
      tuningsSlots: profile.accessory_bag_storage?.tuning?.highest_unlocked_slot || 0,
      tunings: profile.accessory_bag_storage?.tuning || {},
      talismans: {
        common: [],
        uncommon: [],
        rare: [],
        epic: [],
        legendary: [],
        mythic: [],
        special: [],
        very: [],
      },
    };
  }
};

function getRarity(lore) {
  let last_index = lore[lore.length - 1];
  last_index = last_index.replace(/\u00A7[0-9A-FK-OR]/gi, "").toLowerCase();
  if (last_index.startsWith("a ")) last_index = last_index.substring(2);
  last_index = last_index.substring(0, last_index.indexOf(" "));
  return last_index;
}
