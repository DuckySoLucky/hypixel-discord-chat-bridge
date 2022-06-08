const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/Hypixel')

process.on('uncaughtException', function (err) {
  console.log(err.stack);
});

class SkyblockNewsCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'news'
    this.aliases = ['sbnews']
    this.description = 'Check latest Hypixel Network News.'
  }

  onCommand(username, message) {
    let temp = this;
	hypixel.getSkyblockNews().then((news) => {
        temp.send(`/gc ` + news[0].link)
      })
      .catch(console.log)
  }
}

module.exports = SkyblockNewsCommand

