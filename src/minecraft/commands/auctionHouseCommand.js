const config = require("../../../config.json");
// eslint-disable-next-line
const { ImgurClient } = require("imgur");
const imgurClient = new ImgurClient({ clientId: config.api.imgurAPIkey });
const { addCommas, timeSince } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { decodeData } = require("../../contracts/helperFunctions.js");
const { renderLore } = require("../../contracts/renderItem.js");
const getRank = require("../../../API/stats/rank.js");
const axios = require("axios");

class AuctionHouseCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "auction";
    this.aliases = ["ah", "auctions"];
    this.description = "Listed Auctions of specified user.";
    this.options = ["name"];
    this.optionsDescription = ["Minecraft Username"];
  }

  async onCommand(username, message) {
    try {
      const arg = this.getArgs(message);
      let string = "";
      let bidder;
      if (arg[0]) username = arg[0];

      // Could have been done better and faster using Promise.all(), I'm lazy
      const uuid = (await axios.get(`${config.api.playerDBAPI}/${username}`))
        .data.data.player.raw_id;
      const response = (
        await axios.get(
          `${config.api.hypixelAPI}/skyblock/auction?key=${config.api.hypixelAPIkey}&player=${uuid}`
        )
      ).data;
      const data = (
        await axios.get(
          `${config.api.hypixelAPI}/player?key=${config.api.hypixelAPIkey}&uuid=${uuid}`
        )
      ).data.player;

      for (let i = 0; i < response.auctions.length; i++) {
        if (response.auctions[i].end >= Date.now()) {
          const auctionInfromation = (
            await decodeData(
              Buffer.from(response.auctions[i].item_bytes.data, "base64")
            )
          ).i;
          if (!response.auctions[i].bin) {
            bidder = (
              await axios.get(
                `${config.api.hypixelAPI}/player?key=${
                  config.api.hypixelAPIkey
                }&uuid=${
                  response.auctions[i].bids[
                    response.auctions[i].bids.length - 1
                  ].bidder
                }`
              )
            ).data.player;
          }
          const lore = response.auctions[i].item_lore.split("\n");
          lore.push(
            "§8§m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯",
            `§7Seller: ${getRank(data)} ${data.displayname}`
          );
          if (response.auctions[i].bin) {
            lore.push(
              `§7Buy it now: §6${addCommas(
                response.auctions[i].starting_bid
              )} coins`
            );
          }
          if (!response.auctions[i].bin) {
            lore.push(
              `§7Bids: §a${response.auctions[i].bids.length} bids`,
              ` `,
              `§7Top Bid: §6${addCommas(
                response.auctions[i].highest_bid_amount
              )} coins`,
              `§7Bidder: ${getRank(bidder)}${bidder.displayname}`
            );
          }

          lore.push(" ", `§7Ends in: §e${timeSince(response.auctions[i].end)}`);
          const renderedItem = await renderLore(
            auctionInfromation[0].tag.display.Name,
            lore
          );
          const upload = await imgurClient.upload({
            image: renderedItem,
            type: "stream",
          });
          if (!upload.data.link) {
            this.send(`/gc There was an error with Imgur, try again.`);
          }
          string += string == "" ? upload.data.link : " | " + upload.data.link;
        }
        if (i == response.auctions.length - 1 && string != "") {
          this.send(`/gc ${username}'s Active Auctions » ${string}`);
          break;
        }
      }
      if (string == "") {
        this.send("/gc This player does not have any auctions active.");
      }
    } catch (error) {
      console.log(error);
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}

module.exports = AuctionHouseCommand;
