const { getLatestProfile } = require('../../../API/functions/getLatestProfile');
const { addNotation, addCommas} = require('../../contracts/helperFunctions')
const MinecraftCommand = require('../../contracts/MinecraftCommand')
const { getNetworth, getPrices } = require('skyhelper-networth');
const getTalismans = require('../../../API/stats/talismans');
const getDungeons = require('../../../API/stats/dungeons');
const getSkills = require('../../../API/stats/skills');
const getSlayer = require('../../../API/stats/slayer');
const getWeight = require('../../../API/stats/weight');

let prices;
getPrices().then((data) => { 
    prices = data
})

setInterval(async () => {
  prices = await getPrices();
}, 1000 * 60 * 5); 

class skyblockCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'skyblock'
    this.aliases = ['stats', 'sb']
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

      if (!prices) return this.send(`/gc ${username} Prices are still loading, please try again in a few seconds.`)
      if (data.status == 404) return this.send('/gc There is no player with the given UUID or name or the player has no Skyblock profiles')
      
      const [skills, slayer, networth, weight, dungeons, talismans] = await Promise.all([
        getSkills(data.player, data.profile),
        getSlayer(data.profile),
        getNetworth(data.profile, data.profileData?.banking?.balance || 0, { prices }),
        getWeight(data.profile, data.uuid),
        getDungeons(data.player, data.profile),
        getTalismans(data.profile),
      ])
      let common = talismans.common?.length, uncommon = talismans.uncommon?.length, rare = talismans.rare?.length, epic = talismans.epic?.length, legendary = talismans.legendary?.length, mythic = talismans.mythic?.length, special = talismans.special?.length, verySpecial = talismans.very?.length, recombobulated = 0, enrichment = 0
      const talismanCount = common + uncommon + rare + epic + legendary + mythic + special + verySpecial
      for (const rarity of Object.keys(talismans)) {
        if (rarity == "talismanBagUpgrades" || rarity == "currentReforge" || rarity == "unlockedReforges" || rarity == "tuningsSlots" || rarity == "tunings") continue
        for (const talisman of talismans[rarity]) {
          if (talisman.recombobulated) recombobulated ++
          if (talisman.enrichment) enrichment ++
        }
      }
      this.send(`/gc ${username}'s Senither Weight » ${Math.round((weight.weight.senither.total) * 100) / 100} | Lily Weight » ${Math.round(weight.weight.lily.total * 100) / 100} | Skill Average » ${Math.round(((skills.farming.level + skills.mining.level + skills.combat.level + skills.foraging.level + skills.fishing.level + skills.enchanting.level + skills.alchemy.level + skills.taming.level + skills.carpentry.level) / 9 )* 100) / 100} | Slayer » ${addCommas(slayer?.[Object.keys(slayer)[0]].xp + slayer?.[Object.keys(slayer)[1]].xp + slayer?.[Object.keys(slayer)[2]].xp + slayer?.[Object.keys(slayer)[3]].xp + slayer?.[Object.keys(slayer)[4]].xp)} | ${slayer?.[Object.keys(slayer)[0]].level} ${slayer?.[Object.keys(slayer)[1]].level} ${slayer?.[Object.keys(slayer)[2]].level} ${slayer?.[Object.keys(slayer)[3]].level} ${slayer?.[Object.keys(slayer)[4]].level} | Catacombs » ${dungeons.catacombs.skill.level} | Class Average » ${((dungeons.classes.healer.level + dungeons.classes.mage.level + dungeons.classes.berserk.level + dungeons.classes.archer.level + dungeons.classes.tank.level) / 5)} | Networth » ${addNotation("oneLetters", networth.networth) ?? 0} | Accessories » ${talismanCount ?? 0} | Recombobulated » ${recombobulated} | Enriched » ${enrichment}`)
    } catch (error) {
      console.log(error)
      this.send('/gc There is no player with the given UUID or name or the player has no Skyblock profiles')
    }
  }
}

module.exports = skyblockCommand