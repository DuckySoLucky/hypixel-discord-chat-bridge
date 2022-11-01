const { decodeData } = require("../utils/nbt.js");
const getMissingTalismans = require("../constants/missing.js");

module.exports = async (profile) => {
  if (profile.talisman_bag?.data && profile.inv_contents?.data) {
    let talismans = (
      await decodeData(Buffer.from(profile.talisman_bag.data, "base64"))
    ).i;
    const inventory = (
      await decodeData(Buffer.from(profile.inv_contents.data, "base64"))
    ).i;
    talismans = talismans.concat(inventory);

    const talismanIds = [];
    for (const talisman of talismans) {
      if (talisman?.tag?.ExtraAttributes?.id) {
        talismanIds.push(talisman.tag.ExtraAttributes.id);
      }
    }
    const missing = {
      talismans: getMissingTalismans(talismanIds),
      maxTalismans: getMissingTalismans(talismanIds, "max"),
    };

    return missing;
  } else {
    return null;
  }
};
