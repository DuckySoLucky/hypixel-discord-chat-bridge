process.on('uncaughtException', function (err) {console.log(err.stack)})
const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/API/HypixelRebornAPI')
const config = require('../../../config.json')

class guildExperienceCommand extends MinecraftCommand {
        constructor(minecraft) {
        super(minecraft)

        this.name = 'guildexp'
        this.aliases = ['gexp']
        this.description = "Guilds experience of specified user."
        this.options = ['name']
    }

    onCommand(username, message) {
        let arg = this.getArgs(message), found = false;
        if (arg[0]) username = arg[0]
        hypixel.getPlayer(username).then(player => {
            hypixel.getGuild("id", config.minecraft.guildID).then(guild => {
                for (var i = 0; i < guild.members.length; i++) {
                    if (guild.members[i].uuid === player.uuid) {
                        found = true;
                        break;
                    }
                }
                if (found == false || found == undefined) {
                    this.send(`/gc ${username} is not in the Guild.`)
                    return;
                }

                if (guild.members[i].weeklyExperience < config.minecraft.guildExp) {
                    this.send(`/gc You are missing ${config.minecraft.guildExp-guild.members[i].weeklyExperience} Guild Experience.`)
                }else {
                    this.send('/gc You have enough guild experience.')
                }
                
            });
        }).catch(err => {console.log(err)});
    }    
}

module.exports = guildExperienceCommand;