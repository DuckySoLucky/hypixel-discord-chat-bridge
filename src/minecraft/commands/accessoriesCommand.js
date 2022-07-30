process.on('uncaughtException', function (err) {console.log(err.stack)})
const MinecraftCommand = require('../../contracts/MinecraftCommand')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const { getProfile } = require('../../contracts/API/SkyHelperAPI')

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

    let arg = this.getArgs(message)
    if(arg[0]) username = arg[0]
    const profile = await getProfile(username)
    if (profile.isIronman) username = `♲ ${username}`
    let common = profile.talismans.common.length, uncommon = profile.talismans.uncommon.length, rare = profile.talismans.rare.length, epic = profile.talismans.epic.length, legendary = profile.talismans.legendary.length, mythic = profile.talismans.mythic.length, special = profile.talismans.special.length, verySpecial = profile.talismans.very.length, recombobulated = 0, enrichment = 0
    for (let i = 0; i < Object.keys(profile.talismans).length; i++) {
        for (let j = 0; j < profile.talismans?.[Object.keys(profile.talismans)[i]].length; j++) {
            if (profile.talismans?.[Object.keys(profile.talismans)[i]]?.[j].recombobulated) {recombobulated++}
        }
    }
    let talismanCount = common + uncommon + rare + epic + legendary + mythic + special + verySpecial
    this.send(`/gc ${username}'s Accessories » ${talismanCount} | Recombobulated » ${recombobulated} | Enriched » Unknown`)
    await delay(1000)
    this.send(`/gc ${username}'s Accessories » Common - ${common} | Uncommon - ${uncommon} | Rare - ${rare} | Epic - ${epic} |  Legendary - ${legendary} | Special - ${special} | Very Special - ${verySpecial}`)
  }
}

module.exports = accessoriesCommand
