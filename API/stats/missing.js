const getMissingTalismans = require("../constants/missing.js");
const { decodeData } = require("../utils/nbt.js");
const prices = require("../data/prices.json");

module.exports = async (profile) => {
  if (profile.talisman_bag?.data && profile.inv_contents?.data) {
    let talismans = (
      await decodeData(Buffer.from(profile.talisman_bag.data, "base64"))
    ).i;
    const inventory = (
      await decodeData(Buffer.from(profile.inv_contents.data, "base64"))
    ).i;
    talismans = talismans.concat(inventory);

    const talismanIDs = [];
    for (const talisman of talismans) {
      if (talisman?.tag?.ExtraAttributes?.id)
        {talismanIDs.push(talisman.tag.ExtraAttributes.id);}
    }
    const missing = {
      talismans: getMissingTalismans(talismanIDs),
      maxTalismans: getMissingTalismans(talismanIDs, "max"),
    };

    for (const talisman of missing.talismans) {
      talisman.price = getPrice(talisman.id) || null;
    }
    for (const talisman of missing.maxTalismans) {
      talisman.price = getPrice(talisman.id) || null;
    }
    missing.talismans.sort((a, b) => a.price - b.price);
    missing.maxTalismans.sort((a, b) => a.price - b.price);

    return missing;
  } else {
    return null;
  }
};

function getPrice(name) {
  name = name.toLowerCase();
  return prices[name]?.price || null;
}
