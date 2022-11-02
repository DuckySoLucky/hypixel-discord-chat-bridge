//CREDIT: https://github.com/Senither/hypixel-skyblock-facade (Modified)
const { isUuid } = require("../utils/uuid");
const getActiveAuctions = require("../stats/auctions.js");
const config = require('../../config.json');
const axios = require("axios");

async function getAuctions(uuid) {
  if (!isUuid(uuid)) {
    const mojang_response = (await axios.get(`https://api.ashcon.app/mojang/v2/user/${uuid}`));
    if (mojang_response?.data?.uuid) {
      uuid = mojang_response.data.uuid.replace(/-/g, "");
    }
  }

  const auctionsRes = (await axios.get(`https://api.hypixel.net/skyblock/auction?key=${config.api.hypixelAPIkey}&player=${uuid}`)).data;
  const auctions = getActiveAuctions(auctionsRes);

  return { status: 200, data: auctions };
}

module.exports = { getAuctions };

getAuctions('963a58ae133644b08fbd7a0f9333b4f2').then(console.log)