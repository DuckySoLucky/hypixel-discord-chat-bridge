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
      let ign = msg[0] ? msg[0] : username;
      if (ign == 'solo' || ign == 'doubles' || ign == 'threes' || ign == 'fours' || ign == '4v4') {
        const player = await hypixel.getPlayer(username)
        this.send(`/gc [BW] [${player.stats.bedwars.level}✫] ${player.nickname} ${ign} FK: ${addCommas(player.stats.bedwars[ign].finalKills)} FKDR: ${player.stats.bedwars[ign].finalKDRatio} Wins: ${player.stats.bedwars[ign].wins} WLR: ${player.stats.bedwars[ign].WLRatio} Beds: ${player.stats.bedwars[ign].beds.broken} BLR: ${player.stats.bedwars[ign].beds.BLRatio} WS: ${player.stats.bedwars[ign].winstreak}`)
      }
      else {
        // check message for second part of command for mode
        let mode = msg[1] ? msg[1] : 'all';
        const player = await hypixel.getPlayer(ign)
        if (mode == 'solo' || mode == 'doubles' || mode == 'threes' || mode == 'fours' || mode == '4v4') {
          this.send(`/gc [BW] [${player.stats.bedwars.level}✫] ${player.nickname} ${mode} FK: ${addCommas(player.stats.bedwars[mode].finalKills)} FKDR: ${player.stats.bedwars[mode].finalKDRatio} Wins: ${player.stats.bedwars[mode].wins} WLR: ${player.stats.bedwars[mode].WLRatio} Beds: ${player.stats.bedwars[mode].beds.broken} BLR: ${player.stats.bedwars[mode].beds.BLRatio} WS: ${player.stats.bedwars[mode].winstreak}`)
        }
        else if (mode == 'all' || mode == 'overall' || mode == null) {
          this.send(`/gc [BW] [${player.stats.bedwars.level}✫] ${player.nickname} FK: ${addCommas(player.stats.bedwars.finalKills)} FKDR: ${player.stats.bedwars.finalKDRatio} Wins: ${player.stats.bedwars.wins} WLR: ${player.stats.bedwars.WLRatio} Beds: ${player.stats.bedwars.beds.broken} BLR: ${player.stats.bedwars.beds.BLRatio} WS: ${player.stats.bedwars.winstreak}`)
        }
        else {
          this.send(`/gc [BW] [${player.stats.bedwars.level}✫] ${player.nickname} FK: ${addCommas(player.stats.bedwars.finalKills)} FKDR: ${player.stats.bedwars.finalKDRatio} Wins: ${player.stats.bedwars.wins} WLR: ${player.stats.bedwars.WLRatio} Beds: ${player.stats.bedwars.beds.broken} BLR: ${player.stats.bedwars.beds.BLRatio} WS: ${player.stats.bedwars.winstreak}`)
        }
      }
    } catch (error) {
      console.log(error)
      this.send('There is no player with the given UUID or name or player has never joined Hypixel.')
    }
  }
}

module.exports = bedwarsCommand