//CREDIT: https://github.com/Senither/hypixel-skyblock-facade (Modified)
const { isUuid } = require("../utils/uuid");
const { parseProfileItems, parseHypixel, parseProfilesItems } = require("../utils/hypixel");
const config = require('../../config.json');
const axios = require('axios')

async function getItems(uuid, profile) {
    let profileid
    if (profile != undefined) profileid = profile 

    if (!isUuid(uuid)) {
        const mojang_response = (await axios.get(`https://api.ashcon.app/mojang/v2/user/${uuid}`));
        if (mojang_response?.data?.uuid) {
        uuid = mojang_response.data.uuid.replace(/-/g, "");
        }
    }

    const [playerRes, profileRes] = await Promise.all([
        await axios.get(`https://api.hypixel.net/player?key=${config.api.hypixelAPIkey}&uuid=${uuid}`),
        await axios.get(`https://api.hypixel.net/skyblock/profiles?key=${config.api.hypixelAPIkey}&uuid=${uuid}`),
    ]);
    const player = parseHypixel(playerRes, uuid);


    if (profile) {
        profile = await parseProfileItems(player, profileRes, uuid, profileid);
    } else {
        profile = await parseProfilesItems(player, profileRes, uuid);
    }

    return { status: 200, data: profile };
};

module.exports = { getItems }
