const { getNetworth, getPrices } = require("skyhelper-networth");
const config = require("../config.json");

let prices = {};

const retrievePrices = async function () {
  prices = await getPrices();
  if (config.prices.refreshMessage) {
    console.log("Prices retrieved successfully");
  }
};

retrievePrices();
setInterval(() => retrievePrices(), 15 * 1000 * 60); // 15 minutes

module.exports = async (profile, profileData) => {
  return await getNetworth(profile, profileData.banking?.balance || 0, prices);
};
