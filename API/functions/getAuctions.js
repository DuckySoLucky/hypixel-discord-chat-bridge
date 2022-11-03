//CREDIT: https://github.com/Senither/hypixel-skyblock-facade (Modified)
const { isUuid } = require("../utils/uuid.JS");
const getActiveAuctions = require("../stats/auctions.js");
const config = require("../../config.json");
const axios = require("axios");

async function getAuctions(uuid) {
  if (!isUuid(uuid)) {
    const mojangResponse = await axios.get(
      `https://api.ashcon.app/mojang/v2/user/${uuid}`
    );
    if (mojangResponse?.data?.uuid) {
      uuid = mojangResponse.data.uuid.replace(/-/g, "");
    }
  }

  const auctionsRes = (
    await axios.get(
      `https://api.hypixel.net/skyblock/auction?key=${config.api.hypixelAPIkey}&player=${uuid}`
    )
  ).data;
  const auctions = getActiveAuctions(auctionsRes);

  return { status: 200, data: auctions };
}

module.exports = { getAuctions };
