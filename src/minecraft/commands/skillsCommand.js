const MinecraftCommand = require('../../contracts/MinecraftCommand')
const { getLatestProfile } = require('../../../API/functions/getLatestProfile');
const getSkills = require('../../../API/stats/skills')

class skillsCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'skills'
    this.aliases = ['skill']
    this.description = 'Skills and Skill Average of specified user.'
    this.options = ['name']
    this.optionsDescription = ['Minecraft Username']
  }

  async onCommand(username, message) {
    try {
      const arg = this.getArgs(message)
      if (arg[0]) username = arg[0]
      const data = await getLatestProfile(username)
      username = data.profileData?.game_mode ? `♲ ${username}` : username
      const profile = getSkills(data.player, data.profile)
      this.send(`/gc Skill Average » ${Math.round(((profile.farming.level + profile.mining.level + profile.combat.level + profile.foraging.level + profile.fishing.level + profile.enchanting.level + profile.alchemy.level + profile.taming.level + profile.carpentry.level) / 9) * 100) / 100} | Farming - ${Math.round(profile.farming.levelWithProgress * 100) / 100} | Mining - ${Math.round(profile.mining.levelWithProgress * 100) / 100} | Combat - ${Math.round(profile.combat.levelWithProgress * 100) / 100} | Enchanting - ${Math.round(profile.enchanting.levelWithProgress * 100) / 100} | Fishing - ${Math.round(profile.fishing.levelWithProgress * 100) / 100} | Foraging - ${Math.round(profile.foraging.levelWithProgress * 100) / 100} | Alchemy - ${Math.round(profile.alchemy.levelWithProgress * 100) / 100} | Taming - ${Math.round(profile.taming.levelWithProgress * 100) / 100} | Carpentry - ${Math.round(profile.carpentry.levelWithProgress * 100) / 100}`)
    } catch (error) {
      this.send('/gc There is no player with the given UUID or name or the player has no Skyblock profiles')
    }
  }
}

module.exports = skillsCommand
