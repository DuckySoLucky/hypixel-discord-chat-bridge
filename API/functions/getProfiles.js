const { isUuid } = require('../utils/uuid');
const config = require('../../config.json');
const axios = require('axios');

async function getProfiles(uuid) {
    try {
        if (!isUuid(uuid)) {
            const mojang_response = await axios.get(`https://api.ashcon.app/mojang/v2/user/${uuid}`)
            if (mojang_response?.data?.uuid) uuid = mojang_response.data.uuid.replace(/-/g, '');
        }

        const profiles = (await axios.get(`https://api.hypixel.net/skyblock/profiles?key=${config.api.hypixelAPIkey}&uuid=${uuid}`)).data

        return { status: 200, data: profiles }
    } catch (error) {
        return ({ status: 404, reason: error });
    }
}

module.exports = { getProfiles }

getProfiles('DeathStreeks').then(console.log)