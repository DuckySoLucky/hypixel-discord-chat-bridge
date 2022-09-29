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

        if (profileRes.data.hasOwnProperty('profiles') && profileRes.data.profiles == null) {
            return ({ status: 404, reason: `Found no SkyBlock profiles for a user with a UUID of '${uuid}'.` });
        }

        const result = [];

        for (const profileData of profileRes.data.profiles) {
            if (!isValidProfile(profileData.members, uuid)) {
                continue;
            }
            const profile = profileData.members[uuid];
            result.push(profile)
        }

        if (result.length == 0) return ({ status: 404, reason: `Found no SkyBlock profiles for a user with a UUID of '${uuid}'.` });

        return result.sort((a, b) => b.selected || b.last_save - a.last_save);
        const profileData = profileRes.data.profiles.find((a) => a.members[uuid].last_save === respond[0].last_save);

        return { profile: respond[0], profileData: profileData, playerRes: playerRes.data, player: player, uuid: uuid }
    }
    catch (error) {
        return ({ status: 404, reason: error });
    }
}

function isValidProfile(profileMembers, uuid) {
    return profileMembers.hasOwnProperty(uuid) && profileMembers[uuid].last_save != undefined;
}

module.exports = { getLatestProfile }
