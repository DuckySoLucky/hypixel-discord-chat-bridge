const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/Hypixel')

class UHCStatsCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'UHC'
    this.aliases = ['uhc']
    this.description = 'UHC Stats of specified user.'
  }

  onCommand(username, message) {
	let msg = this.getArgs(message);
	if(msg[0] === undefined){
		let temp = this;
		hypixel.getPlayer(username).then(player => {
      console.log(player.stats.uhc)
			temp.send(`/gc [UHC] [${player.stats.uhc.starLevel}✫]${player.nickname}ᐧᐧᐧᐧKDR:${player.stats.uhc.KDRatio}ᐧᐧᐧᐧWLR:${player.stats.uhc.wins}ᐧᐧᐧHeads:${player.stats.uhc.headsEaten}`)
      
		}).catch(e => {
			console.error(e);
		});
	}else{
		let temp = this;
		hypixel.getPlayer(msg[0]).then(player => {
      console.log(player.stats.UHC_champion)
			temp.send(`/gc [UHC] [${player.stats.uhc.starLevel}✫]${player.nickname}ᐧᐧᐧᐧKDR:${player.stats.uhc.KDRatio}ᐧᐧᐧᐧWLR:${player.stats.uhc.wins}ᐧᐧᐧHeads:${player.stats.uhc.headsEaten}`)
		}).catch(e => {
			console.error(e);
		});
	}
  }
}

module.exports = UHCStatsCommand
