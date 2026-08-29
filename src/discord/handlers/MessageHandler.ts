import { type Attachment, GuildMember, type Message, type User } from "discord.js";
import { unemojify } from "node-emoji";
import type DiscordManager from "../DiscordManager.js";
import type { DiscordToMinecraftMessage } from "../../types/bridge.js";

class MessageHandler {
  constructor(private readonly discord: DiscordManager) {}

  async onMessage(message: Message) {
    try {
      if (!message.guild || message.author.id === message.client.user.id || !this.shouldBroadcastMessage(message)) return;

      const discordUser = await message.guild.members.fetch(message.author.id);
      const content = this.stripDiscordContent(message).trim();
      if (content.length === 0 && message.attachments.size === 0) return;

      const username = this.getDisplayName(discordUser);
      if (username === undefined || username.length === 0) return;

      const formattedUsername = unemojify(username);

      const baseMessageData: Omit<DiscordToMinecraftMessage, "message"> = {
        channelId: message.channel.id,
        username: formattedUsername,
        replyingTo: await this.fetchReply(message),
        sourceMessage: message
      };

      let messageData: DiscordToMinecraftMessage = { ...baseMessageData, message: content };

      if (messageData.message.length > 220) {
        const messageParts = messageData.message.match(/.{1,200}/g);
        if (messageParts === null) return;

        for (const part of messageParts) {
          messageData = { ...baseMessageData, message: part };
          await this.discord.broadcastMessage(messageData);
          await new Promise((resolve) => setTimeout(resolve, 1000));

          if (messageParts.indexOf(part) >= 3) {
            messageData = { ...baseMessageData, message: "Message too long. Truncated." };
            await this.discord.broadcastMessage(messageData);
            return;
          }
        }

        return;
      }

      await this.discord.broadcastMessage(messageData);
    } catch (error) {
      console.error(error);
    }
  }

  async fetchReply(message: Message): Promise<string | null> {
    try {
      if (!message.guild) return null;
      if (message.reference?.messageId === undefined || message.mentions === undefined || message.mentions.repliedUser === null) return null;

      const reference = await message.channel.messages.fetch(message.reference.messageId);
      const discUser = await message.guild.members.fetch(message.mentions.repliedUser.id).catch(() => message.mentions.repliedUser);
      const mentionedUserName = this.getDisplayName(discUser);

      switch (this.discord.application.config.bridge.discord.mode) {
        case "bot": {
          if (reference.embeds.length === 0) return null;
          const name = reference.embeds[0]?.author?.name;
          if (name === undefined) return mentionedUserName;
          return name;
        }
        case "minecraft": {
          if (reference.attachments === null) return null;
          const name = reference.attachments.values()?.next()?.value?.name;
          if (name === undefined) return mentionedUserName;
          return name.split(".")?.[0] ?? "UNKNOWN";
        }
        case "webhook":
        default: {
          return mentionedUserName;
        }
      }
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
      // Replace <@&1530548906348249168> with @Guild Member
      const roleMentionPattern = /<@&(\d+)>/g;
      const replaceRoleMention = (_match: string, mentionedRoleId: string): string => {
        const mentionedRole = message.mentions.roles.get(mentionedRoleId) ?? message.guild?.roles.cache.get(mentionedRoleId);
        return mentionedRole ? `@${mentionedRole.name}` : "@unknown-role";
      };
      output = output.replace(roleMentionPattern, replaceRoleMention);

      // Replace <@486155512568741900> with @DuckySoLucky
      const userMentionPattern = /<@!?(\d+)>/g;

      const replaceUserMention = (_match: string, mentionedUserId: string): string => {
        const mentionedUser = message.mentions.members?.get(mentionedUserId) ?? message.guild?.members.cache.get(mentionedUserId);
        return mentionedUser ? `@${this.getDisplayName(mentionedUser)}` : "@unknown-user";
      };
      output = output.replace(userMentionPattern, replaceUserMention);

      // Replace <#1072863636596465726> with #💬・guild-chat
      const channelMentionPattern = /<#(\d+)>/g;
      const replaceChannelMention = (_match: string, mentionedChannelId: string): string => {
        const mentionedChannel = message.mentions.channels.get(mentionedChannelId) ?? message.guild?.channels.cache.get(mentionedChannelId);
        return mentionedChannel && "name" in mentionedChannel && mentionedChannel.name ? `#${mentionedChannel.name}` : "#unknown-channel";
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
    const isBot = Boolean(message.author.bot && this.discord.application.config.bridge.discord.allowedBots.includes(message.author.id) === false);
    const isValid = !isBot && (message.content.length > 0 || message.attachments.size > 0 || message.stickers.size > 0);
    const validChannelIds = [
      this.discord.application.config.bridge.channels.officer.channel,
      this.discord.application.config.bridge.channels.guild.channel,
      this.discord.application.config.bridge.channels.debug.channel
    ];

    return isValid && validChannelIds.includes(message.channel.id);
  }

  getDisplayName(user: GuildMember | User | null): string {
    if (!user) return "UNKNOWN";
    if (user instanceof GuildMember) return user.nickname ?? this.getFallbackDisplayName(user.user);
    return this.getFallbackDisplayName(user);
  }

  private getFallbackDisplayName(user: User): string {
    return user.globalName ?? user.username;
  }
}

export default MessageHandler;
