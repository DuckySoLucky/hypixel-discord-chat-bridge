//CREDIT: https://github.com/Senither/hypixel-skyblock-facade (Modified)
const fs = require('fs');
const { isUuid } = require('../utils/uuid');
const axios = require('axios')

const retrieveAuctions = async function () {
    try {
        return JSON.parse(fs.readFileSync('API/data/auctions.json'));
    } catch (error) {
        if (error.toString().includes("ENOENT: no such file or directory, open '../data/auctions.json'")){ 
            return { status: 102, data: "Auctions haven't been updated yet. Please wait a bit" };
        } else {
            return { status: 404, data: error.toString() };
        }
    }
};

async function getUUID(uuid) {
    if (!isUuid(uuid)) {
        const mojang_response = (await axios.get(`https://api.ashcon.app/mojang/v2/user/${uuid}`));
        if (mojang_response?.data?.uuid) uuid = mojang_response.data.uuid.replace(/-/g, "");
    }
    return uuid;
}

async function getAuctionHouse(options = {lore: null, name: null, rarity: null, category: null, bin: null, lowest_price: null, highest_price: null, user: null, }) {
    const auctionsRes = await retrieveAuctions()

    let filteredAuctions = [];
    const searchData = {};

    searchData['lore'] = options?.lore?.toLowerCase()
    searchData['name'] = options?.name?.toLowerCase()
    searchData['rarity'] = options?.rarity?.toLowerCase()
    searchData['category'] = options?.category?.toLowerCase()
    searchData['bin'] = options?.bin?.toLowerCase()
    searchData['lowest_price'] = options?.lowest_price?.toLowerCase()
    searchData['highest_price'] = options?.highest_price?.toLowerCase()
    searchData['user'] = options?.user != undefined ? await getUUID(options?.user?.toLowerCase()) : null
    
    Object.keys(searchData).forEach((key) => {
        if (searchData[key] == null ||searchData[key] == undefined) delete searchData[key];
    });

    for (let auction of auctionsRes) {
        if (auction.end < Date.now()) continue;
        if (searchData.name) if (!auction.item_name.toLowerCase().includes(searchData.name)) continue;
        if (searchData.lore) if (!auction.item_lore.toLowerCase().includes(searchData.lore)) continue;
        if (searchData.rarity) if (!auction.tier.toLowerCase().includes(searchData.rarity)) continue;
        if (searchData.tier) if (!auction.tier.toLowerCase().includes(searchData.tier)) continue;
        if (searchData.category) if (!auction.category.toLowerCase().includes(searchData.category)) continue;
        if (searchData.bin) if (auction.bin.toString() != searchData.bin) continue;
        if (searchData.user) if (auction.auctioneer != searchData.user) continue;
        if (auction.bin) {
            if (searchData.lowest_price) if (!(parseInt(searchData.lowest_price) <= auction.starting_bid)) continue;
            if (searchData.highest_price) if (!(parseInt(searchData.highest_price) >= auction.starting_bid)) continue;
        } else {
            if (searchData.lowest_price) if (!(parseInt(searchData.lowest_price) <= auction.highest_bid_amount != 0 ?? !(parseInt(searchData.lowest_price) <= auction.starting_bid))) continue;
            if (searchData.highest_price) if (!(parseInt(searchData.highest_price) >= auction.highest_bid_amount != 0 ?? !(parseInt(searchData.lowest_price) <= auction.starting_bid))) continue;
        }
        auction.item_lore = auction.item_lore.split('\n')
        filteredAuctions.push(auction)
    }

    if (searchData?.filter) {
        // ? TO-DO
        // * Sort Auctions
        // const highestBid = filteredAuctions.sort((a, b) => b.highest_bid_amount - a.highest_bid_amount);
    }
    

    return { 
        status: 200, 
        found: filteredAuctions.length > 1,
        amount: filteredAuctions.length,
        filter: searchData,
        auctions: filteredAuctions
    };
}

getAuctionHouse(options = {lore: null, name: 'Hyperion', rarity: null, category: null, bin: null, lowest_price: null, highest_price: null, user: null }).then(console.log)