const { addCommas, timeSince } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { uploadImage } = require("../../contracts/API/imgurAPI.js");
const { getUUID } = require("../../contracts/API/mowojangAPI.js");
const { renderLore } = require("../../contracts/renderItem.js");
const getRank = require("../../../API/stats/rank.js");
const config = require("../../../config.json");
const axios = require("axios");

class AuctionHouseCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "auction";
    this.aliases = ["ah", "auctions"];
    this.description = "Listed Auctions of specified user.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false
      }
    ];
  }

  async onCommand(player, message) {
    try {
      const args = this.getArgs(message);
      player = args[0] ?? player;

      const uuid = await getUUID(player);

      const { hypixelAPIkey } = config.minecraft.API;
      const [auctionResponse, playerResponse] = await Promise.all([
        axios.get(`https://api.hypixel.net/v2/skyblock/auction?key=${hypixelAPIkey}&player=${uuid}`),
        axios.get(`https://api.hypixel.net/v2/player?key=${hypixelAPIkey}&uuid=${uuid}`)
      ]);

      const auctions = auctionResponse.data?.auctions || [];
      const playerData = playerResponse.data?.player || {};

      if (auctions.length === 0) {
        return this.send("This player has no active auctions.");
      }

      const activeAuctions = auctions.filter((auction) => auction.end >= Date.now());

      let string = "";
      for (const auction of activeAuctions) {
        const lore = auction.item_lore.split("\n");

        lore.push("§8§m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯", `§7Seller: ${getRank(playerData)} ${player.displayname}`);

        if (auction.bin === undefined) {
          if (auction.bids.length === 0) {
            lore.push(`§7Starting Bid: §6${addCommas(auction.starting_bid)} coins`, `§7`);
          } else if (auction.bids.length > 0) {
            const bidderUUID = auction.bids[auction.bids.length - 1].bidder;

            const bidderResponse = await axios.get(
              `https://api.hypixel.net/player?key=${hypixelAPIkey}&uuid=${bidderUUID}`
            );

            const bidder = bidderResponse.data?.player || {};
            if (bidder === undefined) {
              throw `Failed to get bidder for auction ${auction.uuid}`;
            }

            const { amount } = auction.bids[auction.bids.length - 1];
            const bidOrBids = auction.bids.length === 1 ? "bids" : "bid";

            lore.push(
              `§7Bids: §a${auction.bids.length} ${bidOrBids}`,
              `§7`,
              `§7Top Bid: §6${amount.toLocaleString()} coins`,
              `§7Bidder: ${getRank(bidder)} ${bidder.displayname}`,
              `§7`
            );
          }
        } else {
          lore.push(`§7Buy it now: §6${auction.starting_bid.toLocaleString()} coins`, `§7`);
        }

        lore.push(`§7Ends in: §e${timeSince(auction.end)}`, `§7`, `§eClick to inspect`);

        const renderedItem = await renderLore(` ${auction.item_name}`, lore);
        const upload = await uploadImage(renderedItem);

        string += string === "" ? upload.data.link : " | " + upload.data.link;
      }

      imgurUrl = string;
      this.send(`${player}'s Active Auctions: Check Discord Bridge for image.`);
    } catch (error) {
      console.error(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = AuctionHouseCommand;
