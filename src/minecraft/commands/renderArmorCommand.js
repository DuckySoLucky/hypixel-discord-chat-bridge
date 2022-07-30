const { ImgurClient } = require('imgur')
const config = require('../../../config.json')
const imgurClient = new ImgurClient({ clientId: config.api.imgurAPIkey })
process.on('uncaughtException', function (err) {console.log(err.stack)})
const { getPlayer, decodeData } = require('../../contracts/getSkyblockProfile')
const MinecraftCommand = require('../../contracts/MinecraftCommand')
const { renderLore } = require('../../contracts/renderItem')

class armorCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'armor'
    this.aliases = []
    this.description = "Renders armor of specified user."
    this.options = ['name']
    this.optionsDescription = ['Minecraft Username']
  }

  async onCommand(username, message) {
    try {
      let arg = this.getArgs(message)
      if (arg[0]) username = arg[0]
      const searchedPlayer = await getPlayer(username).catch((err) => {this.send(`/gc Error: ${err}`)})
      const playerProfile = searchedPlayer.memberData
      const inventory = playerProfile?.inv_armor?.data
      if (!inventory) {this.send(`/gc This player has an Inventory API off.`)}
      const inventoryData = (await decodeData(Buffer.from(inventory, 'base64'))).i
      let response = ''
      for (let i = 1; i < 5; i++) {
        const selectedItem = inventoryData[i - 1]
        if (!selectedItem?.tag?.display?.Name) continue;
        const renderedItem = await renderLore(selectedItem?.tag?.display?.Name, selectedItem?.tag?.display?.Lore)
        const upload = await imgurClient.upload({image: renderedItem, type: 'stream'})
        if (!upload.data.link) this.send(`/gc There was an error with Imgur, try again.`)
        response+=`${upload.data.link} | `
      }
      if (searchedPlayer.profileData.game_mode == "ironman") username = `♲ ${username}`
      this.send(`/gc ${username}'s Armor » ${response}`)
    } catch (error) {
      this.send('/gc There is no player with the given UUID or name or the player has no Skyblock profiles')
    }
  }
}

module.exports = armorCommand;