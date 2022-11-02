const { ImgurClient } = require('imgur')
const config = require('../../../config.json')
const imgurClient = new ImgurClient({ clientId: config.api.imgurAPIkey })
const { getRarityColor } = require('../../contracts/helperFunctions')
const MinecraftCommand = require('../../contracts/MinecraftCommand')
const { renderLore } = require('../../contracts/renderItem')
const { getLatestProfile } = require('../../../API/functions/getLatestProfile');
const getPets = require('../../../API/stats/pets')

class renderCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'pet'
    this.aliases = ['pets']
    this.description = "Renders active pet of specified user."
    this.options = ['name']
    this.optionsDescription = ['Minecraft Username']
  }

  async onCommand(username, message) {
    try {
      let arg = this.getArgs(message)
      if (arg[0]) username = arg[0]
      const data = await getLatestProfile(username)
      username = data.profileData?.game_mode ? `♲ ${username}` : username
      const profile = getPets(data.profile) 
      for (const pet of profile.pets) {
        if (pet.active) {
          const lore = pet.lore
          let newLore = [], newLine = []

          // Lore splitting
          for (const line of lore) {
            if (!line.includes('Total XP')) {
              newLine = line.split('. ')
              if (newLine.length > 0) {
                for (const l of newLine) {
                  newLore.push(l)
                }
              } else {
                newLore.push(newLine)
              }
            } else {
              newLore.push(line)
            }
          }

          const renderedItem = await renderLore(`§7[Lvl ${pet.level}] §${getRarityColor(pet.tier)}${pet.display_name}`, newLore)
          const upload = await imgurClient.upload({image: renderedItem, type: 'stream'})
          return this.send(`/gc ${username}'s Active Pet » ${upload.data.link ?? 'Something went Wrong..'}`)
        }
      }
      this.send(`/gc ${username} does not have pet equiped.`)
    }  
    catch (error) {
      console.log(error)
      this.send('/gc There is no player with the given UUID or name or the player has no Skyblock profiles')
    }
  }
}


module.exports = renderCommand;