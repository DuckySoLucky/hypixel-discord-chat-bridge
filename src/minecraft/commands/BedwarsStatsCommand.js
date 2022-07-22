const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/API/HypixelRebornAPI')
process.on('uncaughtException', function (err) {console.log(err.stack)});

async function bwStats(username) {
  try {
    const player = await hypixel.getPlayer(username)
    return `[BW] [${player.stats.bedwars.level}✫] ${player.nickname}ᐧᐧᐧᐧFKDR:${player.stats.bedwars.finalKDRatio}ᐧᐧᐧᐧWLR:${player.stats.bedwars.WLRatio}ᐧᐧᐧᐧWS:${player.stats.bedwars.winstreak}`
  }
  catch (error) {
    return error.toString().replaceAll('[hypixel-api-reborn] ', '')
  }
}
	

class BwstatsCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'bedwars'
    this.aliases = ['bw', 'bws']
    this.description = 'BedWars stats of specified user.'
  }

  async onCommand(username, message) {
    let msg = this.getArgs(message);
    if(msg[0]) username = msg[0]
    this.send(`/gc ${await bwStats(username)}`)
  }
}

module.exports = BwstatsCommand