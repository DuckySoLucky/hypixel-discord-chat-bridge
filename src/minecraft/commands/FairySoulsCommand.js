const MinecraftCommand = require('../../contracts/MinecraftCommand')
const { getLatestProfile } = require('../../../API/functions/getLatestProfile');

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
      try {
        let msg = this.getArgs(message)
        if(msg[0]) username = msg[0]

        const data = await getLatestProfile(username)
        username = data.profileData?.game_mode ? `♲ ${username}` : username
        this.send(`/gc ${username}'s Fairy Souls: ${data.profile.fairy_souls_collected}/238 | Progress: ${Math.round(data.profile.fairy_souls_collected/238 * 100) / 100*100}%`)   
      } catch (error) {
        console.log(error)
        this.send('/gc There is no player with the given UUID or name or the player has no Skyblock profiles')
      }
    }
}

module.exports = fairySoulsCommand