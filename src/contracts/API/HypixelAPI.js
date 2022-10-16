const axios = require('axios')
const config = require('../../../config.json')
const PlayerDBAPI = require('./PlayerDBAPI')

async function getKeyData() {
    // https://api.hypixel.net/key?key=HYPIXEL_API_KEY
    try {
        return (await axios.get(`${config.api.hypixelAPI}/?key=${config.api.hypixelAPIkey}`)).data
    } catch (error) {
        return error
    }
}

async function getPlayer(uuid) {
    // https://api.hypixel.net/player?key=HYPIXEL_API_KEY&uuid=PLAYER_UUID
    try {
        if (uuid.length.replaceAll('-', '') != 32) uuid = await PlayerDBAPI.getUUID(uuid)
        return (await axios.get(`${config.api.hypixelAPI}/player?key=${config.api.hypixelAPIkey}&uuid=${uuid}`)).data
    } catch (error) {
        return error
    }
}
async function getFriends(uuid) {
    // https://api.hypixel.net/friends?key=HYPIXEL_API_KEY&uuid=PLAYER_UUID
    if (uuid.length.replaceAll('-', '') != 32) uuid = await PlayerDBAPI.getUUID(uuid)
    return (await axios.get(`${config.api.hypixelAPI}/friends?key=${config.api.hypixelAPIkey}&uuid=${uuid}`)).data
}
async function getRecentGames(uuid) {
    // https://api.hypixel.net/recentgames?key=HYPIXEL_API_KEY&uuid=PLAYER_UUID
    try {
        if (uuid.length.replaceAll('-', '') != 32) uuid = await PlayerDBAPI.getUUID(uuid)
        return (await axios.get(`${config.api.hypixelAPI}/recentgames?key=${config.api.hypixelAPIkey}&uuid=${uuid}`)).data
    } catch (error) {
        return error
    }
}
async function getPlayerStatus(uuid) {
    // https://api.hypixel.net/status?key=HYPIXEL_API_KEY&uuid=PLAYER_UUID
    try {
        if (uuid.length.replaceAll('-', '') != 32) uuid = await PlayerDBAPI.getUUID(uuid)
        return (await axios.get(`${config.api.hypixelAPI}/status?key=${config.api.hypixelAPIkey}&uuid=${uuid}`)).data
    } catch (error) {
        return error
    }
}
async function getGuildData(uuid) {
    // https://api.hypixel.net/guild?key=HYPIXEL_API_KEY&player=PLAYER_UUID
    // https://api.hypixel.net/guild?key=HYPIXEL_API_KEY&name=WristSpasm
    // https://api.hypixel.net/guild?key=HYPIXEL_API_KEY&id=60d744c18ea8c9d0f50e8815
    try {
        if (uuid.length == 24) return (await axios.get(`${config.api.hypixelAPI}/guild?key=${config.api.hypixelAPIkey}&id=${uuid}`)).data
        else if (uuid.length.replaceAll('-', '') == 32) return (await axios.get(`${config.api.hypixelAPI}/guild?key=${config.api.hypixelAPIkey}&player=${uuid}`)).data
        else return (await axios.get(`${config.api.hypixelAPI}/guild?key=${config.api.hypixelAPIkey}&name=${uuid}`)).data
    } catch (error) {
        return error
    }
}
async function getGamesData() {
    // https://api.hypixel.net/resources/games?key=HYPIXEL_API_KEY
    try {
        return (await axios.get(`${config.api.hypixelAPI}/resources/games`)).data
    } catch (error) {
        return error
    }
}
async function getChallenges() {
    // https://api.hypixel.net/resources/challenges
    try {
        return (await axios.get(`${config.api.hypixelAPI}/resources/challenges`)).data
    } catch (error) {
        return error
    }
}
async function getLeaderboards() {
    // https://api.hypixel.net/leaderboards
    try {
        return (await axios.get(`${config.api.hypixelAPI}/leaderboards`)).data
    } catch (error) {
        return error
    }
}
async function getSkyblockElections() {
    // https://api.hypixel.net/resources/skyblock/election
    try {
        return (await axios.get(`${config.api.hypixelAPI}/resources/skyblock/election`)).data
    } catch (error) {
        return error
    }
}
async function getSkyblockBingoData() {
    // https://api.hypixel.net/resources/skyblock/bingo
    try {
        return (await axios.get(`${config.api.hypixelAPI}/resources/skyblock/bingo`)).data
    } catch (error) {
        return error
    }
}
async function getLatestSkyblockNews() {
    // https://api.hypixel.net/skyblock/news?key=HYPIXEL_API_KEY
    try {
        return (await axios.get(`${config.api.hypixelAPI}/skyblock/news?key=${config.api.hypixelAPIkey}`)).data
    } catch (error) {
        return error
    }
}
async function getSkyblockCollections() {
    // https://api.hypixel.net/resources/skyblock/collections
    try {
        return (await axios.get(`${config.api.hypixelAPI}/resources/skyblock/collecctions`)).data
    } catch (error) {
        return error
}
}
async function getSkyblockSkills() {
    // https://api.hypixel.net/resources/skyblock/skills
    try {
        return (await axios.get(`${config.api.hypixelAPI}/resources/skyblock/skills`)).data
    } catch (error) {
        return error
    }
}
async function getSkyblockItems() {
    // https://api.hypixel.net/resources/skyblock/items
    try {
        return (await axios.get(`${config.api.hypixelAPI}/resources/skyblock/items`)).data
    } catch (error) {
        return error
    }
}
async function getSkyblockAuctions() {
    // https://api.hypixel.net/skyblock/auctions
    try {
        return (await axios.get(`${config.api.hypixelAPI}/skyblock/auctions`)).data
    } catch (error) {
        return error
    }
}
async function getBoosters() {
    // https://api.hypixel.net/boosters?key=HYPIXEL_API_KEY
    try {
        return (await axios.get(`${config.api.hypixelAPI}/boosters?key=${config.api.hypixelAPIkey}`)).data
    } catch (error) {
        return error
    }
}
async function getPlayerCount() {
    // https://api.hypixel.net/counts?key=HYPIXEL_API_KEY
    try {
        return (await axios.get(`${config.api.hypixelAPI}/counts?key=${config.api.hypixelAPIkey}`)).data
    } catch (error) {
        return error
    }
}
async function getWatchDogData(){
    // https://api.hypixel.net/punishmentstats?key=HYPIXEL_API_KEY
    try {
        return (await axios.get(`${config.api.hypixelAPI}/punishmentstats?key=${config.api.hypixelAPIkey}`)).data
    } catch (error) {
        return error
    }
}

module.exports = {getKeyData, getPlayer, getFriends, getRecentGames, getPlayerStatus, getGuildData, getGamesData, getChallenges, getLatestSkyblockNews, getSkyblockElections, getLeaderboards, getSkyblockBingoData, getSkyblockCollections, getSkyblockItems, getSkyblockItems, getSkyblockSkills, getSkyblockAuctions, getBoosters, getPlayerCount, getWatchDogData};