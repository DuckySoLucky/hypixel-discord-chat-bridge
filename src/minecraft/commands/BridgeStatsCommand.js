const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/Hypixel')



class BridgestatsCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'bridge'
    this.aliases = ['br']
    this.description = 'Bridge stats of specified user.'
  }


  onCommand(username, message) {
	let msg = this.getArgs(message);
	if(msg[0] === undefined){
		let temp = this;
		hypixel.getPlayer(username).then(player => {
			temp.send(`/gc [Bridge] [${player.stats.duels.bridge.overall.division}] ${username} Wins: ${player.stats.duels.bridge.overall.wins} | CWS: ${player.stats.duels.bridge.overall.winstreak} | BWS: ${player.stats.duels.bridge.overall.bestWinstreak} | WLR: ${player.stats.duels.bridge.overall.WLRatio}`)
			console.log(player.stats.duels.bridge)
		}).catch(e => {
			console.error(e);
            this.send(e);
		});
	}else{
		let temp = this;
		hypixel.getPlayer(msg[0]).then(player => {
			temp.send(`/gc [Bridge] [${player.stats.duels.bridge.overall.division}] ${username} Wins: ${player.stats.duels.bridge.overall.wins} | CWS: ${player.stats.duels.bridge.overall.winstreak} | BWS: ${player.stats.duels.bridge.overall.bestWinstreak} | WLR: ${player.stats.duels.bridge.overall.WLRatio}`)
			console.log(player.stats.duels.bridge)
		}).catch(e => {
			console.error(e);
            this.send(e);
		});
	}
  }
}

module.exports = BridgestatsCommand
