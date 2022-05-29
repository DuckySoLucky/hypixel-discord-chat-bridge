const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/Hypixel')

process.on('uncaughtException', function (err) {
	console.log(err.stack);
  });
  
class SwstatsCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'skywars'
    this.aliases = ['sw']
    this.description = 'Skywars stats of specified user.'
  }

  onCommand(username, message) {
	let msg = this.getArgs(message);
	if(msg[0] === undefined){
		let temp = this;
		hypixel.getPlayer(username).then(player => {
			temp.send(`/gc [SW] [${player.stats.skywars.level}✫]${player.nickname}ᐧᐧᐧᐧKDR:${player.stats.skywars.KDRatio}ᐧᐧᐧᐧWLR:${player.stats.skywars.WLRatio}ᐧᐧᐧᐧWS:${player.stats.skywars.winstreak}`)
		}).catch(e => {
			console.error(e);
		});
	}else{
		let temp = this;
		hypixel.getPlayer(msg[0]).then(player => {
			temp.send(`/gc [SW] [${player.stats.skywars.level}✫]${player.nickname}ᐧᐧᐧᐧKDR:${player.stats.skywars.KDRatio}ᐧᐧᐧᐧWLR:${player.stats.skywars.WLRatio}ᐧᐧᐧᐧWS:${player.stats.skywars.winstreak}`)
		}).catch(e => {
			console.error(e);
		});
	}
  }
}

module.exports = SwstatsCommand
