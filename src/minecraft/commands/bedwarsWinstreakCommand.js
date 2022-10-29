const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/API/HypixelRebornAPI')
const config = require('../../../config.json')
const axios = require('axios');

class DenickerCommand extends MinecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'winstreak'
        this.aliases = ['ws']
        this.description = 'Estimated winstreaks of the specified user.'
        this.options = ['name']
        this.optionsDescription = ['Minecraft Username']
    }

    async onCommand(username, message) {
        try {
            let arg = this.getArgs(message);
            if (arg[0]) username = arg[0]
            const [player, response] = await Promise.all([
                hypixel.getPlayer(username),
                (axios.get(`${config.api.antiSniperAPI}/winstreak?key=${config.api.antiSniperKey}&name=${username}`)).data
            ])
            this.send(`/gc [${player.stats.bedwars.level}✫] ${player.nickname}: Accurrate » ${response.player.accurate ? 'Yes' : 'No'} | Overall » ${response.player.data.overall_winstreak} | Solo » ${response.player.data.eight_one_winstreak} | Doubles » ${response.player.data.eight_two_winstreak} | Trios » ${response.player.data.four_three_winstreak} | Fours » ${response.player.data.four_four_winstreak} | 4v4  » ${response.player.data.two_four_winstreak}`)
        } catch (error) {
            console.log(error)
            this.send('/gc Something went wrong..')
        }
    }
}

module.exports = DenickerCommand