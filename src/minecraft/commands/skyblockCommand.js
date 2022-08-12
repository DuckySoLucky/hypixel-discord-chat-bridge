const MinecraftCommand = require('../../contracts/MinecraftCommand')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const { addNotation, addCommas} = require('../../contracts/helperFunctions')
const { getLatestProfile } = require('../../../API/functions/getLatestProfile');
const getSkills = require('../../../API/stats/skills');
const getSlayer = require('../../../API/stats/slayer');
const getNetworth = require('../../../API/stats/networth');
const getWeight = require('../../../API/stats/weight');
const getDungeons = require('../../../API/stats/dungeons');
const getTalismans = require('../../../API/stats/talismans');

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
      let arg = this.getArgs(message)
      if (arg[0]) username = arg[0]
      const data = await getLatestProfile(username)
      username = data.profileData?.game_mode ? `♲ ${username}` : username
      const profile = {
        skills: getSkills(data.player, data.profile),
        slayer: getSlayer(data.profile),
        networth: await getNetworth(data.profile, data.profileData),
        weight: await getWeight(data.profile, data.uuid),
        dungeons: getDungeons(data.player, data.profile),
        talismans: await getTalismans(data.profile),
      }
      let common = profile.talismans?.common?.length, uncommon = profile.talismans?.uncommon?.length, rare = profile.talismans?.rare?.length, epic = profile.talismans?.epic?.length, legendary = profile.talismans?.legendary?.length, mythic = profile.talismans?.mythic?.length, special = profile.talismans?.special?.length, verySpecial = profile.talismans?.very?.length, recombobulated = 0, enrichment = 0
      const talismanCount = common + uncommon + rare + epic + legendary + mythic + special + verySpecial
      for (const rarity of Object.keys(profile.talismans)) {
        for (const talisman of profile.talismans[rarity]) {
          if (talisman.recombobulated) recombobulated ++
          if (talisman.enrichment) enrichment ++
        }
      }
      this.send(`/gc Skill Average » ${Math.round(((profile.skills.farming.level + profile.skills.mining.level + profile.skills.combat.level + profile.skills.foraging.level + profile.skills.fishing.level + profile.skills.enchanting.level + profile.skills.alchemy.level + profile.skills.taming.level ) / 8 )* 100) / 100} | Slayer » ${addCommas(profile.slayer?.[Object.keys(profile.slayer)[0]].xp + profile.slayer?.[Object.keys(profile.slayer)[1]].xp + profile.slayer?.[Object.keys(profile.slayer)[2]].xp + profile.slayer?.[Object.keys(profile.slayer)[3]].xp + profile.slayer?.[Object.keys(profile.slayer)[4]].xp)} | ${profile.slayer?.[Object.keys(profile.slayer)[0]].level} ${profile.slayer?.[Object.keys(profile.slayer)[1]].level} ${profile.slayer?.[Object.keys(profile.slayer)[2]].level} ${profile.slayer?.[Object.keys(profile.slayer)[3]].level} ${profile.slayer?.[Object.keys(profile.slayer)[4]].level} | Catacombs » ${profile.dungeons.catacombs.skill.level} | Class Average » ${((profile.dungeons.classes.healer.level + profile.dungeons.classes.mage.level + profile.dungeons.classes.berserk.level + profile.dungeons.classes.archer.level + profile.dungeons.classes.tank.level) / 5)} | Networth » ${addNotation("oneLetters", profile.networth.total_networth)} | Accessories » ${talismanCount} | Recombobulated » ${recombobulated} | Enriched » ${enrichment}`)
      await delay(690)
      this.send(`/gc https://sky.shiiyu.moe/stats/${username}`)
    } catch (error) {
      this.send('/gc There is no player with the given UUID or name or the player has no Skyblock profiles')
    }
  }
}

module.exports = skyblockCommand