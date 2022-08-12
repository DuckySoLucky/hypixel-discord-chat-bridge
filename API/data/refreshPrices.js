const axios = require('axios');
const fs = require('fs');

module.exports = async function refreshPrices() {
    async function updatePrices() {
        let request;
        try {
            request = await axios.get('https://raw.githubusercontent.com/SkyHelperBot/Prices/master/prices.json');
        } catch (err) {
            return console.log('Failed to update prices: ', err);
        }

        if (request.status === 200) {
            fs.writeFileSync('./data/prices.json', JSON.stringify(request.data, null, 2));
            console.log('[PRICES] Prices updated successfully');
        } else {
            console.log('[PRICES] Failed to update prices: ', request.status);
        }
    }

    updatePrices();
    setInterval(async () => {
        updatePrices();
    }, 1000 * 60 * 15); // 15 minutes
};
