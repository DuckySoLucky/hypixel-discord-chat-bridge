process.on('uncaughtException', function (err) {console.log(err.stack)})
const MinecraftCommand = require('../../contracts/MinecraftCommand')
const { getPlayer } = require('../../contracts/getSkyblockProfile')

async function getFairySouls(username) {
  try {
    const response = await getPlayer(username)
    return `${username}\'s Fairy Souls: ${response.memberData.fairy_souls_collected}/238 | Progress: ${Math.round(response.memberData.fairy_souls_collected/238 * 100) / 100*100}%`
  } catch(error) {
    return error
  }
}

class fairySoulsCommand extends MinecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'fairysouls'
        this.aliases = ['fs']
        this.description = 'Fairy Souls of specified user.'
        this.options = ['name']
        this.optionsDescription = ['Minecraft Username']
    }

    async onCommand(username, message) {
        let msg = this.getArgs(message);
        if(msg[0]) username = msg[0]
        this.send(`/gc ${await getFairySouls(username)}`)   
    }
}
module.exports = fairySoulsCommand