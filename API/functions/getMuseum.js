/* eslint-disable no-throw-literal */
const config = require("../../config.json");
// @ts-ignore
const { get } = require("axios");

const cache = new Map();

/**
 *
 * @param {string} profileID
 * @param {string} uuid
 * @returns {Promise<object>}
 */
async function getMuseum(profileID, uuid) {
  if (cache.has(profileID)) {
    const data = cache.get(profileID);

    if (data.last_save + 300000 > Date.now()) {
      return data.data;
    }
  }

  const { data } = await get(`https://api.hypixel.net/v2/skyblock/museum?key=${config.minecraft.API.hypixelAPIkey}&profile=${profileID}`);
  if (data === undefined || data.success === false) {
    throw "Request to Hypixel API failed. Please try again!";
  }

  if (data.members === null || Object.keys(data.members).length === 0) {
    // throw "Profile doesn't have a museum.";
  }

  if (data.members[uuid] === undefined) {
    // throw "Player doesn't have a museum.";
  }

  cache.set(profileID, {
    data: {
      museum: data.members ? data.members[uuid] : null,
      museumData: data.members ? data.members : null
    },
    last_save: Date.now()
  });

  return {
    museum: data.members ? data.members[uuid] : null,
    museumData: data.members ? data.members : null
  };
}

module.exports = { getMuseum };
