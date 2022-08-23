const config = require('../../../config.json')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const { generateID } = require('../../contracts/helperFunctions')

class MessageHandler {
  constructor(discord, command) {
    this.discord = discord
    this.command = command
  }

  async onMessage(message) {
    if (message.author.id == config.discord.clientID) return
    if (!this.shouldBroadcastMessage(message)) return
    
    const [attachments] = message.attachments.values();
    const url = attachments ? attachments.url : null;
    
    const content = this.stripDiscordContent(message.content).trim()
    if (content.length == 0) return

    this.discord.broadcastMessage({
      member: message.member.user,
      channel: message.channel.id,
      username: message.member.displayName,
      message: this.stripDiscordContent(message.content),
      replyingTo: await this.fetchReply(message),
    })
    if (!url) return
    await delay (100)
    this.discord.broadcastMessage({
      member: message.member.user,
      channel: message.channel.id,
      username: message.member.displayName,
      message: `${url} - ${generateID(config.minecraft.messageRepeatBypassLength)}`,
      replyingTo: await this.fetchReply(message),
    })
  }

  async fetchReply(message) {
    try {
      if (!message.reference) return null
      const [attachment] = (await (client.channels.cache.get(message.reference.channelId)).messages.fetch(message.reference.messageId)).attachments.values() ?? null
      const reference = await message.channel.messages.fetch(message.reference.messageId) ?? null
      if (config.discord.messageMode == "minecraft") {
        return attachment?.name.slice(0, -4) ?? reference.member.displayName ?? reference.author.username
      } else {
        return reference.member ? reference.member.displayName : reference.author.username
      }
    } catch (error) {
      return null
    }
  }

  stripDiscordContent(message) {
    return message.split('\n').map(part => {
      part = part.trim();
      return part.length == 0 ? '' : part + ' '
    }).join('')
  }

  shouldBroadcastMessage(message) {
    return !message.author.bot && message.channel.id == config.discord.officerChannel && message.content && message.content.length > 0 || !message.author.bot && message.channel.id == config.discord.guildChatChannel && message.content && message.content.length > 0
  }
}

module.exports = MessageHandler
