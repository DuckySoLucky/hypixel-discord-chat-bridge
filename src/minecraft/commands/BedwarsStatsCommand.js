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
      this.send(`/gc [BW] [${player.stats.bedwars.level}✫] ${player.nickname}ᐧᐧᐧᐧFK:${addCommas(player.stats.bedwars.finalKills)}ᐧᐧᐧᐧFKDR:${player.stats.bedwars.finalKDRatio}ᐧᐧᐧᐧWLR:${player.stats.bedwars.WLRatio}ᐧᐧᐧᐧWS:${player.stats.bedwars.winstreak}`)
    } catch (error) {
      console.log(error)
      this.send('There is no player with the given UUID or name or player has never joined Hypixel.')
    }
  }
}

module.exports = bedwarsCommand
