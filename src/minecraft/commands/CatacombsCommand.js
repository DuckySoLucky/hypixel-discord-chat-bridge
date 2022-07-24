const MinecraftCommand = require('../../contracts/MinecraftCommand')
const SkyHelperAPI = require('../../contracts/API/SkyHelperAPI')
process.on('uncaughtException', function (err) {console.log(err.stack)});

async function getCatacombs(username) {
    try {
        const profile = await SkyHelperAPI.getProfile(username)
        if (profile.isIronman) username = `♲ ${username}`
        return `${username}\'s Catacombs: ${profile.dungeons.catacombs.skill.level} ᐧᐧᐧᐧ Classes:  H-${profile.dungeons.classes.healer.level}  M-${profile.dungeons.classes.mage.level}  B-${profile.dungeons.classes.berserk.level}  A-${profile.dungeons.classes.archer.level}  T-${profile.dungeons.classes.tank.level} ᐧᐧᐧᐧ Class Average: ${((profile.dungeons.classes.healer.level + profile.dungeons.classes.mage.level + profile.dungeons.classes.berserk.level + profile.dungeons.classes.archer.level + profile.dungeons.classes.tank.level) / 5)}`
    }
    catch (error) {
        return error.toString().replaceAll('Request failed with status code 404', 'There is no player with the given UUID or name or the player has no Skyblock profiles').replaceAll('Request failed with status code 500', 'There is no player with the given UUID or name or the player has no Skyblock profiles')
    }
}

class CatacombsCommand extends MinecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'catacombs'
        this.aliases = ['cata', 'dungeons']
        this.description = 'Skyblock Dungeons Stats of specified user.'
        this.options = ['name']
        this.optionsDescription = ['Minecraft Username']
    }
    
    async onCommand(username, message) {
        let msg = this.getArgs(message);
        if(msg[0]) username = msg[0]
        this.send(`/gc ${await getCatacombs(username)}`)
    }
}

module.exports = CatacombsCommand
