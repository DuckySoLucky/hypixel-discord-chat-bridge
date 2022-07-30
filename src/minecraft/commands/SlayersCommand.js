// Rewrite needed

process.on('uncaughtException', function (err) {console.log(err.stack)})
const MinecraftCommand = require('../../contracts/MinecraftCommand')
const { getProfile } = require('../../contracts/API/SkyHelperAPI')
const { addCommas } = require('../../contracts/helperFunctions')

async function getSlayer(username, input) {
    try {
        const profile = await getProfile(username)
        if (profile.isIronman) username = `♲ ${username}`
        for (let i = 0; i < Object.keys(profile.slayer).length; i++) {
            for (let j = 0; j < Object.keys(profile.slayer?.[Object.keys(profile.slayer)[i]]).length; j++) {
                let total = profile.slayer?.[Object.keys(profile.slayer)[0]].xp + profile.slayer?.[Object.keys(profile.slayer)[1]].xp + profile.slayer?.[Object.keys(profile.slayer)[2]].xp + profile.slayer?.[Object.keys(profile.slayer)[3]].xp + profile.slayer?.[Object.keys(profile.slayer)[4]].xp
                if (input == 'zombie') return `${username}\'s Zombie Slayer Experience: ${addCommas(profile.slayer?.[Object.keys(profile.slayer)[0]].xp)} | Level: ${profile.slayer?.[Object.keys(profile.slayer)[0]].level} | T5 - ${profile.slayer?.[Object.keys(profile.slayer)[0]].kills?.[5]} | T4 - ${profile.slayer?.[Object.keys(profile.slayer)[0]].kills?.[4]} | T3 - ${profile.slayer?.[Object.keys(profile.slayer)[0]].kills?.[3]} | T2 - ${profile.slayer?.[Object.keys(profile.slayer)[0]].kills?.[2]} | T1 - ${profile.slayer?.[Object.keys(profile.slayer)[0]].kills?.[1]}`
                else if (input == 'spider') return `${username}\'s Spider Slayer Experience: ${addCommas(profile.slayer?.[Object.keys(profile.slayer)[1]].xp)} | Level: ${profile.slayer?.[Object.keys(profile.slayer)[1]].level} | T5 - ${profile.slayer?.[Object.keys(profile.slayer)[1]].kills?.[5]} | T4 - ${profile.slayer?.[Object.keys(profile.slayer)[1]].kills?.[4]} | T3 - ${profile.slayer?.[Object.keys(profile.slayer)[1]].kills?.[3]} | T2 - ${profile.slayer?.[Object.keys(profile.slayer)[1]].kills?.[2]} | T1 - ${profile.slayer?.[Object.keys(profile.slayer)[1]].kills?.[1]}`
                else if(input == 'wolf') return `${username}\'s Wolf Slayer Experience: ${addCommas(profile.slayer?.[Object.keys(profile.slayer)[2]].xp)} | Level: ${profile.slayer?.[Object.keys(profile.slayer)[2]].level} | T5 - ${profile.slayer?.[Object.keys(profile.slayer)[2]].kills?.[5]} | T4 - ${profile.slayer?.[Object.keys(profile.slayer)[2]].kills?.[4]} | T3 - ${profile.slayer?.[Object.keys(profile.slayer)[2]].kills?.[3]} | T2 - ${profile.slayer?.[Object.keys(profile.slayer)[2]].kills?.[2]} | T1 - ${profile.slayer?.[Object.keys(profile.slayer)[2]].kills?.[1]}`
                else if(input == 'enderman') return `${username}\'s Enderman Slayer Experience: ${addCommas(profile.slayer?.[Object.keys(profile.slayer)[3]].xp)} | Level: ${profile.slayer?.[Object.keys(profile.slayer)[3]].level} | T5 - ${profile.slayer?.[Object.keys(profile.slayer)[3]].kills?.[5]} | T4 - ${profile.slayer?.[Object.keys(profile.slayer)[3]].kills?.[4]} | T3 - ${profile.slayer?.[Object.keys(profile.slayer)[3]].kills?.[3]} | T2 - ${profile.slayer?.[Object.keys(profile.slayer)[3]].kills?.[2]} | T1 - ${profile.slayer?.[Object.keys(profile.slayer)[3]].kills?.[1]}`
                else if(input == 'blaze') return `${username}\'s Blaze Slayer Experience: ${addCommas(profile.slayer?.[Object.keys(profile.slayer)[4]].xp)} | Level: ${profile.slayer?.[Object.keys(profile.slayer)[4]].level} | T5 - ${profile.slayer?.[Object.keys(profile.slayer)[4]].kills?.[5]} | T4 - ${profile.slayer?.[Object.keys(profile.slayer)[4]].kills?.[4]} | T3 - ${profile.slayer?.[Object.keys(profile.slayer)[4]].kills?.[3]} | T2 - ${profile.slayer?.[Object.keys(profile.slayer)[4]].kills?.[2]} | T1 - ${profile.slayer?.[Object.keys(profile.slayer)[4]].kills?.[1]}`
                else return `${username}\'s Slayer Experience - ${addCommas(total)} | ${profile.slayer?.[Object.keys(profile.slayer)[0]].level} ${profile.slayer?.[Object.keys(profile.slayer)[1]].level} ${profile.slayer?.[Object.keys(profile.slayer)[2]].level} ${profile.slayer?.[Object.keys(profile.slayer)[3]].level} ${profile.slayer?.[Object.keys(profile.slayer)[4]].level}`
            }
        }
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
        this.options = ['name', 'type']
        this.optionsDescription = ['Minecraft Username', 'Type of Slayer']
    }

    async onCommand(username, message) {
        let type, msg = this.getArgs(message);
        if (msg[0]) if (msg[0].toLowerCase() == "zombie" || msg[0].toLowerCase() == "rev" || msg[0].toLowerCase() == "spider" || msg[0].toLowerCase() == "tara" || msg[0].toLowerCase() == "wolf" || msg[0].toLowerCase() == "sven"  || msg[0].toLowerCase() == "eman" || msg[0].toLowerCase() == "enderman" || msg[0].toLowerCase() == "blaze"  || msg[0].toLowerCase() == "demonlord") type = msg[0]
        else if (msg[0]) username = msg[0]; if (msg[1]) type = msg[1]

        this.send(`/gc ${await getSlayer(username, type)}`)
    }
}

module.exports = SlayersCommand
