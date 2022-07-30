process.on('uncaughtException', function (err) {console.log(err.stack)})
const MinecraftCommand = require('../../contracts/MinecraftCommand')
const config = require('../../../config.json')
const axios = require('axios')

class nameHistoryCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'namehistory'
    this.aliases = ['nh']
    this.description = "Name History of specified user."
    this.options = ['name']
    this.optionsDescription = ['Minecraft Username']
  }

  async onCommand(username, message) {
    try {
      let msg = this.getArgs(message), description = ''
      if(msg[0]) username = msg[0]
      const response = await axios.get(`${config.api.playerDBAPI}/${msg[0]}`)
      if(response.data.code != 'player.found'){this.send('/gc There is no player with the given UUD or name.')}
      for (let i = 0; i < response.data.data.player.meta.name_history.length; i++) {
          description+=`${response.data.data.player.meta.name_history[i].name} » `
      }
      this.send(`/gc ${msg[0]}'s Name History » ${description}`)
    } catch (error) {
      this.send('/gc There is no player with the given UUID or name')
    }
  }
}

module.exports = nameHistoryCommand;