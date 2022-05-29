const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/Hypixel')

process.on('uncaughtException', function (err) {
	console.log(err.stack);
  });
  
class BwstatsCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'bedwars'
    this.aliases = ['bw']
    this.description = 'BedWars stats of specified user.'
  }

  onCommand(username, message) {
	let msg = this.getArgs(message);
	if(msg[0] === undefined){
		let temp = this;
		hypixel.getPlayer(username).then(player => {
			temp.send(`/gc [BW] [${player.stats.bedwars.level}✫]${player.nickname}ᐧᐧᐧᐧFKDR:${player.stats.bedwars.finalKDRatio}ᐧᐧᐧᐧWLR:${player.stats.bedwars.WLRatio}ᐧᐧᐧᐧWS:${player.stats.bedwars.winstreak}`)
		}).catch(e => {
			temp.send(`/gc ${e}`)
		});
	}else{
		let temp = this;
		hypixel.getPlayer(msg[0]).then(player => {
			temp.send(`/gc [BW] [${player.stats.bedwars.level}✫]${player.nickname}ᐧᐧᐧᐧFKDR:${player.stats.bedwars.finalKDRatio}ᐧᐧᐧᐧWLR:${player.stats.bedwars.WLRatio}ᐧᐧᐧᐧWS:${player.stats.bedwars.winstreak}`)
		}).catch(e => {
			temp.send(`/gc ${e}`)
		});
	}
  }
}

module.exports = BwstatsCommand