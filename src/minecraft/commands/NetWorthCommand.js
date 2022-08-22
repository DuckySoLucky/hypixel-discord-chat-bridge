const MinecraftCommand = require('../../contracts/MinecraftCommand')
const { addNotation } = require('../../contracts/helperFunctions')
const { getLatestProfile } = require('../../../API/functions/getLatestProfile');
const getNetworth = require('../../../API/stats/networth')

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
        try {
            let arg = this.getArgs(message);
            if(arg[0]) username = arg[0]
            const data = await getLatestProfile(username)
            username = data.profileData?.game_mode ? `♲ ${username}` : username
            const profile = await getNetworth(data.profile, data.profileData) 
            this.send( `/gc ${username}\'s networth is ${addNotation("oneLetters", profile.total_networth) ?? 0} | Purse: ${addNotation("oneLetters", profile.purse) ?? 0} | Bank: ${addNotation("oneLetters", profile.bank) ?? 0}`)
        } catch (error) {
            this.send('/gc There is no player with the given UUID or name or the player has no Skyblock profiles')
        }
    }
}

module.exports = NetWorthCommand;
