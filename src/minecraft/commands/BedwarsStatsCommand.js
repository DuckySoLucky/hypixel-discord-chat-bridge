const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/API/HypixelRebornAPI')
const { addCommas } = require('../../contracts/helperFunctions')

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
      const player = await hypixel.getPlayer(username)
      this.send(`/gc [BW] [${player.stats.bedwars.level}✫] ${player.nickname} FK: ${addCommas(player.stats.bedwars.finalKills)} FKDR: ${player.stats.bedwars.finalKDRatio} Wins: ${player.stats.bedwars.wins} WLR: ${player.stats.bedwars.WLRatio} Beds: ${player.stats.bedwars.beds.broken} BLR: ${player.stats.bedwars.beds.BLRatio} WS: ${player.stats.bedwars.winstreak}`)
    } catch (error) {
      console.log(error)
      this.send('There is no player with the given UUID or name or player has never joined Hypixel.')
    }
  }
}

module.exports = bedwarsCommand
