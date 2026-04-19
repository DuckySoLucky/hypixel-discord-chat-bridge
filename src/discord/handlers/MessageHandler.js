const { uploadImage } = require("../../contracts/API/imgurAPI.js");
const { demojify } = require("discord-emoji-converter");
const config = require("../../../config.json");

const imgur = require('imgur-anonymous-uploader');
const uploader = new imgur("318214bc4f4717f");
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { url } = require("inspector");

async function downloadUploadDeleteImage(imageUrl) {
  try {
    // Define a temporary file path to store the image
    const filePath = path.join(__dirname, 'downloaded_image.png');

    // Step 1: Download the image using axios
    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'stream'
    });

    // Step 2: Save the image to the file system
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    // Wait for the file to be written
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    // Step 3: Upload the image using uploader.upload(filepath)
    const uploadResponse = await uploader.uploadFile(filePath)
    console.log('Image uploaded successfully');

    // Step 4: Delete the file after upload
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Failed to delete file:', err);
      } else {
        console.log('File deleted successfully');
      }
    });

    // Step 5: Return new URL
    return uploadResponse.url
  } catch (error) {
    console.error('Error:', error);
  }
}
function charInc(str, int) {
  const charSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let incrementedStr = '';
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    let index = charSet.indexOf(char);

    if (index == -1) {
      incrementedStr += char;
    } else {
      let offset = index + int
      while (offset >= charSet.length) {
        offset -= charSet.length
      }
      while (offset < 0) {
        offset += charSet.length
      }
      let nextChar = charSet[offset];
      incrementedStr += nextChar;
    }
  }
  return incrementedStr;
}
function decode(string) {
  if (!string.startsWith('l$')) {
    throw new Error('String does not appear to be in STuF');
  }
  let prefix = string[2];
  let suffix = string[3];
  let dotIndices = string.slice(4, string.indexOf('|')).split('').map(Number);
  let urlBody = string.slice(string.indexOf('|') + 1);

  let first9 = urlBody.slice(0, 9 - dotIndices.length);
  let then = urlBody.slice(9 - dotIndices.length).replace(/\^/g, '.');

  let url = first9 + then;
  url = charInc(url, -1)

  // Restore the dots in the first part of the URL
  dotIndices.forEach((index) => {
    url = url.slice(0, index) + '.' + url.slice(index);
  });

  // Add the prefix back
  if (prefix === 'h') {
    url = 'http://' + url;
  } else if (prefix === 'H') {
    url = 'https://' + url;
  }

  // Add the suffix back
  if (suffix === '1') {
    url += '.png';
  } else if (suffix === '2') {
    url += '.jpg';
  } else if (suffix === '3') {
    url += '.jpeg';
  } else if (suffix === '4') {
    url += '.gif';
  }

  return url;
}
async function Encode(url) {
  let encoded = "l$"
  if (url.startsWith('http://')) {
    encoded += 'h';
    url = url.slice(7); // Remove the 'http://' part
  } else if (url.startsWith('https://')) {
    encoded += 'H';
    url = url.slice(8); // Remove the 'https://' part
  }

  if (url.endsWith('.png')) {
    encoded += '1';
    url = url.slice(0, -4); // Remove the '.png' part
  } else if (url.endsWith('.jpg')) {
    encoded += '2';
    url = url.slice(0, -4); // Remove the '.jpg' part
  } else if (url.endsWith('.jpeg')) {
    encoded += '3';
    url = url.slice(0, -5); // Remove the '.jpeg' part
  } else if (url.endsWith('.gif')) {
    encoded += '4';
    url = url.slice(0, -4); // Remove the '.gif' part
  } else {
    encoded += '0';
  }

  let dotIndices = [];
  for (let i = 0; (i < url.length) && (i <= 8); i++) {
    if (url[i] === '.') {
      dotIndices.push(i);
      if (dotIndices.length === 9) break; // Stop after 9 dots
    }
  }

  let first9 = url.substring(0, 9)
  let then = url.substring(9).replace(/\./g, '^');
  first9 = first9.replace(/\./g, '');
  let shifted = charInc(first9 + then, 1)

  encoded += dotIndices.map(index => index.toString()).join('') + '|';
  encoded += shifted


  return encoded;
}

class MessageHandler {
  constructor(discord, oldcommand) {
    this.discord = discord;
    this.oldcommand = oldcommand;
  }

  async onMessage(message) {
    try {
      if (message.author.id === client.user.id || !this.shouldBroadcastMessage(message)) {
        return;
      }
      const urlRegex = /https?:\/\/[^\s]+/g;
      const urls = message.content.match(urlRegex);
      this.oldcommand.handle(message)
      if (urls) {
        let prom = new Promise ((resolve, reject) => {
          urls.forEach(async(url, index, array) => {
            let ogurl = url
            let url2 = undefined
            if (url.includes("img.azael.moe")) {
              url2 = url.replace(/https:\/\/img\.azael\.moe\//gm, "https://img.azael.moe/r/")
              url = await downloadUploadDeleteImage(url2)
            }
            else{
              url = await downloadUploadDeleteImage(ogurl)
            }
            const encodedUrl = await Encode(url);
            message.content = message.content.replace(ogurl, encodedUrl);
            if(index === array.length -1) resolve();
          })
        })
        prom.then(() => {
          if(this.shouldBroadcastMessage(message)){
            if(message.channel.id==config.discord.channels.officerChannel) return

            this.discord.broadcastMessage({
              username: message.member.displayName,
              message: message.content.replace(/<[@|#|!|&]{1,2}(\d+){16,}>/g, '\n')
              .replace(/<:\w+:(\d+){16,}>/g, '\n')
              .replace(/<.*:\d{16,20}>/g, "\n")
              .split('\n')
              .map(part => {
                part = part.trim()
        
                return part.length == 0 ? '' : part + ' '
              })
              .join('')
            })
          }
        })
        return
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
            const imgurLink = await downloadUploadDeleteImage(attachment)
            const encodedLink = await Encode(imgurLink)
            messageData.message = messageData.message.replace(attachment, encodedLink);

            if (messageData.message.includes(encodedLink) === false) {
              messageData.message += ` ${encodedLink}`;
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

    // Replace IP Adresses with [Content Redacted]
    const IPAddressPattern = /(?:\d{1,3}\s*\s\s*){3}\d{1,3}/g;
    output = output.replaceAll(IPAddressPattern, "[Content Redacted]");

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
  shouldReadChannel(message) {
    return message.channel.id == "1165608524538187896"
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
