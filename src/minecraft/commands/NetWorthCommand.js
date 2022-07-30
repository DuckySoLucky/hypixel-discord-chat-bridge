process.on('uncaughtException', function (err) {console.log(err.stack)})
const MinecraftCommand = require('../../contracts/MinecraftCommand')
const { addNotation } = require('../../contracts/helperFunctions')
const SkyHelperAPI = require('../../contracts/API/SkyHelperAPI')

async function getNetworth(username) {
    try {
        const profile = await SkyHelperAPI.getProfile(username)
        if (profile.isIronman) username = `♲ ${username}`
        return `${username}\'s networth is ${addNotation("oneLetters", profile.networth.total_networth)}`
    }
    catch (error) {
        return error.toString().replaceAll('Request failed with status code 404', 'There is no player with the given UUID or name or the player has no Skyblock profiles').replaceAll('Request failed with status code 500', 'There is no player with the given UUID or name or the player has no Skyblock profiles').replaceAll(`TypeError: Cannot read properties of undefined (reading 'status')`, 'There is no player with the given UUID or name or the player has no Skyblock profiles')
    }
}

class NetWorthCommand extends MinecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'networth'
        this.aliases = ["nw"]
        this.description = 'Networth of specified user.'
        this.options = ['name']
        this.optionsDescription = ['Minecraft Username']
    }

    async onCommand(username, message) {
        let arg = this.getArgs(message);
        if(arg[0]) username = arg[0]
        this.send(`/gc ${await getNetworth(username)}`)
    }
}

module.exports = NetWorthCommand;
