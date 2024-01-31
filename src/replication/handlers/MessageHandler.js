const { uploadImage } = require("../../contracts/API/imgurAPI.js");
const { demojify } = require("discord-emoji-converter");
const config = require("../../../config.json");
const axios = require("axios");

const sender_cache = new Map();

class MessageHandler {
  constructor(discord) {
    this.discord = discord;
  }

  async cacheSender(discord_id) {
    let response = {
      uuid: undefined,
      guild_id: undefined,
      nick: undefined
    };
    try {
      let player_info = await Promise.all([
        axios.get(
          `https://sky.dssoftware.ru/api.php?method=getLinked&discord_id=${discord_id}&api=${config.minecraft.API.SCF.key}`
        ),
      ]).catch((error) => { });

      player_info = player_info?.[0]?.data ?? {};

      if (!player_info?.data?.exists) {
        return response;
      }

      let uuid = player_info?.data?.uuid;

      let hypixel_info = await Promise.all([
        axios.get(
          `https://api.hypixel.net/player?key=${config.minecraft.API.hypixelAPIkey}&uuid=${uuid}`
        ),
      ]).catch((error) => { });

      hypixel_info = hypixel_info?.[0]?.data ?? {};

      if (!hypixel_info?.success || hypixel_info?.player?.displayname == undefined) {
        return response;
      }

      response.uuid = player_info?.data?.uuid;
      response.nick = hypixel_info?.player?.displayname;

      let guild_info = await Promise.all([
        axios.get(
          `https://api.hypixel.net/guild?key=${config.minecraft.API.hypixelAPIkey}&player=${uuid}`
        ),
      ]).catch((error) => { });

      guild_info = guild_info?.[0]?.data ?? {};

      response.guild_id = guild_info?.guild?._id;

      sender_cache.set(discord_id, {
        last_save: Date.now(),
        data: response,
      });

      return {
        last_save: Date.now(),
        data: response,
      };
    }
    catch (e) {
      console.log(e);
    }
  }

  async getSenderData(discord_id) {
    if (sender_cache.has(discord_id)) {
      const data = sender_cache.get(discord_id);

      if (data.last_save + 600000 > Date.now()) {
        return data;
      }
    }

    let data = await this.cacheSender(discord_id);
    return data;
  }

  async onMessage(message) {
    try {
      if (message.author.id === replication_client.user.id || !this.shouldBroadcastMessage(message)) {
        return;
      }

      let sender_data = await this.getSenderData(message.author.id);

      if (sender_data?.data?.nick == undefined) {
        replication_client.channels.cache.get(config.discord.replication.channels.guild).send({
          content: `<@${message.author.id}>`,
          embeds: [
            {
              color: 15548997,
              description: "In order to use bridge, please use \`/scf-link\` command.\nThis way the messages will be sent with your Minecraft IGN.\nKeep in mind, your messages will **NOT** be sent otherwise."
            },
          ]
        });
        return;
      }

      const real_username = sender_data?.data?.nick;

      const content = this.stripDiscordContent(message).trim();
      if (content.length === 0 && message?.attachments?.size == 0) {
        return;
      }

      let chat = "Guild/Replication";
      if (message.channel.id == config.discord.replication.channels.debug) {
        chat = "Debug";
      }

      if (content.length >= 5 && sender_data?.data?.guild_id == "638b9e6a8ea8c990c96e91f7") {
        this.saveGuildMessage(real_username, sender_data?.data?.uuid);
      }

      const messageData = {
        member: message.member.user,
        chat: chat,
        channel: message.channel.id,
        username: real_username,
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
          const imgurLink = await uploadImage(attachment);

          messageData.message = messageData.message.replace(attachment, imgurLink.data.link);

          if (messageData.message.includes(imgurLink.data.link) === false) {
            messageData.message += ` ${imgurLink.data.link}`;
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

  async saveGuildMessage(username, uuid) {
    let message_send = await Promise.all([
      axios.get(
        `https://sky.dssoftware.ru/api.php?method=saveGuildMessage&uuid=${uuid}&source=SBU&api=${config.minecraft.API.SCF.key}&nick=${username}`
      ),
    ]).catch((error) => {});

    return;
  }

  async fetchReply(message) {
    try {
      if (message.reference?.messageId === undefined || message.mentions === undefined) {
        return null;
      }

      const reference = await message.channel.messages.fetch(message.reference.messageId);

      let mentionedUserName = message.mentions.repliedUser.username;
      let mentionedUserID = message?.mentions?.repliedUser?.id;
      if (mentionedUserID != undefined) {
        let repliedUserObject = await message.guild.members.cache.get(mentionedUserID);

        let sender_data = await this.getSenderData(mentionedUserID);
        mentionedUserName = sender_data?.data?.nick ?? repliedUserObject?.user?.username;
      }

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
    output = output.replaceAll(IPAddressPattern, "[Removed]");

    // ? demojify() function has a bug. It throws an error when it encounters channel with emoji in its name. Example: #💬・guild-chat
    try {
      return demojify(output);
    } catch (e) {
      return output;
    }
  }

  shouldBroadcastMessage(message) {
    const isBot =
      message.author.bot && config.discord.channels.allowedBots.includes(message.author.id) === false ? true : false;
    const isValid = !isBot && (message.content.length > 0 || message?.attachments?.size > 0);
    const validChannelIds = [config.discord.replication.channels.guild, config.discord.replication.channels.debug];

    return isValid && validChannelIds.includes(message.channel.id);
  }
}

module.exports = MessageHandler;
