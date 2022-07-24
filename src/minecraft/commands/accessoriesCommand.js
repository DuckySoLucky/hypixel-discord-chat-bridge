const MinecraftCommand = require('../../contracts/MinecraftCommand')
const skyShiiyuAPI = require('../../contracts/API/SkyShiiyuAPI')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
process.on('uncaughtException', function (err) {console.log(err.stack)});


class InfoCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'accessories'
    this.aliases = ['talismans', 'talisman']
    this.description = 'Accessories of specified user.'
    this.options = ['name']
    this.optionsDescription = ['Minecraft Username']
  }

  async onCommand(username, message) {
    let arg = this.getArgs(message);
    if(arg[0]) username = arg[0]
    const profile = await skyShiiyuAPI.getProfile(username)
    if (profile.isIronman) username = `♲ ${username}`
    let common = 0, uncommon = 0, rare = 0, epic = 0, legendary = 0, mythic = 0, special = 0, verySpecial = 0, recombobulated = 0, enrichment = 0
    for (let i = 0; i < profile.items.accessories.length; i++) {
      if (profile.items.accessories[i].rarity == "common") {if (profile.items.accessories[i].isUnique) common++; if (profile.items.accessories[i].recombobulated) recombobulated++; if(profile.items.accessories[i].enrichment) enrichment++}
      if (profile.items.accessories[i].rarity == "uncommon") {if (profile.items.accessories[i].isUnique) uncommon++; if (profile.items.accessories[i].recombobulated) recombobulated++; if(profile.items.accessories[i].enrichment) enrichment++}
      if (profile.items.accessories[i].rarity == "rare") {if (profile.items.accessories[i].isUnique) rare++; if (profile.items.accessories[i].recombobulated) recombobulated++; if(profile.items.accessories[i].enrichment) enrichment++}
      if (profile.items.accessories[i].rarity == "epic") {if (profile.items.accessories[i].isUnique) epic++; if (profile.items.accessories[i].recombobulated) recombobulated++; if(profile.items.accessories[i].enrichment) enrichment++}
      if (profile.items.accessories[i].rarity == "legendary") {if (profile.items.accessories[i].isUnique) legendary++; if (profile.items.accessories[i].recombobulated) recombobulated++; if(profile.items.accessories[i].enrichment) enrichment++}
      if (profile.items.accessories[i].rarity == "mythic") {if (profile.items.accessories[i].isUnique) mythic++; if (profile.items.accessories[i].recombobulated) recombobulated++; if(profile.items.accessories[i].enrichment) enrichment++}
      if (profile.items.accessories[i].rarity == "special") {if (profile.items.accessories[i].isUnique) special++; if (profile.items.accessories[i].recombobulated) recombobulated++; if(profile.items.accessories[i].enrichment) enrichment++}
      if (profile.items.accessories[i].rarity == "very_special") {if (profile.items.accessories[i].isUnique) verySpecial++; if (profile.items.accessories[i].recombobulated) recombobulated++; if(profile.items.accessories[i].enrichment) enrichment++}
    }
    let talismanCount = common + uncommon + rare + epic + legendary + mythic + special + verySpecial
    this.send(`/gc ${username}'s Accessories » ${talismanCount} | Recombobulated » ${recombobulated}| Eniched » ${enrichment}`)
    await delay(1000)
    this.send(`/gc ${arg[0]}'s Accessories » Common - ${common} | Uncommon - ${uncommon} | Rare - ${rare} | Epic - ${epic} |  Legendary - ${legendary} | Special - ${special} | Very Special - ${verySpecial}`)
  }
}

module.exports = InfoCommand
