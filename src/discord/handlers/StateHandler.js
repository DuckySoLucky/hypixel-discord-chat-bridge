const config = require('../../../config.json')
const Logger = require('../../Logger')

class StateHandler {
  constructor(discord) {
    this.discord = discord
  }

  async onReady() {
    Logger.discordMessage('Client ready, logged in as ' + this.discord.client.user.tag)
    this.discord.client.user.setActivity('Guild Chat', { type: 'WATCHING' })

    const channel = await getChannel('Guild')
    channel.send({
      embeds: [{
        author: { name: `Chat Bridge is Online` },
        color: '47F049'
      }]
    })
  }

  async onClose() {
    const channel = await getChannel('Guild')
    channel.send({
      embeds: [{
        author: { name: `Chat Bridge is Offline` },
        color: 'F04947'
      }]
    })
  }
}

async function getChannel(type) {
  if (type == 'Officer') {
    return client.channels.fetch(config.discord.officerChannel)
  }
  else if (type == 'Logger') {
    return client.channels.fetch(config.discord.loggingChannel)
  } else {
    return client.channels.fetch(config.discord.guildChatChannel)
  }
}

module.exports = StateHandler
