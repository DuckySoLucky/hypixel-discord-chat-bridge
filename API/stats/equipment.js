const { toTimestamp } = require("../functions/helper.js");
const { decodeData } = require("../utils/nbt.js");

module.exports = async (profile) => {
  const equipmentContents = {
    necklace: [],
    cloak: [],
    belt: [],
    gloves: [],
  };

  if (profile.equippment_contents?.data) {
    const equipment = (
      await decodeData(Buffer.from(profile.equippment_contents?.data, "base64"))
    ).i;
    const equipmentPieces = ["necklace", "cloak", "belt", "gloves"];
    for (let i = 0; i < equipment.length; i++) {
      if (equipment[i].tag?.ExtraAttributes?.rarity_upgrades) {
        equipment[i].tag.ExtraAttributes.recombobulated =
          equipment[i].tag.ExtraAttributes.rarity_upgrades === 1 ? true : false;
        delete equipment[i].tag.ExtraAttributes.rarity_upgrades;
      }

      if (equipment[i].tag?.ExtraAttributes?.modifier) {
        equipment[i].tag.ExtraAttributes.reforge = equipment[i].tag
          .ExtraAttributes.modifier
          ? equipment[i].tag.ExtraAttributes.modifier
          : "None";
        delete equipment[i].tag.ExtraAttributes.modifier;
      }

      if (equipment[i].tag?.ExtraAttributes?.donated_museum) {
        equipment[i].tag.ExtraAttributes.soulbond =
          equipment[i].tag?.ExtraAttributes.donated_museum === 1 ? true : false;
        delete equipment[i].tag.ExtraAttributes.donated_museum;
      }

      if (equipment[i].tag?.ExtraAttributes?.timestamp) {
        equipment[i].tag.ExtraAttributes.timestamp =
          toTimestamp(equipment[i].tag.ExtraAttributes.timestamp) | null;
      }

      equipmentContents[equipmentPieces[i]] = equipment[i];
    }
  }

  return equipmentContents;
};
