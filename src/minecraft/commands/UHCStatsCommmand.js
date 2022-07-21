const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/API/HypixelRebornAPI')
process.on('uncaughtException', function (err) {console.log(err.stack)});

async function UHCStats(username) {
	try {
		const player = await hypixel.getPlayer(username)
		return `[UHC] [${player.stats.uhc.starLevel}✫] ${player.nickname}ᐧᐧᐧᐧKDR:${player.stats.uhc.KDRatio}ᐧᐧᐧᐧWLR:${player.stats.uhc.wins}ᐧᐧᐧHeads:${player.stats.uhc.headsEaten}`
	}
	catch (error) {
		return error.toString().replaceAll('[hypixel-api-reborn] ', '')
	}
}


class UHCStatsCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'UHC'
    this.aliases = ['uhc']
    this.description = 'UHC Stats of specified user.'
  }

  async onCommand(username, message) {
	let msg = this.getArgs(message);
	if(msg[0] === undefined){
		this.send(`/gc ${await UHCStats(username)}`)
	}else{
		this.send(`/gc ${await UHCStats(msg[0])}`)
	}
  }
}

module.exports = UHCStatsCommand
