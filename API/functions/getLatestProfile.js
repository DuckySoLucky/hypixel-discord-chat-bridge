const { isUuid } = require('../utils/uuid');
const config = require('../../config.json');
const { parseHypixel } = require('../utils/hypixel');
const axios = require('axios')

async function getLatestProfile(uuid) {
    try {
        if (!isUuid(uuid)) {
            try {
            const mojang_response = await axios.get(`https://api.ashcon.app/mojang/v2/user/${uuid}`)//.catch(error => {console.log(error)})
                if (mojang_response?.data?.uuid) {
                    uuid = mojang_response.data.uuid.replace(/-/g, '');
                }
            } catch (error) {
                return error.response.data
            }
        }

        const [ playerRes, profileRes ] = await Promise.all([
            axios.get(`https://api.hypixel.net/player?key=${config.api.hypixelAPIkey}&uuid=${uuid}`),
            axios.get(`https://api.hypixel.net/skyblock/profiles?key=${config.api.hypixelAPIkey}&uuid=${uuid}`)
        ]);
        const player = parseHypixel(playerRes, uuid);

        if (!profileRes.data.hasOwnProperty('profiles') && !profileRes.data.profiles) {
            return ({ status: 404, reason: `Found no SkyBlock profiles for a user with a UUID of '${uuid}'.` });
        }

        const result = [];

        for (const profileData of profileRes.data.profiles) {
            if (!Object.keys(profileData.members).includes(uuid)) {
                continue;
            }
            
            const profile = profileData.members[uuid];
            result.push(profile)
        }

        
        if (result.length == 0) return ({ status: 404, reason: `Found no SkyBlock profiles for a user with a UUID of '${uuid}'.` });

        const respond = result.sort((a, b) => b.selected);
        const profileData = profileRes.data.profiles.find((a) => a..selected);

        return { profile: respond[0], profileData: profileData, playerRes: playerRes.data, player: player, uuid: uuid }
    }
    catch (error) {
        return ({ status: 404, reason: error });
    }
}

module.exports = { getLatestProfile }
