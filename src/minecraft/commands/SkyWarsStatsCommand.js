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
      let msg = this.getArgs(message);
      let mode = null;

      if (msg[0] && !['solo', 'teams'].includes(msg[0])) {
        username = msg[0]
        if (msg[1]) mode = msg[1];
      }

      const player = await hypixel.getPlayer(username)

      if (!['solo', 'teams'].includes(username)) {
        let overallKills = data.stats.skywars[username].normal.kills + data.stats.skywars[username].insnae.kills
        let overallDeaths = data.stats.skywars[username].normal.deaths + data.stats.skywars[username].insane.deaths
        let overallWins = data.stats.skywars[username].normal.wins + data.stats.skywars[username].insane.wins
        let overallLosses = data.stats.skywars[username].normal.losses + data.stats.skywars[username].insane.losses
        let overallKDR = overallKills / overallDeaths
        let overallWLR = overallWins / overallLosses
        this.send(`/gc [SW] [${player.stats.skywars.level}✫] ${player.nickname} ${username} Kills: ${overallKills} KDR: ${overallKDR} Wins: ${overallWins} WLR: ${overallWLR}`)
      } else {
        if (['solo', 'teams'].includes(mode)) {
          let overallKills = data.stats.skywars[mode].normal.kills + data.stats.skywars[mode].insnae.kills
          let overallDeaths = data.stats.skywars[mode].normal.deaths + data.stats.skywars[mode].insane.deaths
          let overallWins = data.stats.skywars[mode].normal.wins + data.stats.skywars[mode].insane.wins
          let overallLosses = data.stats.skywars[mode].normal.losses + data.stats.skywars[mode].insane.losses
          let overallKDR = overallKills / overallDeaths
          let overallWLR = overallWins / overallLosses
          this.send(`/gc [SW] [${player.stats.skywars.level}✫] ${player.nickname} ${mode} Kills: ${overallKills} KDR: ${overallKDR} Wins: ${overallWins} WLR: ${overallWLR}`)
        } else {
          this.send(`/gc [SW] [${player.stats.skywars.level}✫] ${player.nickname} KDR: ${player.stats.skywars.KDRatio} WLR: ${player.stats.skywars.WLRatio} WS: ${player.stats.skywars.winstreak}`)
        }
      }
    } catch (error) {
      this.send('There is no player with the given UUID or name or player has never joined Hypixel.')
    }
  }
}

module.exports = skywarsCommand
