const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/API/HypixelRebornAPI')

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
	this.options = ['name']
	this.optionsDescription = ['Minecraft Username']
  }

  async onCommand(username, message) {
	try {
		let msg = this.getArgs(message);
		if(msg[0]) username = msg[0]
		this.send(`/gc ${await UHCStats(username)}`)
	} catch (error) {
		this.send('There is no player with the given UUID or name or player has never joined Hypixel.')
	}
  }
}

module.exports = UHCStatsCommand
