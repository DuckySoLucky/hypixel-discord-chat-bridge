const axios = require("axios");
const config = require("../../../config.json");

async function getUUID(username) {
  try {
    const response = await axios.get(`${config.api.playerDBAPI}/${username}`);
    return response.data.data.player.raw_id;
  } catch (error) {
    console.log(error);
  }
}

async function getUsername(uuid) {
  try {
    const response = await axios.get(`${config.api.playerDBAPI}/${uuid}`);
    return response.data.data.player.username;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getUUID, getUsername };
