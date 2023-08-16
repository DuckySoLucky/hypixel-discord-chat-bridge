const config = require("../../config.json");
const Logger = require("../../src/Logger.js");
const axios = require('axios');

const key = config.minecraft.API.skykingsAPIkey;

async function lookupUUID(uuid) {
    try {
        const response = await axios.get(
            `https://skykings.net/api/lookup?uuid=key=${key}&${uuid}`
        );
        return response.data.entries.length > 0;
    } catch (error) {
        await Logger.errorMessage(error.message);
        throw error
    }
}


module.exports = {
    lookupUUID
};
