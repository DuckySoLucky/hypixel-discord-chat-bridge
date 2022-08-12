const itemGenerator = require('../constants/maro_networth/generators/itemGenerator');
const networthGenerator = require('../constants/maro_networth/generators/networthGenerator');
const fs = require('fs');

let prices = {};

const retrievePrices = async function () {
    prices = JSON.parse(fs.readFileSync('./data/prices.json'));

    const moogma = (prices['moogma_leggings']?.price || 400000) / 20;
    const slug = (prices['slug_boots']?.price || 300000) / 15;
    prices['crimson_essence'] = { price: moogma > slug ? slug : moogma, name: 'Crimson Essence' };

    console.log('Prices retrieved successfully');
};

retrievePrices();
setInterval(() => retrievePrices(), 60 * 10000);

module.exports = async (profile, profileData) => {
    const bank = profileData?.banking?.balance || 0;
    const items = await itemGenerator.getItems(profile, prices);
    if (items.no_inventory) return { no_inventory: true };

    const networth = await networthGenerator.getNetworth(items, profile, bank);
    if (Object.keys(networth.categories).length < 0) return { no_inventory: true };

    return {
        total_networth: networth.networth,
        purse: networth.purse,
        bank: networth.bank,
        types: networth.categories,
    };
};
