const MinecraftCommand = require('../../contracts/MinecraftCommand')
const skyHelperAPI = require('../../contracts/API/SkyHelperAPI')
process.on('uncaughtException', function (err) {console.log(err.stack)});

class InfoCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'fetchur'
    this.aliases = []
    this.description = 'Information about an item for Fetchur.'
    this.options = []
  }

  async onCommand(username, message) {
    const fetchur = await skyHelperAPI.getFetchur()
    this.send(`/gc Fetchur Requests » ${fetchur.data.text}`)
  }
}

module.exports = InfoCommand

