/* eslint-disable no-throw-literal */
const config = require("../../config.json");
// @ts-ignore
const { get } = require("axios");

const cache = new Map();

/**
 * Returns the garden of a profile
 * @param {string} profileID
 * @returns {Promise<{ garden: import("../../types/garden").Garden}>}
 */
async function getGarden(profileID) {
  if (cache.has(profileID)) {
    const data = cache.get(profileID);

    if (data.last_save + 300000 > Date.now()) {
      return data.data;
    }
  }

  const { data } = await get(`https://api.hypixel.net/v2/skyblock/garden?key=${config.minecraft.API.hypixelAPIkey}&profile=${profileID}`);

  if (data === undefined || data.success === false) {
    throw "Request to Hypixel API failed. Please try again!";
  }

  const gardenData = data.garden;
  if (gardenData === null || Object.keys(gardenData).length === 0) {
    // throw "Profile doesn't have a garden.";
  }

  cache.set(profileID, {
    data: gardenData,
    last_save: Date.now()
  });

  return { garden: gardenData };
}

module.exports = { getGarden };
