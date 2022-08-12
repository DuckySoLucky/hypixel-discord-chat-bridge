const { isUuid } = require('../utils/uuid');
const config = require('../../config.json');
const axios = require('axios');

async function getProfile(uuid, profileid) {
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

        //const playerRes = await axios.get(`https://api.hypixel.net/player?key=${config.api.hypixelAPIkey}&uuid=${uuid}`);
        const profileRes = await axios.get(`https://api.hypixel.net/skyblock/profiles?key=${config.api.hypixelAPIkey}&uuid=${uuid}`);


        if (profileRes.data.hasOwnProperty('profiles') && profileRes.data.profiles == null) {
            return ({ status: 404, reason: `Found no SkyBlock profiles for a user with a UUID of '${uuid}' and profile of '${profileid}'` });
        }
        
        if (!isUuid(profileid)) {
            for (const profile of profileRes.data?.profiles || []) {
                if (profile.cute_name.toLowerCase() === profileid.toLowerCase()) {
                    profileid = profile.profile_id;
                }
            }
        }

        const profileData = profileRes.data.profiles.find((a) => a.profile_id === profileid);
        
        if (!profileData) {
            return ({ status: 404, reason: `Found no SkyBlock profiles for a user with a UUID of '${uuid}' and profile of '${profileid}'` });
        }

        if (!isValidProfile(profileData.members, uuid)) {
            return ({ status: 404, reason: `Found no SkyBlock profiles for a user with a UUID of '${uuid}'` });
        }

        const profile = profileData.members[uuid];
        
        return { profile: profile, profileData: profileData}


    } catch (error) {
        console.log(error)
    }
}

function isValidProfile(profileMembers, uuid) {
    return profileMembers.hasOwnProperty(uuid) && profileMembers[uuid].last_save != undefined;
}

module.exports = { getProfile }