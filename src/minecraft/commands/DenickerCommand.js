process.on('uncaughtException', function (err) {console.log(err.stack)})
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
        let temp = this;
        let args = this.getArgs(message);
        let msg = args.shift();
        axios({
            method: 'get',
            url: `${config.api.antiSniperAPI}/denick?key=${config.api.antiSniperKey}&nick=${msg}`
        }).then(function (response) {
            if(response.status >= 300){temp.send('/gc Sorry, I wasn\'t able to denick this player.')}
            hypixel.getPlayer(response.data.player.ign).then(player => {
            	temp.send(`/gc [${player.rank}] ${response.data.player.ign} is ${response.data.player.nick}`)
			}).catch(error => {temp.send('/gc ' + error.toString().replaceAll('[hypixel-api-reborn] ', ''))})
        }).catch(()=>{this.send('/gc Sorry, I wasn\'t able to denick this player.')});
    }
}

module.exports = DenickerCommand