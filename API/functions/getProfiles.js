const { isUuid } = require('../utils/uuid');
const config = require('../../config.json');
const axios = require('axios')

async function getProfiles(uuid) {
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

        const playerRes = await axios.get(`https://api.hypixel.net/player?key=${config.API.hypixelAPIkey}&uuid=${uuid}`);
        const profileRes = await axios.get(`https://api.hypixel.net/skyblock/profiles?key=${config.API.hypixelAPIkey}&uuid=${uuid}`);

        if (profileRes.data.hasOwnProperty('profiles') && profileRes.data.profiles == null) {
            res.status(404).json({ status: 404, reason: `Found no SkyBlock profiles for a user with a UUID of '${uuid}'.` });
            return;
        }

        const result = [];

        for (const profileData of profileRes.data.profiles) {
            if (!isValidProfile(profileData.members, uuid)) {
                continue;
            }
            const profile = profileData.members[uuid];

            const result = profile

        }
        if (result.length == 0) res.status(404).json({ status: 404, reason: `Found no SkyBlock profiles for a user with a UUID of '${uuid}'.` });
        return result.sort((a, b) => b.last_save - a.last_save);
    }
    catch (error) {
        console.log(error)
    }
}

function isValidProfile(profileMembers, uuid) {
    return profileMembers.hasOwnProperty(uuid) && profileMembers[uuid].last_save != undefined;
}

module.exports = { getProfiles }