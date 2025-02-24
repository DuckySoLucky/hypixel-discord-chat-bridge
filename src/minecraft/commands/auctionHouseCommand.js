const { timeSince, formatNumber } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { uploadImage } = require("../../contracts/API/imgurAPI.js");
const { getUUID } = require("../../contracts/API/mowojangAPI.js");
const { renderLore } = require("../../contracts/renderItem.js");
const { getRank } = require("../../../API/stats/rank.js");
const config = require("../../../config.json");
// @ts-ignore
const { get } = require("axios");

class AuctionHouseCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
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

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    try {
      const args = this.getArgs(message);
      player = args[0] ?? player;

      const uuid = await getUUID(player);

      const [auctionResponse, playerResponse] = await Promise.all([
        get(`https://api.hypixel.net/v2/skyblock/auction?key=${config.minecraft.API.hypixelAPIkey}&player=${uuid}`),
        get(`https://api.hypixel.net/v2/player?key=${config.minecraft.API.hypixelAPIkey}&uuid=${uuid}`)
      ]);

      /** @type {import("../../../types/player.js").Player} */
      const playerData = playerResponse.data?.player || {};
      if (playerData === undefined) {
        return this.send(`Couldn't find player ${player}.`);
      }

      /** @type {import("../../../types/auctions.js").Auction[] | []} */
      const auctions = auctionResponse.data?.auctions || [];
      if (auctions.length === 0) {
        return this.send("This player has no active auctions.");
      }

      const activeAuctions = auctions.filter((auction) => auction.end >= Date.now() && auction.claimed === false);
      if (activeAuctions.length === 0) {
        return this.send("This player has no active auctions.");
      }

      for (const auction of activeAuctions) {
        const lore = auction.item_lore.split("\n");
        lore.push("§8§m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯", `§7Seller: ${getRank(playerData)} ${playerData.displayname}`);
        if (auction.bin === undefined) {
          if (auction.bids.length === 0) {
            lore.push(`§7Starting Bid: §6${formatNumber(auction.starting_bid)} coins`, `§7`);
          } else if (auction.bids.length > 0) {
            const bidderUUID = auction.bids[auction.bids.length - 1].bidder;

            const bidderResponse = await get(`https://api.hypixel.net/player?key=${config.minecraft.API.hypixelAPIkey}&uuid=${bidderUUID}`);

            /** @type {import("../../../types/player.js").Player} */
            const bidder = bidderResponse.data?.player || {};
            if (bidder === undefined) {
              continue;
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
        if (renderedItem === null) {
          this.send(`[ERROR] Couldn't render item ${auction.item_name}.`);
          return;
        }

        await uploadImage(renderedItem);
      }

      this.send(`${player}'s Active Auctions: Check Discord Bridge for image. (Hypixel banned Imgur links from the chat)`);
    } catch (error) {
      console.log(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = AuctionHouseCommand;
