const { demojify } = require("discord-emoji-converter");
const config = require("../../../config.json");
const { ImgurClient } = require("imgur");
const imgurClient = new ImgurClient({
  clientId: config.minecraft.API.imgurAPIkey,
});

class MessageHandler {
  constructor(discord, command) {
    this.discord = discord;
    this.command = command;
  }

  async onMessage(message) {
    if (
      message.author.id === client.user.id ||
      !this.shouldBroadcastMessage(message)
    ) {
      return;
    }

    const content = this.stripDiscordContent(message).trim();
    if (content.length === 0) return;

    const messageData = {
      member: message.member.user,
      channel: message.channel.id,
      username: message.member.displayName,
      message: content,
      replyingTo: await this.fetchReply(message),
    };

    this.discord.broadcastMessage(messageData);

    // handle images
    const images = content.split(" ").filter((line) => line.startsWith("http"));
    for (const attachment of message.attachments.values()) {
      images.push(attachment.url);
    }

    if (images.length === 0) return;
    
    for (const attachment of images) {
      const imgurLink = await imgurClient.upload({
        image: attachment,
        type: "url",
      });

      if (imgurLink.success === false) continue;

      messageData.message = messageData.message.replace(
        attachment,
        imgurLink.data.link
      );

      if (messageData.message.includes(imgurLink.data.link) === false) {
        messageData.message += ` ${imgurLink.data.link}`;
      }
    }

    if (messageData.message.length === 0) return;

    this.discord.broadcastMessage(messageData);
  }

  async fetchReply(message) {
    try {
      if (message.reference === undefined) return null;

      const reference = await message.channel.messages.fetch(
        message.reference.messageId
      );

      const mentionedUserName = message?.mentions?.repliedUser?.username;
      if (config.discord.other.messageMode === "bot") {
        const embedAuthorName = reference?.embeds?.[0]?.author?.name;

        return embedAuthorName ?? mentionedUserName;
      }

      if (config.discord.other.messageMode === "minecraft") {
        const attachmentName = reference?.attachments?.values()?.next()
          ?.value?.name;

        return attachmentName
          ? attachmentName.split(".")[0]
          : mentionedUserName;
      }

      if (config.discord.other.messageMode === "webhook") {
        return reference.author.username ?? mentionedUserName;
      }
    } catch (error) {
      return null;
    }
  }

  stripDiscordContent(message) {
    let output = message.content
      .split("\n")
      .map((part) => {
        part = part.trim();
        return part.length === 0
          ? ""
          : part.replace(/@(everyone|here)/gi, "").trim() + " ";
      })
      .join("");

    const hasMentions = /<@|<#|<:|<a:/.test(message);
    if (hasMentions) {
      // Replace <@486155512568741900> with @DuckySoLucky
      const userMentionPattern = /<@(\d+)>/g;
      const replaceUserMention = (match, mentionedUserId) => {
        const mentionedUser = message.guild.members.cache.get(mentionedUserId);

        return `@${mentionedUser.displayName}`;
      };
      output = output.replace(userMentionPattern, replaceUserMention);

      // Replace <#1072863636596465726> with #💬・guild-chat
      const channelMentionPattern = /<#(\d+)>/g;
      const replaceChannelMention = (match, mentionedChannelId) => {
        const mentionedChannel =
          message.guild.channels.cache.get(mentionedChannelId);

        return `#${mentionedChannel.name}`;
      };
      output = output.replace(channelMentionPattern, replaceChannelMention);

      // Replace <:KEKW:628249422253391902> with :KEKW: || Replace <a:KEKW:628249422253391902> with :KEKW:
      const emojiMentionPattern = /<a?:(\w+):\d+>/g;
      output = output.replace(emojiMentionPattern, ":$1:");
    }

    // ? demojify() function has a bug. It throws an error when it encounters channel with emoji in its name. Example: #💬・guild-chat
    try {
      return demojify(output);
    } catch (e) {
      return output;
    }
  }

  shouldBroadcastMessage(message) {
    const isValid = !message.author.bot && message.content.length > 0;
    const validChannelIds = [
      config.discord.channels.officerChannel,
      config.discord.channels.guildChatChannel,
      config.discord.channels.debugChannel,
    ];

    return isValid && validChannelIds.includes(message.channel.id);
  }
}

module.exports = MessageHandler;
