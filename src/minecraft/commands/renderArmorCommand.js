const { ImgurClient } = require('imgur')
const { getLatestProfile } = require('../../../API/functions/getLatestProfile')
const config = require('../../../config.json')
const imgurClient = new ImgurClient({ clientId: config.api.imgurAPIkey })
const { decodeData } = require('../../contracts/helperFunctions')
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
      if (this.getArgs(message)[0]) username = this.getArgs(message)[0]

      const profile = await getLatestProfile(username);

      if (!profile.profile.inv_armor?.data) return this.send(`/gc This player has an Inventory API off.`)
      if (profile.profileData.game_mode) username = `♲ ${username}`

      const inventoryData = (await decodeData(Buffer.from(profile.profile.inv_armor.data, 'base64'))).i

      let response = ''
      for (const piece of Object.values(inventoryData)) {
        if (!piece?.tag?.display?.Name) continue;

        const renderedItem = await renderLore(piece?.tag?.display?.Name, piece?.tag?.display?.Lore)
        const upload = await imgurClient.upload({ image: renderedItem, type: 'stream' })
        response += response.split(' | ').length == 4 ? upload.data.link : `${upload.data.link} | `;
      }


      response == '' ? this.send(`/gc ${username} has no armor equiped.`) : this.send(`/gc ${username}'s armor » ${response}`)
    } catch (error) {
      console.log(error)
      this.send('/gc There is no player with the given UUID or name or the player has no Skyblock profiles')
    }
  }
}

module.exports = armorCommand;