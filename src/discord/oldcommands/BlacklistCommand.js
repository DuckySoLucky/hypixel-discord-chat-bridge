const axios = require("axios");
const DiscordCommand = require('../../contracts/DiscordCommand')

const config = require("../../../config.json");
const fs = require('fs');


async function getUsernameFromUUID(uuid) {
  const { data } = await axios.get('https://sessionserver.mojang.com/session/minecraft/profile/' + uuid)
  let username = data.name
  return username
}
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
class BlacklistCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)
    this.permission = 'commander'

    this.name = 'blacklist'

    this.description = 'Blacklists user'
  }

  onCommand(message) {
    let args = this.getArgs(message)
    getUUIDFromUsername(args[1]).then(async uuid => {
      let blacklist = fs.readFileSync('./src/blacklist.txt', 'utf-8');
      let blacklistedIDs = blacklist.trim().split('\n');
      if (args[0] == "add") {
        if (!blacklist.includes(uuid)) {
          this.sendMinecraftMessage(`/oc ${args[1]} ${uuid} added to blacklist.`)
          message.channel.send({
            embeds: [{
              description: `${uuid} added to blacklist.`,
              color: 0x47F049,
              timestamp: new Date(),
              footer: {
                text: "BOT",
              },
              author: {
                name: `${args[1]}`,
                icon_url: 'https://minotar.net/helm/' + args[1]+'.png',
              },
            }],
          })
          blacklist += uuid + "\n";

          // write the updated blacklist back to the file
          fs.writeFileSync('./src/blacklist.txt', blacklist, 'utf-8');
        }
        else {
          message.channel.send({
            embeds: [{
              description: `User is already in the blacklist.`,
              color: 0x2A2A2A,
              timestamp: new Date(),
              footer: {
                text: "BOT",
              },
              author: {
                name: `${args[1]}`,
                icon_url: 'https://minotar.net/helm/' + args[1]+'.png',
              },
            }],
          })
          this.sendMinecraftMessage(`/oc ${args[1]} is already in the blacklist.`)
        }
      }
      else if (args[0] == "remove") {
        this.sendMinecraftMessage(`/oc ${args[1]} ${uuid} removed from blacklist.`)
        message.channel.send({
          embeds: [{
            description: `${uuid} removed from blacklist.`,
            color: 0xDC143C,
            timestamp: new Date(),
            footer: {
              text: "BOT",
            },
            author: {
              name: `${args[1]}`,
              icon_url: 'https://minotar.net/helm/' + args[1]+'.png',
            },
          }],
        })
        const index = blacklistedIDs.indexOf(uuid);
        if (index > -1) {
          blacklistedIDs.splice(index, 1);

          // write the updated blacklist back to the file
          blacklist = blacklistedIDs.join('\n') + '\n';
          fs.writeFileSync('./src/blacklist.txt', blacklist, 'utf-8');
        }
      }
      else if (args[0] == "check") {
        if (!blacklist.includes(uuid)) {
          this.sendMinecraftMessage(`/oc ${args[1]} is not in the blacklist.`)
          message.channel.send({
            embeds: [{
              description: `User is not in the blacklist.`,
              color: 0x2A2A2A,
              timestamp: new Date(),
              footer: {
                text: "BOT",
              },
              author: {
                name: `${args[1]}`,
                icon_url: 'https://minotar.net/helm/' + args[1]+'.png',
              },
            }],
          })
        }
        else {
          this.sendMinecraftMessage(`/oc ${args[1]} is blacklisted.`)
          message.channel.send({
            embeds: [{
              description: `User is blacklisted.`,
              color: 0x2A2A2A,
              timestamp: new Date(),
              footer: {
                text: "BOT",
              },
              author: {
                name: `${args[1]}`,
                icon_url: 'https://minotar.net/helm/' + args[1]+'.png',
              },
            }],
          })
        }
      }
      else if (args[0] == "list") {
        let blacka = blacklist.split("\n")
        let lists = []
        for (let i = 0; i < blacka.length + 1; i++) {
          if (i == blacka.length) {
            message.channel.send({
              embeds: [{
                description: "- " + lists.toString().replaceAll(",", "\n- "),
                color: 0x2A2A2A,
                timestamp: new Date(),
                footer: {
                  text: "BOT",
                },
                author: {
                  name: `The Tempest Blacklist`,
                },
              }],
            })
          }
          await new Promise(resolve => setTimeout(resolve, 500));
          getUsernameFromUUID(blacka[i]).then(ign => {
            lists.push(ign)
          })
        }
      }

    })
  }
}

module.exports = BlacklistCommand