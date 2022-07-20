const MinecraftCommand = require('../../contracts/MinecraftCommand')
const skyShiiyuAPI = require('../../contracts/API/SkyShiiyuAPI')
process.on('uncaughtException', function (err) {console.log(err.stack)});

async function fairySouls(username) {
    try {
      const profile = await skyShiiyuAPI.getProfile(username)
      if(profile.data.profile.game_mode == 'ironman') username = `♲ ${username}`
      return `${username}\'s Fairy Souls: ${profile.data.fairy_souls.collected}/${profile.data.fairy_souls.total} | Progress: ${Math.round(profile.data.fairy_souls.progress * 100) / 100*100}%`
    }
    catch (error) {
      return error//.toString().replaceAll('[hypixel-api-reborn] ', '')
    }
}

class StatsCommand extends MinecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'fairysouls'
        this.aliases = ['fs']
        this.description = 'Fairy Souls of specified user.'
    }

    async onCommand(username, message) {
        let msg = this.getArgs(message);
        if (!msg[0]) {
            this.send(`/gc ${await fairySouls(username)}`)   
        } else {
            this.send(`/gc ${await fairySouls(msg[0])}`) 
        }
    }
}
module.exports = StatsCommand