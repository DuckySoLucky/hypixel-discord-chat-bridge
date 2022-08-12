const MinecraftCommand = require('../../contracts/MinecraftCommand')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const getTalismans = require('../../../API/stats/talismans');
const { getLatestProfile } = require('../../../API/functions/getLatestProfile');

class accessoriesCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'accessories'
    this.aliases = ['talismans', 'talisman']
    this.description = 'Accessories of specified user.'
    this.options = ['name']
    this.optionsDescription = ['Minecraft Username']
  }


  async onCommand(username, message) {
    try {
      let arg = this.getArgs(message)
      if(arg[0]) username = arg[0]
      const data = await getLatestProfile(username)
      username = data.profileData?.game_mode ? `♲ ${username}` : username
      const talismans = await getTalismans(data.profile)
      let common = talismans?.common?.length, uncommon = talismans?.uncommon?.length, rare = talismans?.rare?.length, epic = talismans?.epic?.length, legendary = talismans?.legendary?.length, mythic = talismans?.mythic?.length, special = talismans?.special?.length, verySpecial = talismans?.very?.length, recombobulated = 0, enrichment = 0
      const talismanCount = common + uncommon + rare + epic + legendary + mythic + special + verySpecial
      for (const rarity of Object.keys(talismans)) {
        for (const talisman of talismans[rarity]) {
          if (talisman.recombobulated) recombobulated ++
          if (talisman.enrichment) enrichment ++
        }
      }
      
      this.send(`/gc ${username}'s Accessories » ${talismanCount} | Recombobulated » ${recombobulated} | Enriched » ${enrichment}`)
      await delay(690)
      this.send(`/gc ${username}'s Accessories » Common - ${common} | Uncommon - ${uncommon} | Rare - ${rare} | Epic - ${epic} |  Legendary - ${legendary} | Special - ${special} | Very Special - ${verySpecial}`)
    
    } catch (error) {
      this.send(`/gc [ERROR] ${error}`)
    }
  }
}

module.exports = accessoriesCommand
