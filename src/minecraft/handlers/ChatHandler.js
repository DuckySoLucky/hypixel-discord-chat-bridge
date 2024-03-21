const { replaceAllRanks, replaceVariables } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const { getUUID } = require("../../contracts/API/PlayerDBAPI.js");
const eventHandler = require("../../contracts/EventHandler.js");
const getWeight = require("../../../API/stats/weight.js");
const messages = require("../../../messages.json");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const Logger = require("../../Logger.js");

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
      return bot.chat("\u00a7");
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
        message.split("has")[0].replaceAll("-----------------------------------------------------\n", "")
      );
      const uuid = await getUUID(username);
      if (config.minecraft.guildRequirements.enabled) {
        const [player, profile] = await Promise.all([hypixel.getPlayer(uuid), getLatestProfile(uuid)]);
        let meetRequirements = false;

        const weight = getWeight(profile.profile, profile.uuid)?.weight?.senither?.total || 0;
        const skyblockLevel = (profile.profile?.leveling?.experience || 0) / 100 ?? 0;

        const bwLevel = player.stats.bedwars.level;
        const bwFKDR = player.stats.bedwars.finalKDRatio;

        const swLevel = player.stats.skywars.level / 5;
        const swKDR = player.stats.skywars.KDRatio;

        const duelsWins = player.stats.duels.wins;
        const dWLR = player.stats.duels.WLRatio;

        if (weight > config.minecraft.guildRequirements.requirements.senitherWeight) {
          meetRequirements = true;
        }

        if (skyblockLevel > config.minecraft.guildRequirements.requirements.skyblockLevel) {
          meetRequirements = true;
        }

        if (bwLevel > config.minecraft.guildRequirements.requirements.bedwarsStars) {
          meetRequirements = true;
        }
        if (
          bwLevel > config.minecraft.guildRequirements.requirements.bedwarsStarsWithFKDR &&
          bwFKDR > config.minecraft.guildRequirements.requirements.bedwarsFKDR
        ) {
          meetRequirements = true;
        }

        if (swLevel > config.minecraft.guildRequirements.requirements.skywarsStars) {
          meetRequirements = true;
        }
        if (
          swLevel > config.minecraft.guildRequirements.requirements.skywarsStarsWithKDR &&
          swKDR > config.minecraft.guildRequirements.requirements.skywarsStarsWithKDR
        ) {
          meetRequirements = true;
        }

        if (duelsWins > config.minecraft.guildRequirements.requirements.duelsWins) {
          meetRequirements = true;
        }
        if (
          duelsWins > config.minecraft.guildRequirements.requirements.duelsWinsWithWLR &&
          dWLR > config.minecraft.guildRequirements.requirements.duelsWinsWithWLR
        ) {
          meetRequirements = true;
        }

        bot.chat(
          `/oc ${username} ${meetRequirements ? "meets" : "Doesn't meet"} Requirements. [BW] [${
            player.stats.bedwars.level
          }✫] FKDR: ${player.stats.bedwars.finalKDRatio} | [SW] [${player.stats.skywars.level}✫] KDR: ${
            player.stats.skywars.KDRatio
          } | [Duels] Wins: ${player.stats.duels.wins.toLocaleString()} WLR: ${player.stats.duels.WLRatio.toLocaleString()} | SB Weight: ${weight.toLocaleString()} | SB Level: ${skyblockLevel.toLocaleString()}`
        );
        await delay(1000);

        if (meetRequirements === true) {
          if (config.minecraft.guildRequirements.autoAccept === true) {
            bot.chat(`/guild accept ${username}`);
          }

          const statsEmbed = new EmbedBuilder()
            .setColor(2067276)
            .setTitle(`${player.nickname} has requested to join the Guild!`)
            .setDescription(`**Hypixel Network Level**\n${player.level}\n`)
            .addFields(
              {
                name: "Bedwars Level",
                value: `${player.stats.bedwars.level}`,
                inline: true,
              },
              {
                name: "Skywars Level",
                value: `${player.stats.skywars.level}`,
                inline: true,
              },
              {
                name: "Duels Wins",
                value: `${player.stats.duels.wins}`,
                inline: true,
              },
              {
                name: "Bedwars FKDR",
                value: `${player.stats.bedwars.finalKDRatio}`,
                inline: true,
              },
              {
                name: "Skywars KDR",
                value: `${player.stats.skywars.KDRatio}`,
                inline: true,
              },
              {
                name: "Duels WLR",
                value: `${player.stats.duels.KDRatio}`,
                inline: true,
              },
              {
                name: "Senither Weight",
                value: `${weight.toLocaleString()}`,
                inline: true,
              },
              {
                name: "Skyblock Level",
                value: `${skyblockLevel.toLocaleString()}`,
                inline: true,
              }
            )
            .setThumbnail(`https://www.mc-heads.net/avatar/${player.nickname}`)
            .setFooter({
              text: `/help [command] for more information`,
              iconURL: "https://i.imgur.com/vt9IRtV.png",
            });

          await client.channels.cache.get(`${config.discord.channels.loggingChannel}`).send({ embeds: [statsEmbed] });
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
        })} | :) `
      );
      return [
        this.minecraft.broadcastHeadedEmbed({
          message: replaceVariables(messages.joinMessage, { username }),
          title: `Member Joined`,
          icon: `https://mc-heads.net/avatar/${username}`,
          color: 2067276,
          channel: "Logger",
        }),
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

      return [
        this.minecraft.broadcastHeadedEmbed({
          message: replaceVariables(messages.leaveMessage, { username }),
          title: `Member Left`,
          icon: `https://mc-heads.net/avatar/${username}`,
          color: 15548997,
          channel: "Logger",
        }),
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

      return [
        this.minecraft.broadcastHeadedEmbed({
          message: replaceVariables(messages.kickMessage, { username }),
          title: `Member Kicked`,
          icon: `https://mc-heads.net/avatar/${username}`,
          color: 15548997,
          channel: "Logger",
        }),
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
      return [
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(messages.promotionMessage, {
            username,
            rank,
          }),
          color: 2067276,
          channel: "Guild",
        }),
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(messages.promotionMessage, {
            username,
            rank,
          }),
          color: 2067276,
          channel: "Logger",
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
      return [
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(messages.demotionMessage, {
            username,
            rank,
          }),
          color: 15548997,
          channel: "Guild",
        }),
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(messages.demotionMessage, {
            username,
            rank,
          }),
          color: 15548997,
          channel: "Logger",
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
        this.minecraft.broadcastHeadedEmbed({
          message: replaceVariables(messages.blacklistMessage, {
            username,
          }),
          title: `Blacklist`,
          color: 2067276,
          channel: "Logger",
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
        this.minecraft.broadcastHeadedEmbed({
          message: replaceVariables(messages.blacklistRemoveMessage, {
            username,
          }),
          title: `Blacklist`,
          color: 2067276,
          channel: "Logger",
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
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(messages.onlineInvite, { username }),
          color: 2067276,
          channel: "Logger",
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
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(messages.offlineInvite, { username }),
          color: 2067276,
          channel: "Logger",
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
        this.minecraft.broadcastCleanEmbed({
          message: message.replace(/\[(.*?)\]/g, "").trim(),
          color: 15548997,
          channel: "Logger",
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
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(messages.guildMuteMessage, { time }),
          color: 15548997,
          channel: "Logger",
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
        this.minecraft.broadcastCleanEmbed({
          message: messages.guildUnmuteMessage,
          color: 2067276,
          channel: "Logger",
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
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(messages.userMuteMessage, {
            username,
            time,
          }),
          color: 15548997,
          channel: "Logger",
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
        this.minecraft.broadcastCleanEmbed({
          message: replaceVariables(messages.userUnmuteMessage, {
            username,
          }),
          color: 2067276,
          channel: "Logger",
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

      this.minecraft.broadcastMessage({
        fullMessage: colouredMessage,
        chat: chatType,
        chatType,
        username,
        rank,
        guildRank,
        message,
        color: this.minecraftChatColorToHex(this.getRankColor(colouredMessage)),
      });
    }

    if (this.isCommand(match.groups.message)) {
      if (this.isDiscordMessage(match.groups.message) === true) {
        const { player, command } = this.getCommandData(match.groups.message);

        return this.command.handle(player, command);
      }

      return this.command.handle(match.groups.username, match.groups.message);
    }
  }

  isDiscordMessage(message) {
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
          "I'm sorry, but you do not have permission to perform this command. Please contact the server administrators if you believe that this is in error."
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
}

module.exports = StateHandler;
