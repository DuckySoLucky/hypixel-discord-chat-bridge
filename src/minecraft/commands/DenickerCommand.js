const MinecraftCommand = require('../../contracts/MinecraftCommand')
const axios = require('axios');
const fetch = require('node-fetch');

process.on('uncaughtException', function (err) {
  console.log(err.stack);
});

class DenickerCommand extends MinecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'denick'
        this.aliases = ['unnicker', 'nick', 'denick']
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
                temp.send('/gc The provided nick doesn\'t exist!');
            }
            temp.send(`/gc ${response.player.nick}\'s Username is ${response.player.ign}`)
        }).catch(()=>{this.send(`/gc ${username} the provided nick doesn\'t exist!`)});
    }
}

module.exports = DenickerCommand