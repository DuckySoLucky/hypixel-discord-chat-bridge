const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/API/HypixelRebornAPI')
const { addNotation } = require('../../contracts/helperFunctions')

class PlayerCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'player'
    this.aliases = ['']
    this.description = 'Look up a player'
  }


  onCommand(username, message) {
    const player = message.split(' ')[1]
    hypixel.getPlayer(player).then((data) => {
      if (data.isOnline == false) {
        this.send(`/gc Info for [${player.rank}] ${player} - Karma: ${addNotation("oneLetters", data.karma) ?? 0} Network Level: ${data.level} Achievement Points: ${addNotation("oneLetters", data.achievementPoints) ?? 0} Guild: ${data.guild} Online Status: Offline`)
      }
      else {
        this.send(`/gc Info for [${player.rank}] ${player} - Karma: ${addNotation("oneLetters", data.karma) ?? 0} Network Level: ${data.level} Achievement Points: ${addNotation("oneLetters", data.achievementPoints) ?? 0} Guild: ${data.guild} Online Status: Online`)
      }
    }).catch((error) => {
      this.send(`/gc ${player} is not a valid player!`)
      console.log(error)
    })
  }
}

module.exports = PlayerCommand