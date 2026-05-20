import { unemojify } from "node-emoji";
import type DiscordManager from "../DiscordManager.js";
import type { Attachment, GuildBasedChannel, GuildMember, Message } from "discord.js";
import type { BroadcastEvent } from "../../Types/Bridge.js";

class MessageHandler {
  private readonly discord: DiscordManager;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  async onMessage(message: Message) {
    try {
      if (!message.guild || message.author.id === message.client.user.id || !this.shouldBroadcastMessage(message)) return;

      const discordUser = await message.guild.members.fetch(message.author.id);
      const memberRoles = discordUser.roles.cache.map((role) => role.id);
      if (memberRoles.some((role) => this.discord.app.config.discord.commands.blacklistRoles.includes(role))) return;

      const content = this.stripDiscordContent(message).trim();
      if (content.length === 0 && message.attachments.size === 0) return;

      const username = this.getDisplayName(discordUser);
      if (username === undefined || username.length === 0) return;

      const formattedUsername = unemojify(username);

      const messageData: BroadcastEvent = {
        // was member
        discordUser: discordUser.user,
        // was channel
        channelId: message.channel.id,
        username: formattedUsername.replaceAll(" ", ""),
        message: content,
        replyingTo: await this.fetchReply(message),
        // was discord
        discordMessage: message
      };

      if (!messageData.message || messageData.message.length === 0) return;

      if (messageData.message.length > 220) {
        const messageParts = messageData.message.match(/.{1,200}/g);
        if (messageParts === null) return;

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

  async fetchReply(message: Message): Promise<string | null> {
    try {
      if (!message.guild) return null;
      if (message.reference?.messageId === undefined || message.mentions === undefined || message.mentions.repliedUser === null) return null;

      const reference = await message.channel.messages.fetch(message.reference.messageId);

      const discUser = await message.guild.members.fetch(message.mentions.repliedUser.id);
      const mentionedUserName = this.getDisplayName(discUser);

      if (this.discord.app.config.discord.other.messageMode === "bot" && reference.embeds.length >= 1) {
        const name = reference.embeds[0]?.author?.name;
        if (name === undefined) return mentionedUserName;
        return name;
      }

      if (this.discord.app.config.discord.other.messageMode === "minecraft" && reference.attachments !== null) {
        const name = reference.attachments.values()?.next()?.value?.name;
        if (name === undefined) return mentionedUserName;
        return name.split(".")?.[0] ?? "UNKNOWN";
      }

      if (this.discord.app.config.discord.other.messageMode === "webhook") {
        if (reference.author.username === undefined) return mentionedUserName;
        return reference.author.username;
      }

      return mentionedUserName ?? null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  stripDiscordContent(message: Message): string {
    if (!message.guild) return "";
    let output = message.content
      .split("\n")
      .map((part) => {
        part = part.trim();
        return part.length === 0 ? "" : part.replace(/@(everyone|here)/gi, "").trim() + " ";
      })
      .join("");

    const hasMentions = /<@|<#|<:|<a:/.test(message.content);
    if (hasMentions) {
      // Replace <@486155512568741900> with @DuckySoLucky
      const userMentionPattern = /<@(\d+)>/g;

      const replaceUserMention = (_match: string, mentionedUserId: string): string => {
        const mentionedUser = message.guild?.members.cache.get(mentionedUserId);
        return mentionedUser ? `@${this.getDisplayName(mentionedUser)}` : "@unknown-user";
      };
      output = output.replace(userMentionPattern, replaceUserMention);

      // Replace <#1072863636596465726> with #💬・guild-chat
      const channelMentionPattern = /<#(\d+)>/g;
      const replaceChannelMention = (_match: string, mentionedChannelId: string): string => {
        const mentionedChannel = message.guild?.channels.fetch(mentionedChannelId) as GuildBasedChannel | undefined;
        return mentionedChannel?.name ? `#${mentionedChannel.name}` : "#unknown-channel";
      };
      output = output.replace(channelMentionPattern, replaceChannelMention);

      // Replace <:KEKW:628249422253391902> with :KEKW: || Replace <a:KEKW:628249422253391902> with :KEKW:
      const emojiMentionPattern = /<a?:(\w+):\d+>/g;
      output = output.replace(emojiMentionPattern, ":$1:");
    }

    if (message.stickers.size > 0) {
      const sticker = message.stickers.first();
      if (sticker) output = output ? `[${sticker.name}] ${output}` : `[${sticker.name}]`;
    }

    if (message.attachments.size > 0) {
      const attachments: string = [...message.attachments.values()]
        .map((attachment: Attachment) => {
          const fileName = attachment.name ?? "unknown-file";
          const dot = fileName.lastIndexOf(".");
          const clean = (dot !== -1 ? fileName.slice(0, dot) : fileName).replace(/\./g, "_");
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

  shouldBroadcastMessage(message: Message) {
    const isBot = Boolean(message.author.bot && this.discord.app.config.discord.channels.allowedBots.includes(message.author.id) === false);
    const isValid = !isBot && (message.content.length > 0 || message.attachments.size > 0 || message.stickers.size > 0);
    const validChannelIds = [
      this.discord.app.config.discord.channels.officerChannel,
      this.discord.app.config.discord.channels.guildChatChannel,
      this.discord.app.config.discord.channels.debugChannel
    ];

    return isValid && validChannelIds.includes(message.channel.id);
  }

  getDisplayName(user: GuildMember): string {
    return user.nickname ?? user.user.globalName ?? user.user.username;
  }
}

export default MessageHandler;
