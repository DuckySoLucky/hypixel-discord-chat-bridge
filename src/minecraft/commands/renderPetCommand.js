// Rewrite needed¸

const { ImgurClient } = require('imgur')
const config = require('../../../config.json')
const imgurClient = new ImgurClient({ clientId: config.api.imgurAPIkey })
process.on('uncaughtException', function (err) {console.log(err.stack)})
const { getRarityColor } = require('../../contracts/helperFunctions')
const MinecraftCommand = require('../../contracts/MinecraftCommand')
const { getProfile } = require('../../contracts/API/SkyShiiyuAPI')
const { renderLore } = require('../../contracts/renderItem')


class renderCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'pet'
    this.aliases = []
    this.description = "Renders active pet of specified user."
    this.options = ['name']
    this.optionsDescription = ['Minecraft Username']
  }

  async onCommand(username, message) {
    let received = false, arg = this.getArgs(message)
    if (arg[0]) username = arg[0]
    try {
      const profile = await getProfile(username)
      for (let i = 0; i < profile.raw.pets.length; i++) {
        if (profile.raw.pets[i].active) {
          const pet = profile.raw.pets[i]
          const rarity = getRarityColor(pet.tier)
          const name = `§7[Lvl ${pet.level.level}] §${rarity}${pet.display_name}`
          let lore = pet.lore
          lore = lore.replaceAll(`<span style='color: var(--§b);'>MAX LEVEL</span></span>`, '')
          lore = lore.replaceAll('</span></span>', 'NEXT_LINE')
          lore = lore.replaceAll("lore-row wrap", '')
          lore = lore.replaceAll('<span class="">', '')
          lore = lore.replaceAll(`<span style='color: var(--`, '')
          lore = lore.replaceAll(`);'>`, '')
          lore = lore.replaceAll(`</span>`, '')
          lore = lore.replaceAll(`<span>`, '')
          lore = lore.replaceAll(`§6Held Item: `, `NEXT_LINE§6Held Item: `)
          lore = `${lore}NEXT_LINE§${rarity}§l${pet.tier}`
          const loreArray = lore.split('NEXT_LINE')
          const renderedItem = await renderLore(name, loreArray)
          const upload = await imgurClient.upload({image: renderedItem, type: 'stream'})
          if (!upload.data.link) this.send(`/gc There was an error with Imgur, try again.`)
          if (profile.data.profile.game_mode == 'ironman') username = `♲ ${username}`
          this.send(`/gc ${username}'s Pet » ${upload.data.link}`)
          received = true
          break
        }
      }
      if (!received) this.send(`/gc ${username} does not have pet equiped.`)
    }  
    catch (error) {
      this.send('/gc There is no player with the given UUID or name or the player has no Skyblock profiles')
    }
  }
}


module.exports = renderCommand;