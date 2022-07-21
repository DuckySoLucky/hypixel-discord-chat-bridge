const MinecraftCommand = require('../../contracts/MinecraftCommand')
const skyShiiyuAPI = require('../../contracts/API/SkyShiiyuAPI')
process.on('uncaughtException', function (err) {console.log(err.stack)});

async function getSlayer(username, input) {
    try {
        const profile = await skyShiiyuAPI.getSlayer(username)
        if (profile.isIronman) username = `♲ ${username}`
        let zL = profile.slayers.zombie.level.currentLevel
        let sL = profile.slayers.spider.level.currentLevel
        let wL = profile.slayers.wolf.level.currentLevel
        let eL = profile.slayers.enderman.level.currentLevel
        let bL= profile.slayers.blaze.level.currentLevel
        let zE = profile.slayers.zombie.xp
        let sE = profile.slayers.spider.xp
        let wE = profile.slayers.wolf.xp
        let eE = profile.slayers.enderman.xp
        let bE = profile.slayers.blaze.xp
        total = zE + sE + wE + eE + bE
        if(input == 'zombie') return `${username}\'s Zombie Slayer Experience: ${zE} | Level: ${zL}`
        else if (input == 'spider') return `${username}\'s Spider Slayer Experience: ${sE} | Level: ${sL} `
        else if(input == 'wolf') return `${username}\'s Wolf Slayer Experience: ${wE} | Level: ${wL}`
        else if(input == 'enderman') return `${username}\'s Enderman Slayer Experience: ${eE} | Level: ${eL} `
        else if(input == 'blaze') return `${username}\'s Blaze Slayer Experience: ${bE} | Level: ${eL} `
        else return `${username}\'s Slayer Experience - ${total} | ${zL} ${sL} ${wL} ${eL} ${bL}`
    }
    catch (error) {
        return error.toString().replaceAll('Request failed with status code 404', 'There is no player with the given UUID or name or the player has no Skyblock profiles').replaceAll('Request failed with status code 500', 'There is no player with the given UUID or name or the player has no Skyblock profiles')
    }
}

class SlayersCommand extends MinecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'slayer'
        this.aliases = ['slayers']
        this.description = 'Slayer of specified user.'
    }

    async onCommand(username, message) {
        let arg = this.getArgs(message);
        if (arg[0]) {
            this.send(`/gc ${await getSlayer(arg[0], arg[1])}`)
        }else{
            this.send(`/gc ${await getSlayer(username, arg[1])}`)
        }
    }
}

module.exports = SlayersCommand