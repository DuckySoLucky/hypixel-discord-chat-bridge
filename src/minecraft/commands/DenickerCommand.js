const MinecraftCommand = require('../../contracts/MinecraftCommand')
const axios = require('axios');
const hypixel = require('../../contracts/Hypixel')

process.on('uncaughtException', function (err) {
  console.log(err.stack);
});

class DenickerCommand extends MinecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'denick'
        this.aliases = ['unnicker', 'nick', 'denicker', 'unnick']
        this.description = 'Denick username of specified user.'
    }
    
    async onCommand(username, message) {
        let args = this.getArgs(message);
        let msg = args.shift();
        let temp = this;
        
        axios({
            method: 'get',
            url: `https://api.antisniper.net/denick?key=3a55ea8f-9e85-4003-9912-6198122cd27f&nick=${msg}`
        }).then(function (response) {

            if(response.status >= 300){
                temp.send('/gc The provided nickname doesn\'t exist!');
            }
            hypixel.getPlayer(response.data.player.ign).then(player => {
                console.log(player.rank)
            	temp.send(`/gc [${player.rank}] ${response.data.player.ign} is ${response.data.player.nick}`)
			}).catch(e => {temp.send('/gc ' + e); });
        }).catch(()=>{this.send(`/gc ${username} the provided nickname doesn\'t exist!`)});
    }
}

module.exports = DenickerCommand