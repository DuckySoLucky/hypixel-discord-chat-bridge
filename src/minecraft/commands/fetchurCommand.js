const MinecraftCommand = require('../../contracts/MinecraftCommand')
const { getFetchur } = require('../../../API/functions/getFecthur')

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
      const fetchur = getFetchur()
      this.send(`/gc Fetchur Requests » ${fetchur.text}`)
    } catch (error) {
      this.send('/gc Something went wrong..')
    }
  }
}

module.exports = fetchurCommand

