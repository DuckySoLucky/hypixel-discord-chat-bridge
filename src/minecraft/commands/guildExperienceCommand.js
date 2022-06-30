const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/Hypixel')
const config = require('../../../config.json')

process.on('uncaughtException', function (err) {
  console.log(err.stack);
});

class guildExperienceCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'guildexp'
    this.aliases = ['gexp', 'exp']
    this.description = "Check if you meet guild experience requirements."
  }

    onCommand(username, message) {
        let args = this.getArgs(message)
        let ign = args.shift();
        let temp = this;
        let found = false;
        if (ign == undefined) {
            hypixel.getPlayer(username).then(player => {
                hypixel.getGuild("id", config.minecraft.guildID).then(guild => {
                    for (var i = 0; i < guild.members.length; i++) {
                        if (guild.members[i].uuid === player.uuid) {
                            found = true;
                            break;
                        }
                    }
                    if (found == false || found == undefined) {
                        temp.send(`/gc Something went wrong or You are not in a guild (DM DuckySoLucky#5181).`)
                        return;
                    }

                    if (guild.members[i].weeklyExperience < config.minecraft.guildExp) {
                        temp.send(`/gc You are missing ${config.minecraft.guildExp-guild.members[i].weeklyExperience} Guild Experience.`)
                    }else {
                        temp.send('/gc You have enough guild experience.')
                    }
                    
                });
            }).catch(err => {console.log(err)});

        } else {
            hypixel.getPlayer(ign).then(player => {
                hypixel.getGuild("id", config.minecraft.guildID).then(guild => {
                    for (var i = 0; i < guild.members.length; i++) {
                        if (guild.members[i].uuid === player.uuid) {
                            found = true;
                            break;
                        }
                    }
                    if (found == false || found == undefined) {
                        temp.send(`/gc Something went wrong or ${ign} is not in a guild.`)
                        return;
                    }

                    if (guild.members[i].weeklyExperience < config.minecraft.guildExp) {
                        temp.send(`/gc ${ign} is missing ${config.minecraft.guildExp-guild.members[i].weeklyExperience} Guild Experience.`)
                    }else {
                        temp.send(`/gc ${ign} has collected enough guild experience.`)
                    }
                    
                });
            }).catch(err => {console.log(err)});
        }
    }    
}

module.exports = guildExperienceCommand;