const { decodeData, decodeArrayBuffer } = require("../utils/nbt.js");

module.exports = async (profile) => {
  if (profile.talisman_bag?.data) {
    const CAKES = [];
    const TALISMAN_BAG = (
      await decodeData(Buffer.from(profile.talisman_bag.data, "base64"))
    ).i;

    for (const talisman of TALISMAN_BAG) {
      if (
        talisman?.tag?.display?.Name.includes("New Year Cake Bag") &&
        talisman?.tag?.ExtraAttributes?.new_year_cake_bag_data
      ) {
        const BAG_CONTENTS = await decodeArrayBuffer(
          talisman.tag.ExtraAttributes.new_year_cake_bag_data
        );

        for (const cake of BAG_CONTENTS) {
          if (cake?.tag?.ExtraAttributes?.new_years_cake) {
            CAKES.push(cake.tag.ExtraAttributes.new_years_cake);
          }
        }
      }
    }

    return CAKES;
  } else {
    return [];
  }
};
