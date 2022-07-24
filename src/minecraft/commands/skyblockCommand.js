const MinecraftCommand = require('../../contracts/MinecraftCommand')
const helperFunctions = require('../../contracts/helperFunctions')
const skyHelperAPI = require('../../contracts/API/SkyHelperAPI')
const skyShiiyuAPI = require('../../contracts/API/SkyShiiyuAPI')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
process.on('uncaughtException', function (err) {console.log(err.stack)});

class eightballCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'skyblock'
    this.aliases = ['stats']
    this.description = "Skyblock Stats of specified user."
    this.options = ['name']
    this.optionsDescription = ['Minecraft Username']
  }

  async onCommand(username, message) {
    let msg = this.getArgs(message)
    if(msg[0]) username = msg[0]
    const profile = await skyHelperAPI.getProfile(username)
    const skyShiiyuProfile = await skyShiiyuAPI.getProfile(username)
    if (profile.isIronman) username = `♲ ${username}`
    let common = 0, uncommon = 0, rare = 0, epic = 0, legendary = 0, mythic = 0, special = 0, verySpecial = 0, recombobulated = 0, enrichment = 0
    for (let i = 0; i < skyShiiyuProfile.items.accessories.length; i++) {
        if (skyShiiyuProfile.items.accessories[i].rarity == "common") {if (skyShiiyuProfile.items.accessories[i].isUnique) common++; if (skyShiiyuProfile.items.accessories[i].recombobulated) recombobulated++; if(skyShiiyuProfile.items.accessories[i].enrichment) enrichment++}
        if (skyShiiyuProfile.items.accessories[i].rarity == "uncommon") {if (skyShiiyuProfile.items.accessories[i].isUnique) uncommon++; if (skyShiiyuProfile.items.accessories[i].recombobulated) recombobulated++; if(skyShiiyuProfile.items.accessories[i].enrichment) enrichment++}
        if (skyShiiyuProfile.items.accessories[i].rarity == "rare") {if (skyShiiyuProfile.items.accessories[i].isUnique) rare++; if (skyShiiyuProfile.items.accessories[i].recombobulated) recombobulated++; if(skyShiiyuProfile.items.accessories[i].enrichment) enrichment++}
        if (skyShiiyuProfile.items.accessories[i].rarity == "epic") {if (skyShiiyuProfile.items.accessories[i].isUnique) epic++; if (skyShiiyuProfile.items.accessories[i].recombobulated) recombobulated++; if(skyShiiyuProfile.items.accessories[i].enrichment) enrichment++}
        if (skyShiiyuProfile.items.accessories[i].rarity == "legendary") {if (skyShiiyuProfile.items.accessories[i].isUnique) legendary++; if (skyShiiyuProfile.items.accessories[i].recombobulated) recombobulated++; if(skyShiiyuProfile.items.accessories[i].enrichment) enrichment++}
        if (skyShiiyuProfile.items.accessories[i].rarity == "mythic") {if (skyShiiyuProfile.items.accessories[i].isUnique) mythic++; if (skyShiiyuProfile.items.accessories[i].recombobulated) recombobulated++; if(skyShiiyuProfile.items.accessories[i].enrichment) enrichment++}
        if (skyShiiyuProfile.items.accessories[i].rarity == "special") {if (skyShiiyuProfile.items.accessories[i].isUnique) special++; if (skyShiiyuProfile.items.accessories[i].recombobulated) recombobulated++; if(skyShiiyuProfile.items.accessories[i].enrichment) enrichment++}
        if (skyShiiyuProfile.items.accessories[i].rarity == "very_special") {if (skyShiiyuProfile.items.accessories[i].isUnique) verySpecial++; if (skyShiiyuProfile.items.accessories[i].recombobulated) recombobulated++; if(skyShiiyuProfile.items.accessories[i].enrichment) enrichment++}
        }
    let talismanCount = common + uncommon + rare + epic + legendary + mythic + special + verySpecial        
    this.send(`/gc Skill Average » ${Math.round(((profile.skills.farming.level + profile.skills.mining.level + profile.skills.combat.level + profile.skills.foraging.level + profile.skills.fishing.level + profile.skills.enchanting.level + profile.skills.alchemy.level + profile.skills.taming.level ) / 8 )* 100) / 100} | Slayer » ${skyShiiyuProfile.data.slayers.zombie.xp + skyShiiyuProfile.data.slayers.spider.xp + skyShiiyuProfile.data.slayers.wolf.xp + skyShiiyuProfile.data.slayers.enderman.xp + skyShiiyuProfile.data.slayers.blaze.xp} | ${skyShiiyuProfile.data.slayers.zombie.level.currentLevel} ${skyShiiyuProfile.data.slayers.spider.level.currentLevel} ${skyShiiyuProfile.data.slayers.wolf.level.currentLevel} ${skyShiiyuProfile.data.slayers.enderman.level.currentLevel} ${skyShiiyuProfile.data.slayers.blaze.level.currentLevel}  | Catacombs » ${profile.dungeons.catacombs.skill.level} | Class Average » ${((profile.dungeons.classes.healer.level + profile.dungeons.classes.mage.level + profile.dungeons.classes.berserk.level + profile.dungeons.classes.archer.level + profile.dungeons.classes.tank.level) / 5)} | Networth » ${helperFunctions.addNotation("oneLetters", profile.networth.total_networth)} | Accessories » ${talismanCount} | Recombobulated » ${recombobulated} | Enriched » ${enrichment}`)
    await delay(1000)
    this.send(`/gc https://sky.shiiyu.moe/stats/${username}`)
    
  }
}

module.exports = eightballCommand