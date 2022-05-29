const MinecraftCommand = require('../../contracts/MinecraftCommand')
const axios = require('axios');

process.on('uncaughtException', function (err) {
  console.log(err.stack);
});

const getSkyblock = async function (name) {
    const response = await axios.get('http://75.119.140.170:12312/v1/profiles/' + name + '?key=pele');
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
        if (msg) {
            let temp = this;
            const x = await getSkyblock(msg)
            const SA = (x.data[0].skills.farming.level + x.data[0].skills.mining.level + x.data[0].skills.combat.level + x.data[0].skills.foraging.level + x.data[0].skills.fishing.level + x.data[0].skills.enchanting.level + x.data[0].skills.alchemy.level + x.data[0].skills.taming.level) / 8
            
            this.send(`/gc ${msg}\'s Weight = ${Math.round(x.data[0].weight.total_weight * 100) / 100} ᐧᐧᐧᐧ  Skill Average = ${SA} ᐧᐧᐧᐧ Catacombs = ${x.data[0].dungeons.catacombs.skill.level}`)
        } else {
            let temp = this;
            const x = await getSkyblock(username)
            const SA = (x.data[0].skills.farming.level + x.data[0].skills.mining.level + x.data[0].skills.combat.level + x.data[0].skills.foraging.level + x.data[0].skills.fishing.level + x.data[0].skills.enchanting.level + x.data[0].skills.alchemy.level + x.data[0].skills.taming.level) / 8
            
            this.send(`/gc ${username}\'s Weight = ${Math.round(x.data[0].weight.total_weight * 100) / 100} ᐧᐧᐧᐧ  Skill Average = ${SA} ᐧᐧᐧᐧ Catacombs = ${x.data[0].dungeons.catacombs.skill.level}`)
        }
    }
}

module.exports = StatsCommand