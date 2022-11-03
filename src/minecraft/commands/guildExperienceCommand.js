const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/API/HypixelRebornAPI')
const config = require('../../../config.json')
const { addCommas } = require('../../contracts/helperFunctions')

class guildExperienceCommand extends MinecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'guildexp'
        this.aliases = ['gexp', 'gxp']
        this.description = "Guilds experience of specified user."
        this.options = ['name']
    }

    onCommand(username, message) {
        const arg = this.getArgs(message);
        if (arg[0]) username = arg[0]

        try {
            const [player, guild] = Promise.all([
                hypixel.getPlayer(username),
                hypixel.getGuild("id", config.minecraft.guildID)
            ])

            for (const member of guild.members) {
                if (member.uuid != player.uuid) continue;

                if (guild.members.indexOf(member) == guild.members.length - 1) return this.send(`/gc ${username} is not in the Guild.`)

                return this.send(`/gc ${username == arg[0] ? `${arg[0]}'s` : `Your`} Weekly Guild Experience » ${addCommas(member.weeklyExperience)}.`)
            }
        } catch (error) {
            console.log(error)
            this.send('There is no player with the given UUID or name or player has never joined Hypixel.')
        }
    }
}

module.exports = guildExperienceCommand;
