const { ImgurClient } = require('imgur')
const { getLatestProfile } = require('../../../API/functions/getLatestProfile')
const config = require('../../../config.json')
const imgurClient = new ImgurClient({ clientId: config.api.imgurAPIkey })
const { decodeData } = require('../../contracts/helperFunctions')
const MinecraftCommand = require('../../contracts/MinecraftCommand')
const { renderLore } = require('../../contracts/renderItem')

class renderCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'inventory'
    this.aliases = ['inv', 'i', 'render', 'i']
    this.description = "Renders item of specified user."
    this.options = ['name', 'slot']
    this.optionsDescription = ['Minecraft Username', 'Number between 1 and 36']
  }

  async onCommand(username, message) {
    try {
      let itemNumber, arg = this.getArgs(message)
      if (!arg[0]) this.send('/gc Wrong Usage: !render [name] [slot] | !render [slot]')
      if (!isNaN(Number(arg[0]))) {
        itemNumber = arg[0];
      } else {
        username = arg[0]
        if (!isNaN(Number(arg[1]))) {
          itemNumber = arg[1]
        } else {
          this.send('/gc Wrong Usage: !render [name] [slot] | !render [slot]')
          return
        }
      }
      
      const profile = await getLatestProfile(username);
      if (!profile.profile.inv_contents?.data) return this.send(`/gc This player has an Inventory API off.`)
      if (profile.profileData.game_mode) username = `♲ ${username}`
      
      const inventoryData = (await decodeData(Buffer.from(profile.profile.inv_contents.data, 'base64'))).i

      if (!inventoryData[itemNumber - 1] || !Object.keys(inventoryData[itemNumber - 1] || {}).length) {this.send(`/gc Player does not have an item at slot ${itemNumber}.`)}

      const renderedItem = await renderLore(inventoryData[itemNumber - 1]?.tag?.display?.Name, inventoryData[itemNumber - 1]?.tag?.display?.Lore)
      const upload = await imgurClient.upload({image: renderedItem, type: 'stream'})
      
      this.send(`/gc ${username}'s item at slot ${itemNumber} » ${upload.data.link ?? 'Something went Wrong..'}`)

    } catch (error) {
      console.log(error)
      this.send('/gc There is no player with the given UUID or name or the player has no Skyblock profiles')
    }
  }
}

module.exports = renderCommand;
