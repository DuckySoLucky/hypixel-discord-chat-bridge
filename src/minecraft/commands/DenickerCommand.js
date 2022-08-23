const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/API/HypixelRebornAPI')
const config = require('../../../config.json')
const axios = require('axios');

class DenickerCommand extends MinecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'denick'
        this.aliases = []
        this.description = 'Denick username of specified user.'
        this.options = ['nick']
        this.optionsDescription = ['Minecraft Username']
    }
    
    async onCommand(username, message) {
        try {
            let arg = this.getArgs(message);
            const response = (await axios.get(`${config.api.antiSniperAPI}/denick?key=${config.api.antiSniperKey}&nick=${arg[0]}`)).data
            hypixel.getPlayer(response.data?.player?.ign).then(player => {
                this.send(`/gc [${player?.rank}] ${response?.player?.ign} is ${response?.data?.nick}`)
            }).catch(error => {this.send('/gc ' + error.toString().replaceAll('[hypixel-api-reborn] ', ''))})
        } catch (error) {
            this.send('/gc Sorry, I wasn\' able to denick this person.')
        }
    }
}

module.exports = DenickerCommand