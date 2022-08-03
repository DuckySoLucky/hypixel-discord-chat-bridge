const axios = require('axios')
const config = require('../../../config.json')
const PlayerDBAPI = require('./PlayerDBAPI')

async function getKeyData() {
    // https://api.hypixel.net/key?key=HYPIXEL_API_KEY
    const response = await axios.get(`${config.api.hypixelAPI}/?key=${config.api.hypixelAPIkey}`)
    if(response.data.success != true){return response.data.cause}
    return response.data
}
async function getPlayer(uuid) {
    // https://api.hypixel.net/player?key=HYPIXEL_API_KEY&uuid=PLAYER_UUID
    if (uuid.length != 32) uuid = await PlayerDBAPI.getUUID(uuid)
    const response = await axios.get(`${config.api.hypixelAPI}/player?key=${config.api.hypixelAPIkey}&uuid=${uuid}`)
    if(response.data.success != true){return response.data.cause}
    return response.data
}
async function getFriends(uuid) {
    // https://api.hypixel.net/friends?key=HYPIXEL_API_KEY&uuid=PLAYER_UUID
    if (uuid.length != 32) uuid = await PlayerDBAPI.getUUID(uuid)
    const response = await axios.get(`${config.api.hypixelAPI}/friends?key=${config.api.hypixelAPIkey}&uuid=${uuid}`)
    if(response.data.success != true){return response.data.cause}
    return response.data
}
async function getRecentGames(uuid) {
    // https://api.hypixel.net/recentgames?key=HYPIXEL_API_KEY&uuid=PLAYER_UUID
    if (uuid.length != 32) uuid = await PlayerDBAPI.getUUID(uuid)
    const response = await axios.get(`${config.api.hypixelAPI}/recentgames?key=${config.api.hypixelAPIkey}&uuid=${uuid}`)
    if(response.data.success != true){return response.data.cause}
    return response.data
}
async function getPlayerStatus(uuid) {
    // https://api.hypixel.net/status?key=HYPIXEL_API_KEY&uuid=PLAYER_UUID
    if (uuid.length != 32) uuid = await PlayerDBAPI.getUUID(uuid)
    const response = await axios.get(`${config.api.hypixelAPI}/status?key=${config.api.hypixelAPIkey}&uuid=${uuid}`)
    if(response.data.success != true){return response.data.cause}
    return response.data
}
async function getGuildData(uuid) {
    // https://api.hypixel.net/guild?key=HYPIXEL_API_KEY&player=PLAYER_UUID
    // https://api.hypixel.net/guild?key=HYPIXEL_API_KEY&name=WristSpasm
    // https://api.hypixel.net/guild?key=HYPIXEL_API_KEY&id=60d744c18ea8c9d0f50e8815
    if (uuid.length == 24) {response = await axios.get(`${config.api.hypixelAPI}/guild?key=${config.api.hypixelAPIkey}&id=${uuid}`)}
    else if (uuid.length == 32) {response = await axios.get(`${config.api.hypixelAPI}/guild?key=${config.api.hypixelAPIkey}&player=${uuid}`)}
    else {response = await axios.get(`${config.api.hypixelAPI}/guild?key=${config.api.hypixelAPIkey}&name=${uuid}`)}
    return response.data
}
async function getGamesData() {
    // https://api.hypixel.net/resources/games?key=HYPIXEL_API_KEY
    const response = await axios.get(`${config.api.hypixelAPI}/resources/games`)
    if(response.data.success != true){return response.data.cause}
    return response.data
}
async function getChallenges() {
    // https://api.hypixel.net/resources/challenges
    const response = await axios.get(`${config.api.hypixelAPI}/resources/challenges`)
    if(response.data.success != true){return response.data.cause}
    return response.data
}
async function getLeaderboards() {
    // https://api.hypixel.net/leaderboards
    const response = await axios.get(`${config.api.hypixelAPI}/leaderboards`)
    if(response.data.success != true){return response.data.cause}
    return response.data
}
async function getSkyblockElections() {
    // https://api.hypixel.net/resources/skyblock/election
    const response = await axios.get(`${config.api.hypixelAPI}/resources/skyblock/election`)
    if(response.data.success != true){return response.data.cause}
    return response.data
}
async function getSkyblockBingoData() {
    // https://api.hypixel.net/resources/skyblock/bingo
    const response = await axios.get(`${config.api.hypixelAPI}/resources/skyblock/bingo`)
    if(response.data.success != true){return response.data.cause}
    return response.data
}
async function getLatestSkyblockNews() {
    // https://api.hypixel.net/skyblock/news?key=HYPIXEL_API_KEY
    const response = await axios.get(`${config.api.hypixelAPI}/skyblock/news?key=${config.api.hypixelAPIkey}`)
    if(response.data.success != true){return response.data.cause}
    return response.data
}
async function getSkyblockCollections() {
    // https://api.hypixel.net/resources/skyblock/collections
    const response = await axios.get(`${config.api.hypixelAPI}/resources/skyblock/collecctions`)
    if(response.data.success != true){return response.data.cause}
    return response.data
}
async function getSkyblockSkills() {
    // https://api.hypixel.net/resources/skyblock/skills
    const response = await axios.get(`${config.api.hypixelAPI}/resources/skyblock/skills`)
    if(response.data.success != true){return response.data.cause}
    return response.data
}
async function getSkyblockItems() {
    // https://api.hypixel.net/resources/skyblock/items
    const response = await axios.get(`${config.api.hypixelAPI}/resources/skyblock/items`)
    if(response.data.success != true){return response.data.cause}
    return response.data
}
async function getSkyblockAuctions() {
    // https://api.hypixel.net/skyblock/auctions
    const response = await axios.get(`${config.api.hypixelAPI}/skyblock/auctions`)
    if(response.data.success != true){return response.data.cause}
    return response.data
}
async function getBoosters() {
    // https://api.hypixel.net/boosters?key=HYPIXEL_API_KEY
    const response = await axios.get(`${config.api.hypixelAPI}/boosters?key=${config.api.hypixelAPIkey}`)
    if(response.data.success != true){return response.data.cause}
    return response.data
}
async function getPlayerCount() {
    // https://api.hypixel.net/counts?key=HYPIXEL_API_KEY
    const response = await axios.get(`${config.api.hypixelAPI}/counts?key=${config.api.hypixelAPIkey}`)
    if(response.data.success != true){return response.data.cause}
    return response.data
}
async function getWatchDogData(){
    // https://api.hypixel.net/punishmentstats?key=HYPIXEL_API_KEY
    const response = await axios.get(`${config.api.hypixelAPI}/punishmentstats?key=${config.api.hypixelAPIkey}`)
    if(response.data.success != true){return response.data.cause}
    return response.data
}

module.exports = {getKeyData, getPlayer, getFriends, getRecentGames, getPlayerStatus, getGuildData, getGamesData, getChallenges, getLatestSkyblockNews, getSkyblockElections, getLeaderboards, getSkyblockBingoData, getSkyblockCollections, getSkyblockItems, getSkyblockItems, getSkyblockSkills, getSkyblockAuctions, getBoosters, getPlayerCount, getWatchDogData};