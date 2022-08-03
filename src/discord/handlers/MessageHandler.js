const config = require('../../../config.json')

class MessageHandler {
  constructor(discord, command) {
    this.discord = discord
    this.command = command
  }

  async onMessage(message) {
    if (!this.shouldBroadcastMessage(message)) return
    
    const content = this.stripDiscordContent(message.content).trim()
    if (content.length == 0) return

    this.discord.broadcastMessage({
      member: message.member.user,
      channel: message.channel.id,
      username: message.member.displayName,
      message: this.stripDiscordContent(message.content),
      replyingTo: await this.fetchReply(message),
    })
  }

  async fetchReply(message) {
    try {
      if (!message.reference) return null

      if (config.discord.messageMode == "minecraft") {
        const [attachment] = (await (client.channels.cache.get(message.reference.channelId)).messages.fetch(message.reference.messageId)).attachments.values()
        return attachment.name.slice(0, -4)
      } else {
        const reference = await message.channel.messages.fetch(message.reference.messageId)
        return reference.member ? reference.member.displayName : reference.author.username
      }
      

    } catch (error) {
      return null
    }
  }

  stripDiscordContent(message) {
      return message.replace(/<[@|#|!|&]{1,2}(\d+){16,}>/g, '\n').replace(/<:\w+:(\d+){16,}>/g, '\n').replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, '\n').split('\n').map(part => {part = part.trim(); return part.length == 0 ? '' : part + ' '}).join('')
    }

  shouldBroadcastMessage(message) {
    return !message.author.bot && message.channel.id == config.discord.officerChannel && message.content && message.content.length > 0 || !message.author.bot && message.channel.id == config.discord.guildChatChannel && message.content && message.content.length > 0
  }
}

module.exports = MessageHandler
