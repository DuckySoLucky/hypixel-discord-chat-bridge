const config = require("../../../config.json");
const { unemojify } = require("node-emoji");

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

      const discordUser = await message.guild.members.fetch(message.author.id);
      const memberRoles = discordUser.roles.cache.map((role) => role.id);
      if (memberRoles.some((role) => config.discord.commands.blacklistRoles.includes(role))) {
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

      const formattedUsername = unemojify(username);

      const messageData = {
        member: message.member.user,
        channel: message.channel.id,
        username: formattedUsername.replaceAll(" ", ""),
        message: content,
        replyingTo: await this.fetchReply(message),
        discord: message
      };

      if (messageData.message.length === 0) {
        return;
      }

      if (messageData.message.length > 220) {
        const messageParts = messageData.message.match(/.{1,200}/g);
        if (messageParts === null) {
          return;
        }

        for (const part of messageParts) {
          messageData.message = part;
          this.discord.broadcastMessage(messageData);
          await new Promise((resolve) => setTimeout(resolve, 1000));

          if (messageParts.indexOf(part) >= 3) {
            messageData.message = "Message too long. Truncated.";
            this.discord.broadcastMessage(messageData);
            return;
          }
        }

        return;
      }

      this.discord.broadcastMessage(messageData);
    } catch (error) {
      console.error(error);
    }
  }

  async fetchReply(message) {
    try {
      if (message.reference?.messageId === undefined || message.mentions === undefined) {
        return null;
      }

      const reference = await message.channel.messages.fetch(message.reference.messageId);

      const discUser = await message.guild.members.fetch(message.mentions.repliedUser.id);
      const mentionedUserName = discUser.nickname ?? message.mentions.repliedUser.globalName;

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
      console.error(error);
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

    if (message.stickers.size > 0) {
      const sticker = message.stickers.first();
      output = output ? `[${sticker.name}] ${output}` : `[${sticker.name}]`;
    }

    if (message.attachments.size > 0) {
      const attachments = [...message.attachments.values()]
        .map((attachment) => {
          const dot = attachment.name.lastIndexOf(".");
          const clean = (dot !== -1 ? attachment.name.slice(0, dot) : attachment.name).replace(/\./g, "_");
          return `[${clean}]`;
        })
        .join(" ");

      output = output ? `${attachments} ${output}` : attachments;
    }

    // Replace IP Adresses with [Content Redacted]
    const IPAddressPattern = /(?:\d{1,3}\s*\s\s*){3}\d{1,3}/g;
    output = output.replaceAll(IPAddressPattern, "[Content Redacted]");

    output = unemojify(output);

    return output;
  }

  shouldBroadcastMessage(message) {
    const isBot = message.author.bot && config.discord.channels.allowedBots.includes(message.author.id) === false ? true : false;
    const isValid = !isBot && (message.content.length > 0 || message.attachments.size > 0 || message.stickers.size > 0);
    const validChannelIds = [config.discord.channels.officerChannel, config.discord.channels.guildChatChannel, config.discord.channels.debugChannel];

    return isValid && validChannelIds.includes(message.channel.id);
  }
}

module.exports = MessageHandler;
