const config = require('../../../config.json')
const { ImgurClient } = require('imgur');
const imgurClient = new ImgurClient({ clientId: config.api.imgurAPIkey })
const { addCommas, timeSince } = require('../../contracts/helperFunctions')
const MinecraftCommand = require('../../contracts/MinecraftCommand')
process.on('uncaughtException', function (err) {console.log(err.stack)})
const { decodeData } = require('../../contracts/getSkyblockProfile');
const { renderLore } = require('../../contracts/renderItem')
const getRank = require('../../contracts/rank')
const axios = require('axios')

class auctionHouseCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'auction'
    this.aliases = ['ah', 'auctions']
    this.description = "Listed Auctions of specified user."
    this.options = ['name']
    this.optionsDescription = ['Minecraft Username']
  }

  async onCommand(username, message) {
    let arg = this.getArgs(message), string = ''
    if (arg[0]) username = arg[0]
    const uuid = (await axios.get(`${config.api.playerDBAPI}/${username}`)).data.data.player.raw_id
    const response = await axios.get(`${config.api.hypixelAPI}/skyblock/auction?key=${config.api.hypixelAPIkey}&player=${uuid}`)
    const data = (await axios.get(`${config.api.hypixelAPI}/player?key=${config.api.hypixelAPIkey}&uuid=${uuid}`)).data.player
    for (let i = 0; i < response.data.auctions.length; i++) {
      if (response.data.auctions[i].end >= Date.now()) {
        const auctionInfromation = (await decodeData(Buffer.from(response.data.auctions[i].item_bytes.data, 'base64'))).i
        if (!response.data.auctions[i].bin) bidder = (await axios.get(`${config.api.hypixelAPI}/player?key=${config.api.hypixelAPIkey}&uuid=${response.data.auctions[i].bids[response.data.auctions[i].bids.length-1].bidder}`)).data.player
        let lore = response.data.auctions[i].item_lore.split('\n')
        lore.push('§8§m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯', `§7Seller: ${getRank(data)}${data.displayname}`)
        if (response.data.auctions[i].bin) lore.push(`§7Buy it now: §6${addCommas(response.data.auctions[i].starting_bid)} coins`)
        if (!response.data.auctions[i].bin) lore.push(`§7Bids: §a${(response.data.auctions[i].bids).length} bids`, ` `, `§7Top Bid: §6${addCommas(response.data.auctions[i].highest_bid_amount)} coins`, `§7Bidder: ${getRank(bidder)}${bidder.displayname}`)
        lore.push(' ', `§7Ends in: §e${timeSince(response.data.auctions[i].end)}`)
        const renderedItem = await renderLore(auctionInfromation[0].tag.display.Name, lore)
        const upload = await imgurClient.upload({image: renderedItem, type: 'stream'})
        if (!upload.data.link) this.send(`/gc There was an error with Imgur, try again.`)
        string += upload.data.link + ' | '
        if (i+1 == response.data.auctions.length) this.send(`/gc ${username}'s Active Auctions » ${string}`);
      }
    }
    this.send('/gc This player does not have any auctions active.')
  }
}

module.exports = auctionHouseCommand;
