const { uploadImage } = require("../../contracts/API/imgurAPI.js");
const { demojify } = require("discord-emoji-converter");
const config = require("../../../config.json");

class MessageHandler {
  constructor(discord, command) {
    this.discord = discord;
    this.command = command;
  }

  async onMessage(message) {
    try {
      if (message.author.id === client.user.id || !this.shouldBroadcastMessage(message)) {
        return;
      }

      const content = this.stripDiscordContent(message).trim();
      if (content.length === 0 && message.attachments.size === 0) {
        return;
      }

      const username = message.member.displayName ?? message.author.username;
      if (username === undefined || username.length === 0) {
        return;
      }

      const formattedUsername = this.formatEmojis(username);

      const messageData = {
        member: message.member.user,
        channel: message.channel.id,
        username: formattedUsername.replaceAll(" ", ""),
        message: content,
        replyingTo: await this.fetchReply(message),
        discord: message,
      };

      const images = content.split(" ").filter((line) => line.startsWith("http"));
      for (const attachment of message.attachments.values()) {
        images.push(attachment.url);
      }

      if (images.length > 0) {
        for (const attachment of images) {
          try {
            const imgurLink = await uploadImage(attachment);

            messageData.message = messageData.message.replace(attachment, imgurLink.data.link);

            if (messageData.message.includes(imgurLink.data.link) === false) {
              messageData.message += ` ${imgurLink.data.link}`;
            }
          } catch (error) {
            messageData.message += ` ${attachment}`;
          }
        }
      }

      if (messageData.message.length === 0) {
        return;
      }
      
      this.discord.broadcastMessage(messageData);
    } catch (error) {
      console.log(error);
    }
  }

  async fetchReply(message) {
    try {
      if (message.reference?.messageId === undefined || message.mentions === undefined) {
        return null;
      }

      const reference = await message.channel.messages.fetch(message.reference.messageId);

      const mentionedUserName = message.mentions.repliedUser.globalName ?? message.mentions.repliedUser.username;

      if (config.discord.other.messageMode === "bot" && reference.embed !== null) {
        const name = reference.embeds[0]?.author?.name;
        if (name === undefined) {
          return mentionedUserName;
        }

        return name;
      }

      if (config.discord.other.messageMode === "minecraft" && reference.attachments !== null) {
        const name = reference.attachments.values()?.next()?.value?.name;
        if (name === undefined) {
          return mentionedUserName;
        }

        return name.split(".")[0];
      }

      if (config.discord.other.messageMode === "webhook") {
        if (reference.author.username === undefined) {
          return mentionedUserName;
        }

        return reference.author.username;
      }

      return mentionedUserName ?? null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  stripDiscordContent(message) {
    let output = message.content
      .split("\n")
      .map((part) => {
        part = part.trim();
        return part.length === 0 ? "" : part.replace(/@(everyone|here)/gi, "").trim() + " ";
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
        const mentionedChannel = message.guild.channels.cache.get(mentionedChannelId);

        return `#${mentionedChannel.name}`;
      };
      output = output.replace(channelMentionPattern, replaceChannelMention);

      // Replace <:KEKW:628249422253391902> with :KEKW: || Replace <a:KEKW:628249422253391902> with :KEKW:
      const emojiMentionPattern = /<a?:(\w+):\d+>/g;
      output = output.replace(emojiMentionPattern, ":$1:");
    }

    // Replace IP Adresses with [IP Address Removed]
    const IPAddressPattern = /(?:\d{1,3}\s*\s\s*){3}\d{1,3}/g;
    output = output.replaceAll(IPAddressPattern, "[IP Address Removed]");

    return this.formatEmojis(output);
  }

  shouldBroadcastMessage(message) {
    const isBot =
      message.author.bot && config.discord.channels.allowedBots.includes(message.author.id) === false ? true : false;
    const isValid = !isBot && (message.content.length > 0 || message.attachments.size > 0);
    const validChannelIds = [
      config.discord.channels.officerChannel,
      config.discord.channels.guildChatChannel,
      config.discord.channels.debugChannel,
    ];

    return isValid && validChannelIds.includes(message.channel.id);
  }

  formatEmojis(content) {
    // ? demojify() function has a bug. It throws an error when it encounters channel with emoji in its name. Example: #💬・guild-chat
    try {
      return demojify(content);
    } catch (e) {
      return content;
    }
  }
}

module.exports = MessageHandler;
