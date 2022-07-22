const MinecraftCommand = require('../../contracts/MinecraftCommand')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const skyShiiyuAPI = require('../../contracts/API/SkyShiiyuAPI')
process.on('uncaughtException', function (err) {console.log(err.stack)});

async function getWeight(username) {
    const profile = await skyShiiyuAPI.getProfile(username)
    const senither = `Senither Weight = ${Math.round(profile.data.weight.senither.overall * 100) / 100} | Skills = ${Math.round(profile.data.weight.senither.skill.total * 100) / 100} | Dungeons = ${Math.round(profile.data.weight.senither.dungeon.total * 100) / 100} | Slayer = ${Math.round(profile.data.weight.senither.slayer.total * 100) / 100}`
    const lily = `Lily Weight = ${Math.round(profile.data.weight.lily.total * 100) / 100} | Skills = ${Math.round((profile.data.weight.lily.skill.base + profile.data.weight.lily.skill.overflow) * 100) / 100} | Dungeons = ${Math.round((profile.data.weight.lily.catacombs.completion.base + profile.data.weight.lily.catacombs.completion.master + profile.data.weight.lily.catacombs.experience) * 100) / 100} | Slayer = ${Math.round(profile.data.weight.lily.slayer * 100) / 100}`
    if (profile.data.profile.game_mode == 'ironman') username = `♲ ${username}`
    return [senither, lily, username]
}

class StatsCommand extends MinecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'weight'
        this.aliases = ['w']
        this.description = 'Skyblock Stats of specified user.'
    }
    
    async onCommand(username, message) {
        let msg = this.getArgs(message);
        if(msg[0]) username = msg[0]
        const response = await getWeight(username)
        this.send(`/gc ${response[2]}\'s ${response[0]}`)
        await delay(1000)
        this.send(`/gc ${response[2]}\'s ${response[1]}`)
    }
}

module.exports = StatsCommand