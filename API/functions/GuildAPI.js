const axios = require('axios');
const config = require('../../config');
const { getUUID } = require("../../src/contracts/API/PlayerDBAPI.js");

const guildCache = new Map();
const playerCache = new Map();

async function fetchGuildAPI() {
    const hypixelAPIkey = config.minecraft.API.hypixelAPIkey;
    const guildId = config.minecraft.guild.GuildID;
    const guildAPIUrl = `https://api.hypixel.net/v2/guild?key=${hypixelAPIkey}&id=${guildId}`;

    console.log("Guild API URL:", guildAPIUrl); // Debug line

    try {
        const response = await axios.get(guildAPIUrl);

        if (response.data.success) {
            const guildData = response.data.guild;
            guildCache.set(guildId, guildData);
            return guildData;
        } else {
            throw new Error("Failed to fetch guild data from Hypixel API.");
        }
    } catch (error) {
        throw new Error("Failed to fetch guild data: " + error.message);
    }
}

async function fetchPlayerAPI(uuid) {
    const hypixelAPIkey = config.minecraft.API.hypixelAPIkey;
    console.log("Fetching data for Player UUID:", uuid); // debug
    const playerAPIUrl = `https://api.hypixel.net/v2/player?key=${hypixelAPIkey}&uuid=${uuid}`;

    try {
        const response = await axios.get(playerAPIUrl);

        if (response.data.success) {
            const playerData = response.data.player;
            playerCache.set(uuid, playerData);
            return playerData;
        } else {
            throw new Error("Failed to fetch player data from Hypixel API.");
        }
    } catch (error) {
        throw new Error("Failed to fetch player data: " + error.message);
    }
}   


async function fetchPlayerRank(username) {
    // Fetch UUID for the command issuer
    const issuerUUID = await getUUID(username);

    if (!issuerUUID) {
        throw new Error(`UUID not found for player ${username}.`);
    }

    // Fetch guild data
    const guildData = await fetchGuildAPI();

    // Get the guild member data for the command issuer
    const issuerMemberData = guildData.members.find(member => member.uuid === issuerUUID);

    if (!issuerMemberData) {
        throw new Error(`Player ${username} not found in the guild data.`);
    }

    // Return the rank of the player
    return issuerMemberData.rank;
}

function isGuildMaster(playerUUID) {
    const guildData = guildCache.get(config.minecraft.guild.guildID);
    if (!guildData) {
        console.error('Guild data not found in cache');
        return false;
    }

    for (const member of guildData.members) {
        if (member.uuid === playerUUID && member.rank === "Guild Master") {
            return true;
        }
    }

    return false;
}

module.exports = { fetchPlayerAPI, fetchGuildAPI, isGuildMaster, fetchPlayerRank };