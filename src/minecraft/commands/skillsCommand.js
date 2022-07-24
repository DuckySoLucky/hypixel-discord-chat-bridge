const MinecraftCommand = require('../../contracts/MinecraftCommand')
const skyHelperAPI = require('../../contracts/API/SkyHelperAPI')
process.on('uncaughtException', function (err) {console.log(err.stack)});

class InfoCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'skills'
    this.aliases = ['skill']
    this.description = 'Skills and Skill Average of specified user.'
    this.options = ['name']
    this.optionsDescription = ['Minecraft Username']
  }

  async onCommand(username, message) {
    let msg = this.getArgs(message);
    if(msg[0]) username = msg[0]
    const profile = await skyHelperAPI.getProfile(username)
    if (profile.isIronman) username = `♲ ${username}`
    this.send(`/gc Skill Average » ${Math.round(((profile.skills.farming.level + profile.skills.mining.level + profile.skills.combat.level + profile.skills.foraging.level + profile.skills.fishing.level + profile.skills.enchanting.level + profile.skills.alchemy.level + profile.skills.taming.level ) / 8 )* 100) / 100} | Farming - ${Math.round(profile.skills.farming.levelWithProgress * 100) / 100} | Mining - ${Math.round(profile.skills.mining.levelWithProgress * 100) / 100} | Combat - ${Math.round(profile.skills.combat.levelWithProgress * 100) / 100} | Enchanting - ${Math.round(profile.skills.enchanting.levelWithProgress * 100) / 100} | Fishing - ${Math.round(profile.skills.fishing.levelWithProgress * 100) / 100} | Foraging - ${Math.round(profile.skills.foraging.levelWithProgress * 100) / 100} | Alchemy - ${Math.round(profile.skills.alchemy.levelWithProgress * 100) / 100} | Taming - ${Math.round(profile.skills.taming.levelWithProgress * 100) / 100}`)
  }
}

module.exports = InfoCommand
