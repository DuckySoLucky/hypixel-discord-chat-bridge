const MinecraftCommand = require('../../contracts/MinecraftCommand')
const axios = require('axios');

process.on('uncaughtException', function (err) {
  console.log(err.stack);
});

class SlayersCommand extends MinecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'slayer'
        this.aliases = ['slayers']
        this.description = 'Slayer of specified user.'
    }

    onCommand(username, message) {
        let args = this.getArgs(message);
        if (args[0]) {
            let temp = this;
            axios({
                method: 'get',
                url: `https://sky.shiiyu.moe/api/v2/profile/${args[0]}`
            }).then(function (response) {
                if(response.status >= 300){
                    temp.send('/gc The provided username doesn\'t exist!');
                }
                let profile = {};
                Object.keys(response.data.profiles).forEach((key) => {
                    if (response.data.profiles[key].current)    //trazi upravo sada otvoren profile
                        profile = response.data.profiles[key];
                })
                let name, total
                let zL = profile.data.slayers.zombie.level.currentLevel
                let sL = profile.data.slayers.spider.level.currentLevel
                let wL = profile.data.slayers.wolf.level.currentLevel
                let eL = profile.data.slayers.enderman.level.currentLevel
                let bL= profile.data.slayers.blaze.level.currentLevel
                let zE = profile.data.slayers.zombie.xp
                let sE = profile.data.slayers.spider.xp
                let wE = profile.data.slayers.wolf.xp
                let eE = profile.data.slayers.enderman.xp
                let bE = profile.data.slayers.blaze.xp
                total = zE + sE + wE + eE + bE
                if(profile.data.profile.game_mode === 'ironman'){name = args[0]+' ♲'}else{name = args[0]}


                if(args[1] == 'zombie'){
                    temp.send(`/gc ${name}\'s zombie slayer: Experience: ${zE} | Level: ${zL}`)
                }else if (args[1] == 'spider'){
                    temp.send(`/gc ${name}\'s spider slayer: Experience: ${sE} | Level: ${sL} `)
                }else if(args[1] == 'wolf'){
                    temp.send(`/gc ${name}\'s wolf slayer: Experience: ${wE} | Level: ${wL}`)
                }else if(args[1] == 'enderman'){
                    temp.send(`/gc ${name}\'s enderman slayer: Experience: ${eE} | Level: ${eL} `)
                }else if(args[1] == 'blaze'){
                    temp.send(`/gc ${name}\'s blaze slayer: Experience: ${bE} | Level: ${eL} `)
                }else{
                    temp.send(`/gc ${name}\'s slayer: Experience: ${total} | ${zL} ${sL} ${wL} ${eL} ${bL}`)
                }
            })
        }else{
            let temp = this;
            axios({
                method: 'get',
                url: `https://sky.shiiyu.moe/api/v2/profile/${username}`
            }).then(function (response) {
                if(response.status >= 300){
                    temp.send('/gc The provided username doesn\'t exist!');
                }
                let profile = {};
                Object.keys(response.data.profiles).forEach((key) => {
                    if (response.data.profiles[key].current)    //trazi upravo sada otvoren profile
                        profile = response.data.profiles[key];
                })
                let name, total
                let zL = profile.data.slayers.zombie.level.currentLevel
                let sL = profile.data.slayers.spider.level.currentLevel
                let wL = profile.data.slayers.wolf.level.currentLevel
                let eL = profile.data.slayers.enderman.level.currentLevel
                let bL= profile.data.slayers.blaze.level.currentLevel
                let zE = profile.data.slayers.zombie.xp
                let sE = profile.data.slayers.spider.xp
                let wE = profile.data.slayers.wolf.xp
                let eE = profile.data.slayers.enderman.xp
                let bE = profile.data.slayers.blaze.xp
                total = zE + sE + wE + eE + bE
                if(profile.data.profile.game_mode === 'ironman'){name = username+' ♲'}else{name = username}

                if(args[1] == 'zombie'){
                    temp.send(`/gc ${name}\'s zombie slayer: Experience: ${zE} | Level: ${zL}`)
                }else if (args[1] == 'spider'){
                    temp.send(`/gc ${name}\'s spider slayer: Experience: ${sE} | Level: ${sL} `)
                }else if(args[1] == 'wolf'){
                    temp.send(`/gc ${name}\'s wolf slayer: Experience: ${wE} | Level: ${wL}`)
                }else if(args[1] == 'enderman'){
                    temp.send(`/gc ${name}\'s enderman slayer: Experience: ${eE} | Level: ${eL} `)
                }else if(args[1] == 'blaze'){
                    temp.send(`/gc ${name}\'s blaze slayer: Experience: ${bE} | Level: ${eL} `)
                }else{
                    temp.send(`/gc ${name}\'s slayer: Experience: ${total} | ${zL} ${sL} ${wL} ${eL} ${bL}`)
                }
            })
        }
    }
}

module.exports = SlayersCommand