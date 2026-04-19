const { replaceAllRanks, replaceVariables } = require("../../contracts/helperFunctions.js");

const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const updateRolesCommand = require("../../discord/commands/updateCommand.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const { getUUID } = require("../../contracts/API/mowojangAPI.js");
const eventHandler = require("../../contracts/EventHandler.js");
const getWeight = require("../../../API/stats/weight.js");
const { isUuid } = require("../../../API/utils/uuid.js");
const messages = require("../../../messages.json");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const Logger = require("../../Logger.js");
const { readFileSync } = require("fs");
const axios = require("axios");
const fs = require('fs');
const path = require('path');
const { setInterval } = require('timers/promises');
const Canvas = require('canvas');
const imgur = require('imgur-anonymous-uploader');
const { url } = require('inspector');
const uploader = new imgur("318214bc4f4717f");

let retsu = ""
let mes = "";
Canvas.registerFont('./src/fonts/MinecraftRegular-Bmg3.ttf', { family: 'Minecraft' });
Canvas.registerFont('./src/fonts/minecraft-bold.otf', { family: 'MinecraftBold' });
Canvas.registerFont('./src/fonts/2_Minecraft-Italic.otf', { family: 'MinecraftItalic' });
Canvas.registerFont('./src/fonts/unifont.ttf', { family: 'MinecraftUnicode' });
const RGBA_COLOR = {
  0: 'rgba(0,0,0,1)',
  1: 'rgba(0,0,170,1)',
  2: 'rgba(0,170,0,1)',
  3: 'rgba(0,170,170,1)',
  4: 'rgba(170,0,0,1)',
  5: 'rgba(170,0,170,1)',
  6: 'rgba(255,170,0,1)',
  7: 'rgba(170,170,170,1)',
  8: 'rgba(85,85,85,1)',
  9: 'rgba(85,85,255,1)',
  a: 'rgba(85,255,85,1)',
  b: 'rgba(85,255,255,1)',
  c: 'rgba(255,85,85,1)',
  d: 'rgba(255,85,255,1)',
  e: 'rgba(255,255,85,1)',
  f: 'rgba(255,255,255,1)',
};

async function getCanvasWidthAndHeight(lore) {
  const canvas = Canvas.createCanvas(1, 1);
  const ctx = canvas.getContext('2d');
  ctx.font = '24px Minecraft';

  let highestWidth = 0;
  for (let i = 0; i < lore.length; i++) {
    const width = ctx.measureText(lore[i].replace(/\u00A7[0-9A-FK-OR]/gi, '')).width;
    if (width > highestWidth) {
      highestWidth = width;
    }
  }

  return { height: lore.length * 24 + 15, width: highestWidth + 60 };
}

async function renderLore(lore) {
  lore = lore.split("\n")
  const measurements = await getCanvasWidthAndHeight(lore);
  const canvas = Canvas.createCanvas(measurements.width, measurements.height);
  const ctx = canvas.getContext('2d');
  // BACKGROUND
  ctx.fillStyle = '#100110';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // FONT
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.shadowColor = '#131313';
  ctx.font = '24px Minecraft';
  ctx.fillStyle = '#ffffff';

  // TEXT
  for (const [index, item] of Object.entries(lore)) {
    let width = 10;
    const splitItem = item.split('§');
    if (splitItem[0].length == 0) splitItem.shift();

    for (const toRenderItem of splitItem) {
      ctx.fillStyle = RGBA_COLOR[toRenderItem[0]];

      if (toRenderItem.startsWith('l')) ctx.font = '24px MinecraftBold, MinecraftUnicode';
      else if (toRenderItem.startsWith('o')) ctx.font = '24px MinecraftItalic, MinecraftUnicode';
      else ctx.font = '24px Minecraft, MinecraftUnicode';

      ctx.fillText(toRenderItem.substring(1), width, index * 24 + 29);
      width += ctx.measureText(toRenderItem.substring(1)).width;
    }
  }
  return canvas.toBuffer();
}
async function getLoreFromID(id) {
  let lore = await axios.post('https://baltraz.is-a.dev/getItem', {
    itemUUID: id
  })
    .then(response => {
      let lore = `${response.data.name}\n${response.data.lore.join('\n')}`
      return lore
    })
    .catch(error => {
      console.error(error);
    });
  return lore
}
async function getItemLore(id) {
  let lore = await getLoreFromID(id)
  const renderedItem = await renderLore(lore)
  const uploadResponse = await uploader.uploadBuffer(renderedItem);
  if (!uploadResponse.url) return "Failed to upload image.";
  else return uploadResponse.url
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
function Encode(url) {
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
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
 return result;
}

class StateHandler extends eventHandler {
  constructor(minecraft, command, discord) {
    super();
    this.minecraft = minecraft;
    this.discord = discord;
    this.command = command;
  }

  registerEvents(bot) {
    this.bot = bot;
    this.bot.on("message", (message) => this.onMessage(message));
  }

  async onMessage(event) {
    const message = event.toString();
    const colouredMessage = event.toMotd();

    // NOTE: fixes "100/100❤     100/100✎ Mana" spam in the debug channel
    if (message.includes("✎ Mana") && message.includes("❤") && message.includes("/")) {
      return;
    }

    if (config.discord.channels.debugMode === true) {
      this.minecraft.broadcastMessage({
        fullMessage: colouredMessage,
        message: message,
        chat: "debugChannel",
      });
    }

    if (this.isLobbyJoinMessage(message) && config.discord.other.autoLimbo === true) {
      return bot.chat("/limbo");
    }

    if (this.isPartyMessage(message) && config.minecraft.fragBot.enabled === true) {
      const username = message.substr(54).startsWith("[")
        ? message.substr(54).split(" ")[1].trim()
        : message.substr(54).split(" ")[0].trim();

      const { blacklist, blacklisted, whitelist, whitelisted } = config.minecraft.fragBot;
      if (blacklist || whitelist) {
        const uuid = await getUUID(username);

        if (config.minecraft.fragBot.blacklist === true) {
          if (blacklisted.includes(username) || blacklisted.includes(uuid)) {
            return;
          }
        }

        const members = await hypixel
          .getGuild("player", bot.username)
          .then(async (guild) => guild.members.map((member) => member.uuid));
        if ((config.minecraft.fragBot.whitelist && whitelisted.includes(username)) || members.includes(uuid)) {
          this.send(`/party accept ${username}`);
          await delay(Math.floor(Math.random() * (6900 - 4200 + 1)) + 4200);
          this.send(`/party leave`);
        }
      } else {
        this.send(`/party accept ${username}`);
        await delay(Math.floor(Math.random() * (6900 - 4200 + 1)) + 4200);
        this.send(`/party leave`);
      }
    }

    if (this.isRequestMessage(message)) {
      const username = replaceAllRanks(
        message.split(" has")[0].replaceAll("-----------------------------------------------------\n", ""),
      );
      const uuid = await getUUID(username);
      if (config.minecraft.guildRequirements.enabled) {
        const output = await Promise.all([getLatestProfile(uuid)]);
        let newlvl = 0
        let blacklist = fs.readFileSync('./src/blacklist.txt', "utf-8")
        if (!blacklist.includes(uuid)) {
          for (let b = 0; b < Object.keys(output[0].profiles).length; b++) {
            let profile = output[0].profiles[b]
            if (newlvl < profile.members[uuid].leveling?.experience) {
              newlvl = profile.members[uuid].leveling?.experience
            }
          }
          let meetRequirements = false;
          const skyblockLevel = newlvl / 100 ?? 0;

          if (
            skyblockLevel > config.minecraft.guildRequirements.requirements.skyblockLevel &&
            config.minecraft.guildRequirements.requirements.skyblockLevel > 0
          ) {
            meetRequirements = true;
          }
          console.log(
            `/oc [STATCHECK] ${username}${meetRequirements ? "meets" : "doesn't meet"} the requirements. SB Level: ${skyblockLevel.toLocaleString()}`,
          )
          bot.chat(
            `/oc [STATCHECK] ${username}${meetRequirements ? "meets" : "doesn't meet"} the requirements. SB Level: ${skyblockLevel.toLocaleString()}`,
          );
          await delay(1000);

          if (meetRequirements === true) {
            if (config.minecraft.guildRequirements.autoAccept === true) {
              bot.chat(`/guild accept ${username}`);
            }

            const statsEmbed = new EmbedBuilder()
              .setColor(2067276)
              .setTitle(`${username} has requested to join the Guild!`)
              .setDescription(`Skyblock level: ${skyblockLevel.toLocaleString()}`)

              .setThumbnail(`https://minotar.net/helm/${username}.png`)

            await client.channels.cache.get(`${config.discord.channels.loggingChannel}`).send({ embeds: [statsEmbed] });
          }
        } else {
          bot.chat(
            `/oc ${username} is blacklisted from the guild, do not accept.`,
          );
          const statsEmbed = new EmbedBuilder()
              .setColor(2067276)
              .setTitle(`${username} has been blocked from joining the Guild!`)
              .setDescription(`Make sure not to accept this person. They are blacklisted.`)

              .setThumbnail(`https://minotar.net/helm/${username}.png`)

            await client.channels.cache.get(`${config.discord.channels.officerChannel}`).send({ embeds: [statsEmbed] });
        }
      }
    }

    if (this.isLoginMessage(message)) {
      if (config.discord.other.joinMessage === true) {
        const username = message.split(">")[1].trim().split("joined.")[0].trim();
        return this.minecraft.broadcastPlayerToggle({
          fullMessage: colouredMessage,
          username: username,
          message: replaceVariables(messages.loginMessage, { username }),
          color: 2067276,
          channel: "Guild",
        });
      }
    }

    if (this.isLogoutMessage(message)) {
      if (config.discord.other.joinMessage === true) {
        const username = message.split(">")[1].trim().split("left.")[0].trim();
        return this.minecraft.broadcastPlayerToggle({
          fullMessage: colouredMessage,
          username: username,
          message: replaceVariables(messages.logoutMessage, { username }),
          color: 15548997,
          channel: "Guild",
        });
      }
    }

    if (this.isJoinMessage(message)) {
      const username = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(/ +/g)[0];
      await delay(1000);
      bot.chat(
        `/gc ${replaceVariables(messages.guildJoinMessage, {
          prefix: config.minecraft.bot.prefix,
        })}`,
      );
      await this.updateUser(username);
      return [
        this.minecraft.broadcastHeadedEmbed({
          message: replaceVariables(messages.joinMessage, { username }),
          title: `Member Joined`,
          icon: `https://mc-heads.net/avatar/${username}`,
          color: 2067276,
          channel: "Guild",
        }),
      ];
    }

    if (this.isLeaveMessage(message)) {
      const username = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(/ +/g)[0];
      await this.updateUser(username);

      return [


        this.minecraft.broadcastHeadedEmbed({
          message: replaceVariables(messages.leaveMessage, { username }),
          title: `Member Left`,
          icon: `https://mc-heads.net/avatar/${username}`,
          color: 15548997,
          channel: "Guild",
        }),
      ];
    }

    if (this.isKickMessage(message)) {
      const username = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(/ +/g)[0];
      await this.updateUser(username);

      return [

        this.minecraft.broadcastHeadedEmbed({
          message: replaceVariables(messages.kickMessage, { username }),
          title: `Member Kicked`,
          icon: `https://mc-heads.net/avatar/${username}`,
          color: 15548997,
          channel: "Guild",
        }),
      ];
    }

    if (this.isPromotionMessage(message)) {
      const username = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(/ +/g)[0];
      const rank = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(" to ")
        .pop()
        .trim();
      await this.updateUser(username);

      return [
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(messages.promotionMessage, {
            username,
            rank,
          }),
          color: 2067276,
          channel: "Guild",
        }),

      ];
    }

    if (this.isDemotionMessage(message)) {
      const username = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(/ +/g)[0];
      const rank = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(" to ")
        .pop()
        .trim();
      await this.updateUser(username);

      return [
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(messages.demotionMessage, {
            username,
            rank,
          }),
          color: 15548997,
          channel: "Guild",
        }),

      ];
    }

    if (this.isCannotMuteMoreThanOneMonth(message)) {
      return this.minecraft.broadcastCleanEmbed({
        message: messages.cannotMuteMoreThanOneMonthMessage,
        color: 15548997,
        channel: "Guild",
      });
    }

    if (this.isBlockedMessage(message)) {
      const blockedMsg = message.match(/".+"/g)[0].slice(1, -1);
      return this.minecraft.broadcastCleanEmbed({
        message: replaceVariables(messages.messageBlockedByHypixel, {
          message: blockedMsg,
        }),
        color: 15548997,
        channel: "Guild",
      });
    }

    if (this.isRepeatMessage(message)) {
      return client.channels.cache.get(config.discord.channels.guildChatChannel).send({
        embeds: [
          {
            color: 15548997,
            description: messages.repeatMessage,
          },
        ],
      });
    }

    if (this.isNoPermission(message)) {
      return this.minecraft.broadcastCleanEmbed({
        message: messages.noPermissionMessage,
        color: 15548997,
        channel: "Guild",
      });
    }

    if (this.isMuted(message)) {
      const formattedMessage = message.split(" ").slice(1).join(" ");
      this.minecraft.broadcastHeadedEmbed({
        message: formattedMessage.charAt(0).toUpperCase() + formattedMessage.slice(1),

        title: `Bot is currently muted for a Major Chat infraction.`,
        color: 15548997,
        channel: "Guild",
      });
    }

    if (this.isIncorrectUsage(message)) {
      return this.minecraft.broadcastCleanEmbed({
        message: message.split("'").join("`"),
        color: 15548997,
        channel: "Guild",
      });
    }
    if (this.isLogMessage(message)) {
      mes = retsu;
      retsu = "";
      mes = mes.replaceAll("_", "\\_");
      return this.minecraft.broadcastOfficerCommand({ message: mes, color: 0x47F049 })
    }
    if (this.isAlreadyBlacklistedMessage(message)) {
      return this.minecraft.broadcastHeadedEmbed({
        message: messages.alreadyBlacklistedMessage,
        title: `Blacklist`,
        color: 2067276,
        channel: "Guild",
      });
    }

    if (this.isBlacklistMessage(message)) {
      const username = message.split(" ")[1];

      return [
        this.minecraft.broadcastHeadedEmbed({
          message: replaceVariables(messages.blacklistMessage, {
            username,
          }),
          title: `Blacklist`,
          color: 2067276,
          channel: "Guild",
        }),

      ];
    }

    if (this.isBlacklistRemovedMessage(message)) {
      const username = message.split(" ")[1];
      return [
        this.minecraft.broadcastHeadedEmbed({
          message: replaceVariables(messages.blacklistRemoveMessage, {
            username,
          }),
          title: `Blacklist`,
          color: 2067276,
          channel: "Guild",
        }),

      ];
    }

    if (this.isOnlineInvite(message)) {
      const username = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(/ +/g)[2];
      return [
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(messages.onlineInvite, { username }),
          color: 2067276,
          channel: "Guild",
        }),

      ];
    }

    if (this.isOfflineInvite(message)) {
      const username = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(/ +/g)[6]
        .match(/\w+/g)[0];
      return [
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(messages.offlineInvite, { username }),
          color: 2067276,
          channel: "Guild",
        }),

      ];
    }

    if (this.isFailedInvite(message)) {
      return [
        this.minecraft.broadcastCleanEmbed({
          message: message.replace(/\[(.*?)\]/g, "").trim(),
          color: 15548997,
          channel: "Guild",
        }),

      ];
    }

    if (this.isGuildMuteMessage(message)) {
      const time = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(/ +/g)[7];
      return [
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(messages.guildMuteMessage, { time }),
          color: 15548997,
          channel: "Guild",
        }),

      ];
    }

    if (this.isGuildUnmuteMessage(message)) {
      return [
        this.minecraft.broadcastCleanEmbed({
          message: messages.guildUnmuteMessage,
          color: 2067276,
          channel: "Guild",
        }),

      ];
    }

    if (this.isUserMuteMessage(message)) {
      const username = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(/ +/g)[3]
        .replace(/[^\w]+/g, "");
      const time = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(/ +/g)[5];
      return [
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(messages.userMuteMessage, {
            username,
            time,
          }),
          color: 15548997,
          channel: "Guild",
        }),
      ];
    }

    if (this.isUserUnmuteMessage(message)) {
      const username = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(/ +/g)[3];
      return [
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(messages.userUnmuteMessage, {
            username,
          }),
          color: 2067276,
          channel: "Guild",
        }),

      ];
    }

    if (this.isSetrankFail(message)) {
      return this.minecraft.broadcastCleanEmbed({
        message: messages.setrankFailMessage,
        color: 15548997,
        channel: "Guild",
      });
    }

    if (this.isGuildQuestCompletion(message)) {
      this.minecraft.broadcastHeadedEmbed({
        title: "Guild Quest Completion",
        message: message,
        color: 15844367,
        channel: "Guild",
      });
    }

    if (this.isAlreadyMuted(message)) {
      return this.minecraft.broadcastCleanEmbed({
        message: messages.alreadyMutedMessage,
        color: 15548997,
        channel: "Guild",
      });
    }

    if (this.isNotInGuild(message)) {
      const username = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(" ")[0];
      return this.minecraft.broadcastCleanEmbed({
        message: replaceVariables(messages.notInGuildMessage, {
          username,
        }),
        color: 15548997,
        channel: "Guild",
      });
    }

    if (this.isLowestRank(message)) {
      const username = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(" ")[0];
      return this.minecraft.broadcastCleanEmbed({
        message: replaceVariables(messages.lowestRankMessage, {
          username,
        }),
        color: 15548997,
        channel: "Guild",
      });
    }

    if (this.isAlreadyHasRank(message)) {
      return this.minecraft.broadcastCleanEmbed({
        message: messages.alreadyHasRankMessage,
        color: 15548997,
        channel: "Guild",
      });
    }

    if (this.isTooFast(message)) {
      return Logger.warnMessage(message);
    }

    if (this.isPlayerNotFound(message)) {
      const username = message.split(" ")[8].slice(1, -1);
      return this.minecraft.broadcastCleanEmbed({
        message: replaceVariables(messages.playerNotFoundMessage, {
          username,
        }),
        color: 15548997,
        channel: "Guild",
      });
    }

    if (this.isGuildLevelUpMessage(message)) {
      const level = message
        .replace(/\[(.*?)\]/g, "")
        .trim()
        .split(/ +/g)[5];
      return this.minecraft.broadcastCleanEmbed({
        message: replaceVariables(messages.guildLevelUpMessage, { level }),
        color: 16766720,
        channel: "Guild",
      });
    }
    /*if (this.isPartyMessage(message)) {
      this.minecraft.broadcastCleanEmbed({ 
        message: `${message}`, 
        color: 15548997, 
        channel: 'Guild' 
      })  
    }*/

    const regex =
      config.discord.other.messageMode === "minecraft"
        ? /^(?<chatType>§[0-9a-fA-F](Guild|Officer)) > (?<rank>§[0-9a-fA-F](?:\[.*?\])?)?\s*(?<username>[^§\s]+)\s*(?:(?<guildRank>§[0-9a-fA-F](?:\[.*?\])?))?\s*§f: (?<message>.*)/
        : /^(?<chatType>\w+) > (?:(?:\[(?<rank>[^\]]+)\] )?(?:(?<username>\w+)(?: \[(?<guildRank>[^\]]+)\])?: )?)?(?<message>.+)$/;

    const match = (config.discord.other.messageMode === "minecraft" ? colouredMessage : message).match(regex);
    if (!match) {
      return;
    }
    if (this.isDiscordMessage(match.groups.message) === false) {
      const { chatType, rank, username, guildRank = "[Member]", message } = match.groups;
      if (message.includes("replying to") && username === this.bot.username) {
        return;
      }

      if (this.isMessageFromBot(username)) {
        return
      }

      if (message.includes("l$")) {
        let message2 = message.split(' ')
        for (let i = 0; i < message2.length; i++) {
          if (message2[i].startsWith('l$')) {
            let temp = message2[i]
            let link = decode(message2[i])
            message2 = message.replace(temp, link)
            if (link.endsWith(".jpg") || link.endsWith(".png") || link.endsWith(".jpeg") || link.endsWith(".webp") || link.endsWith(".gif")) {
              if(link.includes("img.azael.moe")){
                link = link.replace(/https:\/\/img\.azael\.moe\//gm,"https://img.azael.moe/r/")
              }
              this.minecraft.broadcastTextEmbed({
                username: username,
                message: message2.replace(link, ""),
                url: link,
                guildRank: guildRank,
              })
              return;
            } else {
              this.minecraft.broadcastTextEmbed({
                username: username,
                message: message2,
                guildRank: guildRank,
              })
              return;
            }
          }
        }
  
      }
      if (this.isSoopyMessage(message)) {
        const regex = /\<ItemSharing:(\d+)\>/g;
        if (regex.test(message)) {
          let itemNumber = message.match(regex);
          let newmessage = message.replace(itemNumber, "")
          let overflow = message
          let newitemNumber = itemNumber.toString().replace("<ItemSharing:", "").replace(">", "")
          getItemLore(newitemNumber).then(responseurl => {
            this.minecraft.broadcastTextEmbed({
              username: username,
              message: newmessage,
              guildRank: guildRank,
              url: responseurl,
              overflow: overflow.replace(itemNumber,Encode(responseurl))
            })
            return this.bot.chat(`/gc ${username}: ${responseurl}`)
          })
        }
      }
      this.minecraft.broadcastMessage({
        fullMessage: colouredMessage,
        chat: chatType,
        chatType,
        username,
        rank,
        guildRank,
        message,
        color: 0x2A2A2A,
      });
    }

    if (this.isCommand(match.groups.message)) {
      return this.command.handle(match.groups.username, match.groups.message);
    }
  }

  isDiscordMessage(message) {
    if(message.includes("<ItemSharing")){
      return false;
    }
    const isDiscordMessage = /^(?<username>(?!https?:\/\/)[^\s»:>]+)\s*[»:>]\s*(?<message>.*)/;

    const match = message.match(isDiscordMessage);
    if (match && ["Party", "Guild", "Officer"].includes(match.groups.username)) {
      return false;
    }

    return isDiscordMessage.test(message);
  }

  isCommand(message) {
    const regex = new RegExp(`^(?<prefix>[${config.minecraft.bot.prefix}-])(?<command>\\S+)(?:\\s+(?<args>.+))?\\s*$`);

    if (regex.test(message) === false) {
      const getMessage = /^(?<username>(?!https?:\/\/)[^\s»:>]+)\s*[»:>]\s*(?<message>.*)/;

      const match = message.match(getMessage);
      if (match === null || match.groups.message === undefined) {
        return false;
      }

      return regex.test(match.groups.message);
    }

    return regex.test(message);
  }

  getCommandData(message) {
    const regex = /^(?<player>[^\s»:>\s]+(?:\s+[^\s»:>\s]+)*)\s*[»:>\s]\s*(?<command>.*)/;

    const match = message.match(regex);
    if (match === null) {
      return {};
    }

    return match.groups;
  }

  getRankColor(message) {
    const regex = /§\w*\[(\w*[a-zA-Z0-9]+§?\w*(?:\+{0,2})?§?\w*)\] /g;

    const match = message.match(regex);
    if (match) {
      const color = match[0]
        .match(/§(\w)/g)
        .filter((value, index, self) => self.indexOf(value) === index)
        .at(-1);

      return color.slice(1);
    }

    return "7";
  }

  isMessageFromBot(username) {
    return bot.username === username;
  }

  isAlreadyBlacklistedMessage(message) {
    return (
      message.includes(`You've already ignored that player! /ignore remove Player to unignore them!`) &&
      !message.includes(":")
    );
  }
  isBlacklistRemovedMessage(message) {
    return message.startsWith("Removed") && message.includes("from your ignore list.") && !message.includes(":");
  }

  isBlacklistMessage(message) {
    return message.startsWith("Added") && message.includes("to your ignore list.") && !message.includes(":");
  }

  isGuildMessage(message) {
    return message.startsWith("Guild >") && message.includes(":");
  }

  isOfficerMessage(message) {
    return message.startsWith("Officer >") && message.includes(":");
  }

  isGuildQuestCompletion(message) {
    return message.includes("GUILD QUEST TIER ") && message.includes("COMPLETED") && !message.includes(":");
  }

  isLoginMessage(message) {
    return message.startsWith("Guild >") && message.endsWith("joined.") && !message.includes(":");
  }

  isLogoutMessage(message) {
    return message.startsWith("Guild >") && message.endsWith("left.") && !message.includes(":");
  }

  isJoinMessage(message) {
    return message.includes("joined the guild!") && !message.includes(":");
  }

  isLeaveMessage(message) {
    return message.includes("left the guild!") && !message.includes(":");
  }

  isKickMessage(message) {
    return message.includes("was kicked from the guild by") && !message.includes(":");
  }

  isPartyMessage(message) {
    return message.includes("has invited you to join their party!") && !message.includes(":");
  }

  isPromotionMessage(message) {
    return message.includes("was promoted from") && !message.includes(":");
  }

  isDemotionMessage(message) {
    return message.includes("was demoted from") && !message.includes(":");
  }

  isRequestMessage(message) {
    return message.includes("has requested to join the Guild!");
  }

  isBlockedMessage(message) {
    return message.includes("We blocked your comment") && !message.includes(":");
  }

  isRepeatMessage(message) {
    return message == "You cannot say the same message twice!";
  }

  isNoPermission(message) {
    return (
      (message.includes("You must be the Guild Master to use that command!") ||
        message.includes("You do not have permission to use this command!") ||
        message.includes(
          "I'm sorry, but you do not have permission to perform this command. Please contact the server administrators if you believe that this is in error.",
        ) ||
        message.includes("You cannot mute a guild member with a higher guild rank!") ||
        message.includes("You cannot kick this player!") ||
        message.includes("You can only promote up to your own rank!") ||
        message.includes("You cannot mute yourself from the guild!") ||
        message.includes("is the guild master so can't be demoted!") ||
        message.includes("is the guild master so can't be promoted anymore!") ||
        message.includes("You do not have permission to kick people from the guild!")) &&
      !message.includes(":")
    );
  }

  isIncorrectUsage(message) {
    return message.includes("Invalid usage!") && !message.includes(":");
  }

  isSoopyMessage(message) {
    const regex = /\<ItemSharing:(\d+)\>/g;
    if (regex.test(message)) {
      return message;
    }
  }

  isOnlineInvite(message) {
    return (
      message.includes("You invited") &&
      message.includes("to your guild. They have 5 minutes to accept.") &&
      !message.includes(":")
    );
  }

  isOfflineInvite(message) {
    return (
      message.includes("You sent an offline invite to") &&
      message.includes("They will have 5 minutes to accept once they come online!") &&
      !message.includes(":")
    );
  }

  isFailedInvite(message) {
    return (
      (message.includes("is already in another guild!") ||
        message.includes("You cannot invite this player to your guild!") ||
        (message.includes("You've already invited") && message.includes("to your guild! Wait for them to accept!")) ||
        message.includes("is already in your guild!")) &&
      !message.includes(":")
    );
  }

  isUserMuteMessage(message) {
    return message.includes("has muted") && message.includes("for") && !message.includes(":");
  }

  isUserUnmuteMessage(message) {
    return message.includes("has unmuted") && !message.includes(":");
  }

  isCannotMuteMoreThanOneMonth(message) {
    return message.includes("You cannot mute someone for more than one month") && !message.includes(":");
  }

  isGuildMuteMessage(message) {
    return message.includes("has muted the guild chat for") && !message.includes(":");
  }
  isLogMessage(message) {
    let regex = /^[A-Z][a-z]{2} \d{2} \d{4} \d{2}:\d{2} [A-Z]{3}:/gm;    
    if (regex.test(message)) {
      retsu += message +"\n"
    }
    if(message.includes("-----------------------------------------------------")){
      return retsu
    }
  }
  isGuildUnmuteMessage(message) {
    return message.includes("has unmuted the guild chat!") && !message.includes(":");
  }

  isSetrankFail(message) {
    return message.includes("I couldn't find a rank by the name of ") && !message.includes(":");
  }

  isAlreadyMuted(message) {
    return message.includes("This player is already muted!") && !message.includes(":");
  }

  isNotInGuild(message) {
    return message.includes(" is not in your guild!") && !message.includes(":");
  }

  isLowestRank(message) {
    return message.includes("is already the lowest rank you've created!") && !message.includes(":");
  }

  isAlreadyHasRank(message) {
    return message.includes("They already have that rank!") && !message.includes(":");
  }

  isLobbyJoinMessage(message) {
    return (message.endsWith(" the lobby!") || message.endsWith(" the lobby! <<<")) && message.includes("[MVP+");
  }

  isTooFast(message) {
    return message.includes("You are sending commands too fast! Please slow down.") && !message.includes(":");
  }

  isMuted(message) {
    return message.includes("Your mute will expire in") && !message.includes(":");
  }

  isPlayerNotFound(message) {
    return message.startsWith(`Can't find a player by the name of`);
  }

  isGuildLevelUpMessage(message) {
    return message.includes("The guild has reached Level") && !message.includes(":");
  }

  minecraftChatColorToHex(color) {
    switch (color) {
      case "0":
        return "#000000";
      case "1":
        return "#0000AA";
      case "2":
        return "#00AA00";
      case "3":
        return "#00AAAA";
      case "4":
        return "#AA0000";
      case "5":
        return "#AA00AA";
      case "6":
        return "#FFAA00";
      case "7":
        return "#AAAAAA";
      case "8":
        return "#555555";
      case "9":
        return "#5555FF";
      case "a":
        return "#55FF55";
      case "b":
        return "#55FFFF";
      case "c":
        return "#FF5555";
      case "d":
        return "#FF55FF";
      case "e":
        return "#FFFF55";
      case "f":
        return "#FFFFFF";
      default:
        return "#FFFFFF";
    }
  }

  async updateUser(player) {
    try {
      if (isUuid(player) === false) {
        player = await getUUID(player);
      }

      if (config.verification.enabled === false) {
        return;
      }

      const linkedData = readFileSync("data/linked.json");
      if (linkedData === undefined) {
        return;
      }
      const linked = JSON.parse(linkedData);
      if (linked === undefined) {
        return;
      }

      const linkedUser = Object.values(linked).find((u) => player)
      if (linkedUser === undefined) {
        return;
      }

      const user = await guild.members.fetch(linkedUser);
      await updateRolesCommand.execute(null, user);
    } catch {
      //
    }
  }
}

module.exports = StateHandler;
