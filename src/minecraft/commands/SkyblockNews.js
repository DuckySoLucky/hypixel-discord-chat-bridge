const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/API/HypixelRebornAPI')
const hypixelAPI = require('../../contracts/API/HypixelAPI')

process.on('uncaughtException', function (err) {console.log(err.stack)})

class SkyblockNewsCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'news'
    this.aliases = ['sbnews']
    this.description = 'Check latest Hypixel Network News.'
    this.options = []
    this.optionsDescription = []
  }

  async onCommand(username, message) {
    try {
      const news = await hypixelAPI.getLatestSkyblockNews()
      this.send(`/gc ${news.items[0].title} » ${news.items[0].link}`)
    } catch (error) {
      this.send('/gc Something went wrong..')
    }
  }
}

module.exports = SkyblockNewsCommand

