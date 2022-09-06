const { decodeData, decodeArrayBuffer } = require("../utils/nbt");

module.exports = async (profile) => {
  if (profile.talisman_bag?.data) {
    const cakes = [];
    const talisman_bag = (
      await decodeData(Buffer.from(profile.talisman_bag.data, "base64"))
    ).i;

    for (const talisman of talisman_bag) {
      if (
        talisman?.tag?.display?.Name.includes("New Year Cake Bag") &&
        talisman?.tag?.ExtraAttributes?.new_year_cake_bag_data
      ) {
        const bag_contents = await decodeArrayBuffer(
          talisman.tag.ExtraAttributes.new_year_cake_bag_data
        );

        for (const cake of bag_contents) {
          if (cake?.tag?.ExtraAttributes?.new_years_cake)
            cakes.push(cake.tag.ExtraAttributes.new_years_cake);
        }
      }
    }

    return cakes;
  } else {
    return [];
  }
};
