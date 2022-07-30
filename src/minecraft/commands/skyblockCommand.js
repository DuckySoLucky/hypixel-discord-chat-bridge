process.on('uncaughtException', function (err) {console.log(err.stack)})
const MinecraftCommand = require('../../contracts/MinecraftCommand')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const { addNotation, addCommas} = require('../../contracts/helperFunctions')
const { getProfile } = require('../../contracts/API/SkyHelperAPI')

class skyblockCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'skyblock'
    this.aliases = ['stats']
    this.description = "Skyblock Stats of specified user."
    this.options = ['name']
    this.optionsDescription = ['Minecraft Username']
  }

  async onCommand(username, message) {
    try {
      let msg = this.getArgs(message)
      if(msg[0]) username = msg[0]
      const profile = await getProfile(username)
      if (profile.isIronman) username = `♲ ${username}`
      let common = profile.talismans.common.length, uncommon = profile.talismans.uncommon.length, rare = profile.talismans.rare.length, epic = profile.talismans.epic.length, legendary = profile.talismans.legendary.length, mythic = profile.talismans.mythic.length, special = profile.talismans.special.length, verySpecial = profile.talismans.very.length, recombobulated = 0, enrichment = 0
      for (let i = 0; i < Object.keys(profile.talismans).length; i++) {
          for (let j = 0; j < profile.talismans?.[Object.keys(profile.talismans)[i]].length; j++) {
              if (profile.talismans?.[Object.keys(profile.talismans)[i]]?.[j].recombobulated) {recombobulated++}
          }
      }
      let talismanCount = common + uncommon + rare + epic + legendary + mythic + special + verySpecial
      
      this.send(`/gc Skill Average » ${Math.round(((profile.skills.farming.level + profile.skills.mining.level + profile.skills.combat.level + profile.skills.foraging.level + profile.skills.fishing.level + profile.skills.enchanting.level + profile.skills.alchemy.level + profile.skills.taming.level ) / 8 )* 100) / 100} | Slayer » ${addCommas(profile.slayer?.[Object.keys(profile.slayer)[0]].xp + profile.slayer?.[Object.keys(profile.slayer)[1]].xp + profile.slayer?.[Object.keys(profile.slayer)[2]].xp + profile.slayer?.[Object.keys(profile.slayer)[3]].xp + profile.slayer?.[Object.keys(profile.slayer)[4]].xp)} | ${profile.slayer?.[Object.keys(profile.slayer)[0]].level} ${profile.slayer?.[Object.keys(profile.slayer)[1]].level} ${profile.slayer?.[Object.keys(profile.slayer)[2]].level} ${profile.slayer?.[Object.keys(profile.slayer)[3]].level} ${profile.slayer?.[Object.keys(profile.slayer)[4]].level} | Catacombs » ${profile.dungeons.catacombs.skill.level} | Class Average » ${((profile.dungeons.classes.healer.level + profile.dungeons.classes.mage.level + profile.dungeons.classes.berserk.level + profile.dungeons.classes.archer.level + profile.dungeons.classes.tank.level) / 5)} | Networth » ${addNotation("oneLetters", profile.networth.total_networth)} | Accessories » ${talismanCount} | Recombobulated » ${recombobulated} | Enriched » Unknown`)
      await delay(1000)
      this.send(`/gc https://sky.shiiyu.moe/stats/${username}`)
    } catch (error) {
      this.send('/gc There is no player with the given UUID or name or the player has no Skyblock profiles')
    }
  }
}

module.exports = skyblockCommand