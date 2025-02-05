/* eslint-disable no-throw-literal */
const config = require("../../config.json");
const axios = require("axios");

async function getGarden(profileID, uuid) {
  try {
    const { data } = await axios.get(
      `https://api.hypixel.net/v2/skyblock/garden?key=${config.minecraft.API.hypixelAPIkey}&profile=${profileID}`
    );

    if (data === undefined || data.success === false) {
      throw "Request to Hypixel API failed. Please try again!";
    }

    return { garden: data.garden };
  } catch (e) {
    throw new Error(e);
  }
}

module.exports = { getGarden };
