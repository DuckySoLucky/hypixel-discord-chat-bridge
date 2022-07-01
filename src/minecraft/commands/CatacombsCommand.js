const MinecraftCommand = require('../../contracts/MinecraftCommand')
const axios = require('axios');

process.on('uncaughtException', function (err) {
  console.log(err.stack);
});

class CatacombsCommand extends MinecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'catacombs'
        this.aliases = ['cata', 'dungeons']
        this.description = 'Skyblock cata Stats of specified user.'
    }
    
    async onCommand(username, message) {
        let args = this.getArgs(message);
        let msg = args.shift();
        let temp = this;
        if (msg) {
            const response = await axios.get('http://localhost:3000/v1/profiles/' + msg + '?key=DuckySoLucky')
            .then(function (response) {
                if(response.status > 299){temp.send('/gc The provided test doesn\'t exist!')}

                const CA = (response.data.data[0].dungeons.classes.healer.level + response.data.data[0].dungeons.classes.mage.level + response.data.data[0].dungeons.classes.berserk.level + response.data.data[0].dungeons.classes.archer.level + response.data.data[0].dungeons.classes.tank.level) / 5
                temp.send(`/gc ${msg}\'s Cata: ${response.data.data[0].dungeons.catacombs.skill.level} ᐧᐧᐧᐧ Class levels:  H-${response.data.data[0].dungeons.classes.healer.level}  M-${response.data.data[0].dungeons.classes.mage.level}  B-${response.data.data[0].dungeons.classes.berserk.level}  A-${response.data.data[0].dungeons.classes.archer.level}  T-${response.data.data[0].dungeons.classes.tank.level} ᐧᐧᐧᐧ Class Average: ${CA}`)
        
            }).catch(()=>{this.send(`/gc ${username} the provided username doesn\'t exist!`)});

            
        } else {
            const response = await axios.get('http://localhost:3000/v1/profiles/' + username + '?key=DuckySoLucky')
            .then(function (response) {
                if(response.status > 299) {temp.send('/gc The provided test doesn\'t exist!')}
                
                const CA = (response.data.data[0].dungeons.classes.healer.level + response.data.data[0].dungeons.classes.mage.level + response.data.data[0].dungeons.classes.berserk.level + response.data.data[0].dungeons.classes.archer.level + response.data.data[0].dungeons.classes.tank.level) / 5
                temp.send(`/gc ${username}\'s Cata: ${response.data.data[0].dungeons.catacombs.skill.level} ᐧᐧᐧᐧ Class levels:  H-${response.data.data[0].dungeons.classes.healer.level}  M-${response.data.data[0].dungeons.classes.mage.level}  B-${response.data.data[0].dungeons.classes.berserk.level}  A-${response.data.data[0].dungeons.classes.archer.level}  T-${response.data.data[0].dungeons.classes.tank.level} ᐧᐧᐧᐧ Class Average: ${CA}`)
 
            }).catch(()=>{this.send(`/gc ${username} the provided username doesn\'t exist!`)});
        }
    }
}

module.exports = CatacombsCommand