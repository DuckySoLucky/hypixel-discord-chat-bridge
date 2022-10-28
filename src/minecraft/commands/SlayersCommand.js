const MinecraftCommand = require('../../contracts/MinecraftCommand')
const { getLatestProfile } = require('../../../API/functions/getLatestProfile');
const getSlayer = require('../../../API/stats/slayer');
const { addCommas } = require('../../contracts/helperFunctions')

async function getSlayerData(username, input) {
    try {
        const data = await getLatestProfile(username)
        username = data.profileData?.game_mode ? `♲ ${username}` : username
        const profile = getSlayer(data.profile) 
        for (let i = 0; i < Object.keys(profile).length; i++) {
            for (let j = 0; j < Object.keys(profile?.[Object.keys(profile)[i]]).length; j++) {
                let total = profile?.[Object.keys(profile)[0]].xp + profile?.[Object.keys(profile)[1]].xp + profile?.[Object.keys(profile)[2]].xp + profile?.[Object.keys(profile)[3]].xp + profile?.[Object.keys(profile)[4]].xp
                if (input == 'zombie') return `${username}'s Zombie Slayer Experience: ${addCommas(profile?.[Object.keys(profile)[0]].xp)} | Level: ${profile?.[Object.keys(profile)[0]].level} | T5 - ${profile?.[Object.keys(profile)[0]].kills?.[5]} | T4 - ${profile?.[Object.keys(profile)[0]].kills?.[4]} | T3 - ${profile?.[Object.keys(profile)[0]].kills?.[3]} | T2 - ${profile?.[Object.keys(profile)[0]].kills?.[2]} | T1 - ${profile?.[Object.keys(profile)[0]].kills?.[1]}`
                else if (input == 'spider') return `${username}'s Spider Slayer Experience: ${addCommas(profile?.[Object.keys(profile)[1]].xp)} | Level: ${profile?.[Object.keys(profile)[1]].level} | T5 - ${profile?.[Object.keys(profile)[1]].kills?.[5]} | T4 - ${profile?.[Object.keys(profile)[1]].kills?.[4]} | T3 - ${profile?.[Object.keys(profile)[1]].kills?.[3]} | T2 - ${profile?.[Object.keys(profile)[1]].kills?.[2]} | T1 - ${profile?.[Object.keys(profile)[1]].kills?.[1]}`
                else if(input == 'wolf') return `${username}'s Wolf Slayer Experience: ${addCommas(profile?.[Object.keys(profile)[2]].xp)} | Level: ${profile?.[Object.keys(profile)[2]].level} | T5 - ${profile?.[Object.keys(profile)[2]].kills?.[5]} | T4 - ${profile?.[Object.keys(profile)[2]].kills?.[4]} | T3 - ${profile?.[Object.keys(profile)[2]].kills?.[3]} | T2 - ${profile?.[Object.keys(profile)[2]].kills?.[2]} | T1 - ${profile?.[Object.keys(profile)[2]].kills?.[1]}`
                else if(input == 'enderman') return `${username}'s Enderman Slayer Experience: ${addCommas(profile?.[Object.keys(profile)[3]].xp)} | Level: ${profile?.[Object.keys(profile)[3]].level} | T5 - ${profile?.[Object.keys(profile)[3]].kills?.[5]} | T4 - ${profile?.[Object.keys(profile)[3]].kills?.[4]} | T3 - ${profile?.[Object.keys(profile)[3]].kills?.[3]} | T2 - ${profile?.[Object.keys(profile)[3]].kills?.[2]} | T1 - ${profile?.[Object.keys(profile)[3]].kills?.[1]}`
                else if(input == 'blaze') return `${username}'s Blaze Slayer Experience: ${addCommas(profile?.[Object.keys(profile)[4]].xp)} | Level: ${profile?.[Object.keys(profile)[4]].level} | T5 - ${profile?.[Object.keys(profile)[4]].kills?.[5]} | T4 - ${profile?.[Object.keys(profile)[4]].kills?.[4]} | T3 - ${profile?.[Object.keys(profile)[4]].kills?.[3]} | T2 - ${profile?.[Object.keys(profile)[4]].kills?.[2]} | T1 - ${profile?.[Object.keys(profile)[4]].kills?.[1]}`
                else return `${username}'s Slayer Experience - ${addCommas(total)} | ${profile?.[Object.keys(profile)[0]].level} ${profile?.[Object.keys(profile)[1]].level} ${profile?.[Object.keys(profile)[2]].level} ${profile?.[Object.keys(profile)[3]].level} ${profile?.[Object.keys(profile)[4]].level}`
            }
        }
    }
    catch (error) {
        console.log(error)
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
        try {
            let type, msg = this.getArgs(message);
            if (msg[0]) if (msg[0].toLowerCase() == "zombie" || msg[0].toLowerCase() == "rev" || msg[0].toLowerCase() == "spider" || msg[0].toLowerCase() == "tara" || msg[0].toLowerCase() == "wolf" || msg[0].toLowerCase() == "sven"  || msg[0].toLowerCase() == "eman" || msg[0].toLowerCase() == "enderman" || msg[0].toLowerCase() == "blaze"  || msg[0].toLowerCase() == "demonlord") type = msg[0]
            else if (msg[0]) username = msg[0]; if (msg[1]) type = msg[1]
            this.send(`/gc ${await getSlayerData(username, type)}`)
        } catch (error) {
            console.log(error)
            this.send('/gc There is no player with the given UUID or name or the player has no Skyblock profiles')
        }
    }
}

module.exports = SlayersCommand
