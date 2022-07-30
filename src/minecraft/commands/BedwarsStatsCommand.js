process.on('uncaughtException', function (err) {console.log(err.stack)})
const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/API/HypixelRebornAPI')

async function bwStats(username) {
  try {
    const player = await hypixel.getPlayer(username)
    return `[BW] [${player.stats.bedwars.level}✫] ${player.nickname}ᐧᐧᐧᐧFKDR:${player.stats.bedwars.finalKDRatio}ᐧᐧᐧᐧWLR:${player.stats.bedwars.WLRatio}ᐧᐧᐧᐧWS:${player.stats.bedwars.winstreak}`
  }
  catch (error) {
    return error.toString().replaceAll('[hypixel-api-reborn] ', '')
  }
}

class bedwarsCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'bedwars'
    this.aliases = ['bw', 'bws']
    this.description = 'BedWars stats of specified user.'
    this.options = ['name']
    this.optionsDescription = ['Minecraft Username']
  }

  async onCommand(username, message) {
    try {
      let msg = this.getArgs(message);
      if(msg[0]) username = msg[0]
      this.send(`/gc ${await bwStats(username)}`)
    } catch (error) {
      this.send('There is no player with the given UUID or name or player has never joined Hypixel.')
    }
  }
}

module.exports = bedwarsCommand