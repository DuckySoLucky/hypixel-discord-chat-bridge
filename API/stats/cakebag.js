const { decodeData, decodeArrayBuffer } = require("../utils/nbt.js");

module.exports = async (profile) => {
  if (profile.talisman_bag?.data) {
    const cakes = [];
    const talismanBag = (
      await decodeData(Buffer.from(profile.talisman_bag.data, "base64"))
    ).i;

    for (const talisman of talismanBag) {
      if (
        talisman?.tag?.display?.Name.includes("New Year Cake Bag") &&
        talisman?.tag?.ExtraAttributes?.new_year_cake_bag_data
      ) {
        const bagContents = await decodeArrayBuffer(
          talisman.tag.ExtraAttributes.new_year_cake_bag_data
        );

        for (const cake of bagContents) {
          if (cake?.tag?.ExtraAttributes?.new_years_cake)
            {cakes.push(cake.tag.ExtraAttributes.new_years_cake);}
        }
      }
    }

    return cakes;
  } else {
    return [];
  }
};
