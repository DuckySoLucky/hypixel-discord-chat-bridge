const { getNetworth, getPrices } = require("skyhelper-networth")
const config = require("../config.json");
const fs = require("fs");

let prices = {};

const retrievePrices = async function () {
  prices = JSON.parse(fs.readFileSync("API/data/prices.json"));
  if (config.prices.refreshMessage)
    console.log("Prices retrieved successfully");
};

retrievePrices();
setInterval(() => retrievePrices(), 60 * 10000);

module.exports = async (profile, profileData) => {
  const bank = profileData?.banking?.balance || 0;
  const items = await itemGenerator.getItems(profile, prices);
  if (items.no_inventory) return { no_inventory: true };

  const networth = await networthGenerator.getNetworth(items, profile, bank);
  if (Object.keys(networth.categories).length < 0)
    return { no_inventory: true };

  return {
    total_networth: networth.networth,
    unsoulbound_networth: networth.unsoulbound_networth,
    purse: networth.purse,
    bank: networth.bank,
    personal_bank: networth.personal_bank,
    types: networth.categories,
  };
};
