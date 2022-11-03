const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/API/HypixelRebornAPI')
class skywarsCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'skywars'
    this.aliases = ['sw']
    this.description = 'Skywars stats of specified user.'
    this.options = ['name']
    this.optionsDescription = ['Minecraft Username']
  }

  async onCommand(username, message) {
    try {
      const msg = this.getArgs(message);
      if (msg[0]) username = msg[0]
      const player = await hypixel.getPlayer(username)
      this.send(`/gc [SW] [${player.stats.skywars.level}✫] ${player.nickname}ᐧᐧᐧᐧKDR:${player.stats.skywars.KDRatio}ᐧᐧᐧᐧWLR:${player.stats.skywars.WLRatio}ᐧᐧᐧᐧWS:${player.stats.skywars.winstreak}`)
    } catch (error) {
      this.send('There is no player with the given UUID or name or player has never joined Hypixel.')
    }
  }
}

module.exports = skywarsCommand
