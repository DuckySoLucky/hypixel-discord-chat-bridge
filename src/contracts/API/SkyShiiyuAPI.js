const axios = require('axios')
const config = require('../../../config.json')

async function getProfile(username) {
    let profile = {}, response = await axios.get(`${config.api.skyShiiyuAPI}/profile/${username}`)
    if(response.status >= 300){return 'There is no player with the given UUID or name or the player has no Skyblock profiles'}
    Object.keys(response.data.profiles).forEach((key) => {if (response.data.profiles[key].current)profile = response.data.profiles[key]})
    return profile
}

async function getLatestProfileKey(username) {
    let returnKey, response = await axios.get(`${config.api.skyShiiyuAPI}/profile/${username}`)
    if(response.status >= 300){return 'There is no player with the given UUID or name or the player has no Skyblock profiles'}
    Object.keys(response.data.profiles).forEach((key) => {if (response.data.profiles[key].current)returnKey = key;})
    return returnKey;
}
async function getTalismans(username) {
    const response = await axios.get(`${config.api.skyShiiyuAPI}/talismans/${username}`)
    if(response.status >= 300){return 'There is no player with the given UUID or name or the player has no Skyblock profiles'}
    return response.data.profiles[await getLatestProfileKey(username)]
}

async function getSlayer(username) {
    const response = await axios.get(`${config.api.skyShiiyuAPI}/slayers/${username}`)
    if(response.status >= 300){return 'There is no player with the given UUID or name or the player has no Skyblock profiles'}
    return response.data.profiles[await getLatestProfileKey(username)]
}

async function getCoins(username) {
    const response = await axios.get(`${config.api.skyShiiyuAPI}/coins/${username}`)
    if(response.status >= 300){return 'There is no player with the given UUID or name or the player has no Skyblock profiles'}
    return response.data.profiles[await getLatestProfileKey(username)]
}

async function getBazaar() {
    let response = await axios.get(`${config.api.skyShiiyuAPI}/bazaar`)
    if(response.status >= 300){return 'Something went wrong, try again later.'}
    return response.data
}

async function getDungeons(username) {
    const response = await axios.get(`${config.api.skyShiiyuAPI}/dungeons/${username}`)
    if(response.status >= 300){return 'There is no player with the given UUID or name or the player has no Skyblock profiles'}
    return response.data.profiles[await getLatestProfileKey(username)]
}

module.exports = {getProfile, getTalismans, getSlayer, getCoins, getBazaar, getDungeons, getLatestProfileKey};