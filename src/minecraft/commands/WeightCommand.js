const { getSenitherWeightUsername } = require('../../contracts/weight/senitherWeight')
const { getLilyWeightUsername } = require('../../contracts/weight/lilyWeight')
process.on('uncaughtException', function (err) {console.log(err.stack)})
const MinecraftCommand = require('../../contracts/MinecraftCommand')

class StatsCommand extends MinecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'weight'
        this.aliases = ['w']
        this.description = 'Skyblock Weight of specified user.'
        this.options = ['name']
        this.optionsDescription = ['Minecraft Username']
    }
    
    async onCommand(username, message) {
        let msg = this.getArgs(message);
        if(msg[0]) username = msg[0]
        const senither = await getSenitherWeightUsername(username)
        const senitherW = `Senither Weight = ${Math.round((senither.skills.weight + senither.skills.weight_overflow + senither.dungeons.weight + senither.dungeons.weight_overflow + senither.slayers.weight + senither.slayers.weight_overflow) * 100) / 100} | Skills = ${Math.round((senither.skills.weight + senither.skills.weight_overflow) * 100) / 100} | Dungeons = ${Math.round((senither.dungeons.weight + senither.dungeons.weight_overflow) * 100) / 100} | Slayer = ${Math.round((senither.slayers.weight + senither.slayers.weight_overflow) * 100) / 100}`
        this.send(`/gc ${username}\'s ${senitherW}`)
        const lily = await getLilyWeightUsername(username)
        const lilyW = `Lily Weight = ${Math.round(lily.total * 100) / 100} | Skills = ${Math.round((lily.skill.base + lily.skill.overflow) * 100) / 100} | Dungeons = ${Math.round((lily.catacombs.completion.base + lily.catacombs.completion.master + lily.catacombs.experience) * 100) / 100} | Slayer = ${Math.round(lily.slayer * 100) / 100}`
        this.send(`/gc ${username}\'s ${lilyW}`)    
    }
}

module.exports = StatsCommand