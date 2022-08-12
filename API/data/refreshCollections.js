const axios = require('axios');
const fs = require('fs');

module.exports = async () => {
    async function refreshCollections() {
        const collections = [];

        const collections_res = (await axios.get('https://api.hypixel.net/resources/skyblock/collections')).data.collections;
        for (const type of Object.keys(collections_res)) {
            for (const collection_type of Object.keys(collections_res[type].items)) {
                const tiers = [];
                for (const tier of collections_res[type].items[collection_type].tiers) {
                    tiers.push({
                        tier: tier.tier,
                        amountRequired: tier.amountRequired,
                    });
                }

                collections.push({
                    name: collections_res[type].items[collection_type].name,
                    id: collection_type,
                    category: type,
                    maxTiers: collections_res[type].items[collection_type].maxTiers,
                    tiers,
                });
            }
        }
        fs.writeFileSync('./data/collections.json', JSON.stringify(collections, null, 2), (err) => {
            console.log(err);
        });

        const items_res = (await axios.get('https://api.hypixel.net/resources/skyblock/items')).data.items;
        fs.writeFileSync('./json/items.json', JSON.stringify(items_res, null, 2));
    }

    await refreshCollections();
    setInterval(async () => {
        await refreshCollections();
    }, 86400000); // 1 day
};
