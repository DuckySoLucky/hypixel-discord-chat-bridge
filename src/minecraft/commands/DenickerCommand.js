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
            username = this.getArgs(message)[0];
            const response = (await axios.get(`${config.api.antiSniperAPI}/denick?key=${config.api.antiSniperKey}&nick=${username}`)).data;

            if (!response.player?.ign) return this.send('/gc Sorry, I wasn\'t able to denick this person.')

            const player = await hypixel.getPlayer(response.player?.ign);
            this.send(`/gc ${player.rank ? `[${player.rank}] ` : ``}${response.player?.ign} is nicked as ${response.player.queried_nick}`);
        } catch (error) {
            this.send('/gc Sorry, I wasn\'t able to denick this person.')
        }
    }
}

module.exports = DenickerCommand
