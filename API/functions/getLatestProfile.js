const { isUuid } = require("../utils/uuid.js");
const config = require("../../config.json");
const { parseHypixel } = require("../utils/hypixel.js");
const axios = require("axios");
const { getUUID } = require("../../src/contracts/API/PlayerDBAPI.js");

async function getLatestProfile(uuid) {
  // eslint-disable-next-line no-useless-catch
  try {
    if (!isUuid(uuid)) {
      uuid = await getUUID(uuid);
    }

    let [playerRes, profileRes] = await Promise.all([
      axios.get(
        `https://api.hypixel.net/player?key=${config.api.hypixelAPIkey}&uuid=${uuid}`
      ),
      axios.get(
        `https://api.hypixel.net/skyblock/profiles?key=${config.api.hypixelAPIkey}&uuid=${uuid}`
      ),
    ]);

    playerRes = playerRes?.data ?? {};
    profileRes = profileRes?.data ?? {};

    if (playerRes.success === false || profileRes.success === false) {
      // eslint-disable-next-line no-throw-literal
      throw "Request to Hypixel API failed. Please try again!";
    }

    if (playerRes.player == null) {
      // eslint-disable-next-line no-throw-literal
      throw "Player not found. It looks like this player has never joined the Hypixel.";
    }

    if (profileRes.profiles == null) {
      // eslint-disable-next-line no-throw-literal
      throw "Player has no SkyBlock profiles.";
    }

    if (profileRes.profiles.length == 0) {
      // eslint-disable-next-line no-throw-literal
      throw "Player has no SkyBlock profiles.";
    }

    const player = parseHypixel(playerRes, uuid);

    const profileData = profileRes.profiles.find((a) => a.selected) || null;
    const profile = profileData.members[uuid];

    if (profile === null) {
      // eslint-disable-next-line no-throw-literal
      throw "Uh oh, this player is not in this Skyblock profile.";
    }

    if (profileData == null) {
      // eslint-disable-next-line no-throw-literal
      throw "Player does not have selected profile.";
    }

    return {
      profiles: profileRes.profiles,
      profile: profile,
      profileData: profileData,
      playerRes: playerRes,
      player: player,
      uuid: uuid,
    };

  } catch (error) {
    
    throw error;
  }
}

module.exports = { getLatestProfile };
