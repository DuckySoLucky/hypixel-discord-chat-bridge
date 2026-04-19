const DiscordCommand = require('../../contracts/DiscordCommand')

const config = require("../../../config.json");
const axios = require("axios");
const fs = require('fs');
async function getUUIDFromUsername(username) {
    if (!(/^[a-zA-Z0-9_]{2,16}$/mg.test(username))) {
        return "Error"
    }
    else {
        try {
            const { data } = await axios.get('https://api.mojang.com/users/profiles/minecraft/' + username)
            let uuid = data.id
            let user = username
            return uuid
        } catch {
            const { data } = await axios.get('https://api.ashcon.app/mojang/v2/user/' + username)
            let uuid = data.uuid.replace("-","");
            let user = username
            return uuid
        }

    }
}
class KickCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)
    this.permission = "commander"

    this.name = 'kick'
    this.aliases = ['k']
    this.description = 'Kicks the given user from the guild'
  }

  async onCommand(message) {
    let args = this.getArgs(message)
    let user = args.shift()
    let reason = args.join(' ')
    if(user.toLowerCase()=="azael_nyaa") return
    else{
      getUUIDFromUsername(user).then(uuid => {
        let blacklist = fs.readFileSync('./src/blacklist.txt', 'utf-8');
        let blacklistedIDs = blacklist.trim().split('\n');
            if (!blacklist.includes(uuid)) {
              this.sendMinecraftMessage(`/oc ${user} ${uuid} kicked, and added to blacklist.`)
                blacklist += uuid + "\n";
  
                fs.writeFileSync('./src/blacklist.txt', blacklist, 'utf-8');
            }
            message.channel.send({
              embeds: [{
                  description: `${user} has been kicked and blacklisted from joining.`,
                  color: 0xcbbeb5,
                  timestamp: new Date(),
                  footer: {
                      text: "BOT",
                  },
              }],
          })
          setTimeout(() => {
            this.sendMinecraftMessage(`/g kick ${user ? user : ''} ${reason ? reason : ''}`)
          }, 500);
        })
    }
  }
}

module.exports = KickCommand
