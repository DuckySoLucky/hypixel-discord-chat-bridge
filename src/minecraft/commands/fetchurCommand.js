const MinecraftCommand = require('../../contracts/MinecraftCommand')
const skyHelperAPI = require('../../contracts/API/SkyHelperAPI')
process.on('uncaughtException', function (err) {console.log(err.stack)})

class fetchurCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'fetchur'
    this.aliases = []
    this.description = 'Information about an item for Fetchur.'
    this.options = []
  }

  async onCommand(username, message) {
    try {
      const fetchur = await skyHelperAPI.getFetchur()
      this.send(`/gc Fetchur Requests » ${fetchur.data.text}`)
    } catch (error) {
      this.send('/gc Something went wrong..')
    }
  }
}

module.exports = fetchurCommand

