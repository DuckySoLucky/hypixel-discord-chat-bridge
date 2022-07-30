const axios = require('axios');
const nbt = require('prismarine-nbt');
const util = require('util');
const parseNbt = util.promisify(nbt.parse);
const config = require('../../config.json')

function getLastProfile(data, uuid) {
    const profiles = data.profiles;
    return profiles.sort((a, b) => a.members[uuid]?.last_save - b.members[uuid]?.last_save).at(-1);
}

async function getPlayer(player) {
    let response;

    response = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${player}`)
    const UUID = response.data.id

    if (!UUID) console.log('Player not found') // return 'Player not found!'

    response = await axios.get(`https://api.hypixel.net/skyblock/profiles?uuid=${UUID}&key=${config.api.hypixelAPIkey}`)
    const hypixelResponse = response.data

    if (!hypixelResponse) console.log('Couldn\'t get a response from the API') // return 'Couldn't get a response from the API'
    if (hypixelResponse.profiles === null) console.log(`Couldn\'t find any Skyblock profile that belongs to ${player}`) // return `Couldn\'t find any Skyblock profile that belongs to ${player}`

    let profile = await getLastProfile(hypixelResponse, UUID);

    profileData = hypixelResponse.profiles.find((p) => p.cute_name.toLowerCase() === profile.cute_name.toLowerCase())
    if (!profileData) console.log(`Couldn't find the specified Skyblock profile that belongs to ${player}.`) // return `Couldn't find the specified Skyblock profile that belongs to ${player}.`

    return { memberData: profileData.members[UUID], profileData, profiles: hypixelResponse.profiles };
}

async function decodeData(buffer) {
    const parsedNbt = await parseNbt(buffer);
    return nbt.simplify(parsedNbt);
}

module.exports = { getPlayer, decodeData }