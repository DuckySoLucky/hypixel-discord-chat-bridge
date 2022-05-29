const DiscordCommand = require('../../contracts/DiscordCommand')
const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/Hypixel')

class ListCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)

    this.name = 'online'
    this.aliases = []
    this.description = 'List of online members.'
  }

  onCommand(message) {
    let temp = this;
    hypixel.getGuild('name', 'WristSpasm').catch(console.error)
      .then(async (guild) => {
        message.reply(`Looping through API. This will take some time...`)
        let guildMembers = [];
        for (let member of guild.members) {
          guildMembers.push(await hypixel.getPlayer(member?.uuid).catch(console.error));
        }
        let onlineGuildMembers = [];
        for (let element of guildMembers) {
          if (element)
            if (element?.isOnline)
              onlineGuildMembers.push(element?.nickname)
        }
        message.reply(`Online users: \`${onlineGuildMembers}\``)
      })
      .catch(err => {
        console.error(err);
      })
  }
}

module.exports = ListCommand

