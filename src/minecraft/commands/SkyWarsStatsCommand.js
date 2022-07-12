const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/API/HypixelRebornAPI')
process.on('uncaughtException', function (err) {console.log(err.stack)});

async function swStats(username) {
	try {
	  const player = await hypixel.getPlayer(username)
	  return `[SW] [${player.stats.skywars.level}✫] ${player.nickname}ᐧᐧᐧᐧKDR:${player.stats.skywars.KDRatio}ᐧᐧᐧᐧWLR:${player.stats.skywars.WLRatio}ᐧᐧᐧᐧWS:${player.stats.skywars.winstreak}`
	}
	catch (error) {
	  return error.toString().replaceAll('[hypixel-api-reborn] ', '')
	}
}

class SwstatsCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'skywars'
    this.aliases = ['sw']
    this.description = 'Skywars stats of specified user.'
  }

  async onCommand(username, message) {
    let msg = this.getArgs(message);
    if(!msg[0]){
      this.send(`/gc ${await swStats(username)}`)
    } else {
      this.send(`/gc ${await swStats(msg[0])}`)
    }
  }
}

module.exports = SwstatsCommand
