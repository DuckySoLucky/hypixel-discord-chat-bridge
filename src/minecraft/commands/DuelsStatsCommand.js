const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/Hypixel')



class DuelsStatsCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'duels'
    this.aliases = ['duel']
    this.description = 'Duels stats of specified user.'
  }


  onCommand(username, message) {
	let msg = this.getArgs(message);
	if(msg[0] === undefined){
		let temp = this;
		hypixel.getPlayer(username).then(player => {
			temp.send(`/gc [Duels] [${player.stats.duels.division}] ${username} Wins: ${player.stats.duels.wins} | CWS: ${player.stats.duels.winstreak} | BWS: ${player.stats.duels.bestWinstreak} | WLR: ${player.stats.duels.WLRatio}`)
		}).catch(e => {
			console.error(e);
            this.send(e);
		});
	}else{
		let temp = this;
		hypixel.getPlayer(msg[0]).then(player => {
			temp.send(`/gc [Duels] [${player.stats.duels.division}] ${msg[0]} Wins: ${player.stats.duels.wins} | CWS: ${player.stats.duels.winstreak} | BWS: ${player.stats.duels.bestWinstreak} | WLR: ${player.stats.duels.WLRatio}`)
		}).catch(e => {
			console.error(e);
            this.send(e);
		});
	}
  }
}

module.exports = DuelsStatsCommand
