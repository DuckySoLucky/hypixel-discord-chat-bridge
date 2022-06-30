const MinecraftCommand = require('../../contracts/MinecraftCommand')
const axios = require('axios');

process.on('uncaughtException', function (err) {
  console.log(err.stack);
});

const getSkyblock = async function (name) {
    const response = await axios.get('http://pelepuric.ddns.net:3000/v1/profiles/' + name + '?key=pele');
    return response.data;
};

class StatsCommand extends MinecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'stats'
        this.aliases = ['weight']
        this.description = 'Skyblock Stats of specified user.'
    }
    
    async onCommand(username, message) {
        let args = this.getArgs(message);
        let msg = args.shift();
        let temp = this;
        if (msg) {
            const response = await axios.get('http://pelepuric.ddns.net:3000/v1/profiles/' + msg + '?key=pele')
            .then(function (response) {
                if(response.status > 299){temp.send('/gc The provided test doesn\'t exist!')}

                const SA = (response.data.data[0].skills.farming.level + response.data.data[0].skills.mining.level + response.data.data[0].skills.combat.level + response.data.data[0].skills.foraging.level + response.data.data[0].skills.fishing.level + response.data.data[0].skills.enchanting.level + response.data.data[0].skills.alchemy.level + response.data.data[0].skills.taming.level) / 8
                temp.send(`/gc ${msg}\'s Weight = ${Math.round(response.data.data[0].weight.total_weight * 100) / 100} ᐧᐧᐧᐧ  Skill Average = ${SA} ᐧᐧᐧᐧ Catacombs = ${response.data.data[0].dungeons.catacombs.skill.level}`)
        
            }).catch(()=>{this.send(`/gc ${username} the provided username doesn\'t exist!`)});

            
        } else {
            const response = await axios.get('http://pelepuric.ddns.net:3000/v1/profiles/' + username + '?key=pele')
            .then(function (response) {
                if(response.status > 299) {temp.send('/gc The provided test doesn\'t exist!')}
                
                const SA = (response.data.data[0].skills.farming.level + response.data.data[0].skills.mining.level + response.data.data[0].skills.combat.level + response.data.data[0].skills.foraging.level + response.data.data[0].skills.fishing.level + response.data.data[0].skills.enchanting.level + response.data.data[0].skills.alchemy.level + response.data.data[0].skills.taming.level) / 8
                temp.send(`/gc ${username}\'s Weight = ${Math.round(response.data.data[0].weight.total_weight * 100) / 100} ᐧᐧᐧᐧ  Skill Average = ${SA} ᐧᐧᐧᐧ Catacombs = ${response.data.data[0].dungeons.catacombs.skill.level}`)
 
            }).catch(()=>{this.send(`/gc ${username} the provided username doesn\'t exist!`)});
        }
    }
}

module.exports = StatsCommand