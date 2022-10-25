const axios = require("axios");
const fs = require("fs");
const { toFixed } = require("../constants/functions");
const config = require("../config.json");

module.exports = async function refresAuctions() {
  async function updateAuctions() {
    let request;
    try {
      request = await axios.get("https://api.hypixel.net/skyblock/auctions");
    } catch (err) {
      return console.log("Failed to update auctions: ", err);
    }

    if (request.status === 200) {
      if (config.auctionHouse.refreshMessage)
        console.log("[AUCTIONS] Getting auctions.");
      let auctions = [];
      for (let i = 0; i < request.data.totalPages; i++) {
        const data = (
          await axios.get(`https://api.hypixel.net/skyblock/auctions?page=${i}`)
        ).data.auctions;
        for (const auction of data) {
          auctions.push(auction);
        }

        if (config.debug)
          console.log(
            `[AUCTIONS] Progress ${toFixed(
              (i / request.data.totalPages) * 100,
              2
            )}%`
          );
      }
      fs.writeFileSync(__dirname + "/auctions.json", JSON.stringify(auctions, null, 2));
      if (config.auctionHouse.refreshMessage)
        console.log("[AUCTIONS] Auctions updated successfully");
    } else {
      console.log("[AUCTIONS] Failed to update Auctions: ", request.status);
    }
  }

  updateAuctions();
  setInterval(async () => {
    updateAuctions();
  }, 1000 * 60 * 10); // 10 minutes
};
