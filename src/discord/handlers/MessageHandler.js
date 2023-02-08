const config = require("../../../config.json");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const { generateID } = require("../../contracts/helperFunctions.js");

class MessageHandler {
  constructor(discord, command) {
    this.discord = discord;
    this.command = command;
  }

  async onMessage(message) {
    if (message.author.id === client.user.id || !this.shouldBroadcastMessage(message)) {
      return;
    }

    if (message.content.includes("<@")) {
      message.content = message.content.replace(/<@!?(\d+)>/g, (match, id) => {
        const user = client.users.cache.get(id);
        if (user) {
          return `@${user.username}`;
        }

        return match;
      });
    }

    const content = this.stripDiscordContent(message.content).trim();
    if (content.length === 0) return;

  
    const messageData = {
      member: message.member.user,
      channel: message.channel.id,
      username: message.member.displayName,
      message: content,
      replyingTo: await this.fetchReply(message)
    };

    this.discord.broadcastMessage(messageData);

    for (const attachment of message.attachments.values()) {
      await delay(1000)
      messageData.message = `${attachment.url} - ${generateID(config.minecraft.messageRepeatBypassLength)}`;
      this.discord.broadcastMessage(messageData);
    }
  }
  
  async fetchReply(message) {
    try {
      if (message.reference === undefined) return null;
      
      const reference = await message.channel.messages.fetch(message.reference.messageId);
      
      return reference.author.username;

    } catch (error) {
      return null;
    }
  }

  stripDiscordContent(message) {
    return message
      .split("\n")
      .map((part) => {
        part = part.trim();
        return part.length === 0 ? "" : part.replace(/@(everyone|here)/gi, "").trim() + " ";
      })
      .join("");
  }

  shouldBroadcastMessage(message) {
    const isValid = !message.author.bot && message.content.length > 0;

    return (isValid && (message.channel.id == config.discord.officerChannel || message.channel.id == config.discord.guildChatChannel || message.channel.id == config.console.debugChannel));
  }
}

module.exports = MessageHandler;
