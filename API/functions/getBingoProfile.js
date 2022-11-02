//CREDIT: https://github.com/Senither/hypixel-skyblock-facade (Modified)
const { isUuid } = require("../utils/uuid");
const { parseBingoProfile } = require("../utils/hypixel");
const config = require('../../config.json');
const axios = require("axios");

async function getBingo(uuid) {
  if (!isUuid(uuid)) {
    const mojang_response = (await axios.get(`https://api.ashcon.app/mojang/v2/user/${uuid}`));
    if (mojang_response?.data?.uuid) {
      uuid = mojang_response.data.uuid.replace(/-/g, "");
    }
  }

  const [profileRes, bingoRes] = await Promise.all([
    await axios.get(`https://api.hypixel.net/skyblock/bingo?key=${config.api.hypixelAPIkey}&uuid=${uuid}`),
    await axios.get(`https://api.hypixel.net/resources/skyblock/bingo`)
  ]);

  if (bingoRes.data.id !== profileRes.data.events[profileRes.data.events.length - 1].key) return { status: 404, data: `Found no Bingo profiles for a user with a UUID of '${uuid}'` };

  const profile = parseBingoProfile(profileRes, bingoRes, uuid);

  return { status: 200, data: profile };
}

module.exports = { getBingo };

getBingo('thirtyvirus').then(console.log)
