const { getLatestProfile } = require('../../../API/functions/getLatestProfile');
const { addNotation, capitalize } = require('../../contracts/helperFunctions')
const MinecraftCommand = require('../../contracts/MinecraftCommand')
const { getNetworth, getPrices } = require('skyhelper-networth');

let prices;
getPrices().then((data) => { 
    prices = data
})

setInterval(async () => {
  prices = await getPrices();
}, 1000 * 60 * 5); 

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
            if (!prices) return this.send(`/gc ${username} Prices are still loading, please try again in a few seconds.`)
            
            const data = await getLatestProfile(username)
            username = data.profileData?.game_mode ? `♲ ${username}` : username

            const profile = await getNetworth(data.profile, data.profileData?.banking?.balance, { prices });
            if (profile.noInventory) return this.send(`/gc ${capitalize(username)} has an Inventory API off!`)
            this.send( `/gc ${capitalize(username)}'s Networth is ${addNotation("oneLetters", profile.networth) ?? 0} | Unsoulbound Networth: ${addNotation("oneLetters", profile.unsoulboundNetworth) ?? 0} | Purse: ${addNotation("oneLetters", profile.purse) ?? 0} | Bank: ${addNotation("oneLetters", profile.bank) ?? 0}`)
        } catch (error) {
            console.log(error)
            this.send('/gc There is no player with the given UUID or name or the player has no Skyblock profiles')
        }
    }
}

module.exports = NetWorthCommand;
