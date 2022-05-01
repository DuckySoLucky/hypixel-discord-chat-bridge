const MinecraftCommand = require('../../contracts/MinecraftCommand')
const axios = require('axios');

class StatsCommand extends MinecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'weight'
        this.aliases = ['stats']
        this.description = 'Skyblock Stats of specified user.'
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
                temp.send(`/gc ${name}\'s Weight = ${Math.round(profile.data.weight.senither.overall* 100) / 100} ᐧᐧᐧᐧ Skill Average = ${Math.round(profile.data.average_level* 100) / 100} ᐧᐧᐧᐧ Catacombs = ${profile.data.dungeons.catacombs.level.level}`);
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
                    if (response.data.profiles[key].current)    //trazi upravo sada otvoren profile
                        profile = response.data.profiles[key];
                })
                let name
                if(profile.data.profile.game_mode === 'ironman'){name = username+' ♲'}else{name = username}
                temp.send(`/gc ${name}\'s Weight = ${Math.round(profile.data.weight.senither.overall* 100) / 100} ᐧᐧᐧᐧ  Skill Average = ${Math.round(profile.data.average_level* 100) / 100} ᐧᐧᐧᐧ Catacombs = ${profile.data.dungeons.catacombs.level.level}`);
            }).catch(()=>{this.send(`/gc ${username} the provided username doesn\'t exist!`)});
        }
    }
}

module.exports = StatsCommand