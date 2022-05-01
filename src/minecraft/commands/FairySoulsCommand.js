const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/Hypixel')
const axios = require('axios');

class StatsCommand extends MinecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'fairysouls'
        this.aliases = ['fs']
        this.description = 'Fairy Souls of specified user.'
    }

    onCommand(username, message) {
        let args = this.getArgs(message);
        let msg = args.shift();
        if (msg) {
            let temp = this;
            axios({
                method: 'get',
                url: `https://sky.shiiyu.moe/api/v2/profile/${msg}`
            }).then(function (response) {
                if(response.status >= 300){
                    temp.send('/gc The provided username doesn\'t exist!');
                }
                let profile = {};
                Object.keys(response.data.profiles).forEach((key) => {
                    if (response.data.profiles[key].current)    //trazi upravo sada otvoren profile
                        profile = response.data.profiles[key];
                })
                let name
                if(profile.data.profile.game_mode === 'ironman'){name = msg+' ♲'}else{name = msg}
                temp.send(`/gc ${name}\'s Fairy Souls: ${profile.data.fairy_souls.collected}/${profile.data.fairy_souls.total} | Progress: ${Math.round(profile.data.fairy_souls.progress * 100) / 100*100}%`)
            }).catch(()=>{this.send(`/gc ${username} the provided username doesn\'t exist!`)});
        } else {
            let temp = this;
            axios({
                method: 'get',
                url: `https://sky.shiiyu.moe/api/v2/profile/${username}`
            }).then(function (response) {
                if(response.status >= 300){
                    temp.send('The provided username doesn\'t exist!');
                }
                let profile = {};
                Object.keys(response.data.profiles).forEach((key) => {
                    if (response.data.profiles[key].current)
                        profile = response.data.profiles[key];
                })
                let name
                if(profile.data.profile.game_mode === 'ironman'){name = username+' ♲'}else{name = username}
                temp.send(`/gc ${name}\'s Fairy Souls: ${profile.data.fairy_souls.collected}/${profile.data.fairy_souls.total} | Progress: ${Math.round(profile.data.fairy_souls.progress * 100) / 100*100}%`)
            }).catch(()=>{this.send(`/gc ${username} the provided username doesn\'t exist!`)});
        }
    }
}
module.exports = StatsCommand