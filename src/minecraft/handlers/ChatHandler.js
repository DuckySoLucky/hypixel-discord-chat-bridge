const { replaceAllRanks, toFixed, addCommas } = require('../../contracts/helperFunctions')
const { getSenitherWeightUsername } = require('../../contracts/weight/senitherWeight')
const { getLilyWeightUsername } = require('../../contracts/weight/lilyWeight')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
let guildInfo = [], guildRanks = [], members = [], guildTop = []
const hypixel = require('../../contracts/API/HypixelRebornAPI')
const EventHandler = require('../../contracts/EventHandler')
const messages = require('../../../messages.json')
const config = require('../../../config.json')
const Logger = require('../../Logger')
const fs = require('fs')


class StateHandler extends EventHandler {
  constructor(minecraft, command, discord) {
    super()
    this.minecraft = minecraft
    this.discord = discord
    this.command = command
  }

  registerEvents(bot) {
    this.bot = bot
    this.bot.on('message', (message) => this.onMessage(message))
  }

  async onMessage(event) {
    const message = event.toString()
    const colouredMessage = event.toMotd();

    if (this.isPartyMessage(message)) {
      let username = replaceAllRanks(message.substr(54))
      this.send(`/party accept ${username}`)
      await delay(5000)
      this.send(`/party leave`)        
    }

    if (this.isGuildTopMessage(message)) {
      if (!message.includes('10.')) {
        guildTop.push(message)
      } else {
        guildTop.push(message)
        let title = guildTop[0].split('  '), description = '', guildTopInfo = []
        for (let i = 1; i < guildTop.length; i++) {
          guildTop[i] = replaceAllRanks(guildTop[i])
          guildTopInfo = guildTop[i].split(' ')
          description = `${description}\n${guildTopInfo[0]} \`${guildTopInfo[1]}\` ${guildTopInfo[2]} ${guildTopInfo[3]} ${guildTopInfo[4]}`
        }

        this.minecraft.broadcastHeadedEmbed({
          message: `${description}`,
          title: title[0],
          icon: `https://hypixel.paniek.de/guild/${config.minecraft.guildID}/banner.png`,
          color: '00FF00',
          channel: 'Guild'
        })
        guildTop = [], guildTopInfo = [], description = '', title = []
      }
    }

    if (this.isRequestMessage(message)) {
      let username = replaceAllRanks(message.split('has')[0].replaceAll('-----------------------------------------------------\n', ''))
      if (config.guildRequirement.enabled) {
        const player = await hypixel.getPlayer(username)
        const senither = await getSenitherWeightUsername(username)
        const senitherW = senither.skills.weight + senither.skills.weight_overflow + senither.dungeons.weight + senither.dungeons.weight_overflow + senither.slayers.weight + senither.slayers.weight_overflow
        const lily = await getLilyWeightUsername(username)
        const lilyW = lily.total

        if(config.guildRequirement.autoAccept) {
          if (player.stats.bedwars.level > config.guildRequirement.requirements.bedwarsStars || player.stats.skywars.level > config.guildRequirement.requirements.skywars) bot.chat(`/g accept ${username}`)
          if (senitherW > config.guildRequirement.requirements.senitherWeight) bot.chat(`/g accept ${username}`)
          if (lilyW > config.guildRequirement.requirements.lilyWeight) bot.chat(`/g accept ${username}`)
          
        } else {
          let meetRequirements = false;
          if (player.stats.bedwars.level > config.guildRequirement.requirements.bedwarsStars || player.stats.skywars.level > config.guildRequirement.requirements.skywars) meetRequirements = true;
          if (senitherW > config.guildRequirement.requirements.senitherWeight) meetRequirements = true;
          if (lilyW > config.guildRequirement.requirements.lilyWeight) meetRequirements = true;

          this.minecraft.broadcastHeadedEmbed({
            message: `**Meets Requirements?**\n${meetRequirements ? 'Yes' : 'No'}\n \n**Hypixel Network Level**\n${player.level}\n \n**Bedwars Level**\n${player.stats.bedwars.level}\n \n**Skywars Level**\n${player.stats.skywars.level}\n \n**Senither Weight**\n${addCommas(toFixed(senitherW, 0))}\n \n**Lily Weight**\n${addCommas(toFixed(lilyW, 0))}`,
            title: `${username} has requested to join the Guild!`,
            icon: `https://www.mc-heads.net/avatar/${username}`,
            color: `${meetRequirements ? '#00FF00' : '#ff0000'}`,
            channel: 'Logger'
          })
        }
      }

    }

    if (this.isGuildListMessage(message)) {
      if(!message.includes('Online Members')) {
        if (message.includes('Guild Name') || message.includes('Total Members') || message.includes('Online Members')) {
          guildInfo.push(message)
        } else if (message.includes('--')) {
          guildRanks.push(message)
        } else {
          members.push(message)
        }
      } else {
        guildInfo.push(message)
        let guildInfoSplit = guildInfo[0].split(' ');
        let guildInfoSplit2 = guildInfo[1].split(' ');
        let guildInfoSplit3 = guildInfo[2].split(' ');
        for (let i = 0; i < members.length; i++) {
          members[i] = replaceAllRanks(members[i])
          members[i] = members[i].replaceAll('  ', ' ')
          members[i] = members[i].replaceAll(' ● ', '` ᛫ `')
          String.prototype.reverse = function () {return this.split('').reverse().join('')}
          String.prototype.replaceLast = function (what, replacement) {return this.reverse().replace(new RegExp(what.reverse()), replacement.reverse()).reverse()}
          members[i] = members[i].replaceLast(' ●', '`')
          members[i] = members[i].replaceLast('᛫ `', '')
        }
        let description = `Member Count: **${guildInfoSplit2[2]}/125**\nOnline Members: **${guildInfoSplit3[2]}**\n`
        for (let i = 0; i < guildRanks.length; i++) {
          description+= `\n`
          guildRanks[i] = guildRanks[i].replaceAll('--', '**')
          description+= `${guildRanks[i]}\n \`${members[i]}`
        }

        this.minecraft.broadcastHeadedEmbed({
          message: `${description}`,
          title: guildInfoSplit[2],
          icon: `https://hypixel.paniek.de/guild/${config.minecraft.guildID}/banner.png`,
          color: '47F049',
          channel: 'Guild'
        })
        guildInfo = [];
        guildRanks = [];
        members = [];
      }
  }
  

    if (this.isLoginMessage(message)) {
      let user = message.replace(/\[(.*?)\]/g, '').trim().split(/ +/g)[0]
      var data = JSON.parse(fs.readFileSync('config.json'));
      if (data.discord.joinMessage) { 
        let user = message.split('>')[1].trim().split('joined.')[0].trim()
        return this.minecraft.broadcastPlayerToggle({ 
          fullMessage: colouredMessage,
          username: user, 
          message: messages.loginMessage, 
          color: '47F049', 
          channel: 'Guild' 
        })
      }
    }

    if (this.isLogoutMessage(message)) {
      let user = message.replace(/\[(.*?)\]/g, '').trim().split(/ +/g)[0]
      var data = JSON.parse(fs.readFileSync('config.json'));
      if (data.discord.joinMessage) { 
        let user = message.split('>')[1].trim().split('left.')[0].trim()
        return this.minecraft.broadcastPlayerToggle({ 
          fullMessage: colouredMessage,
          username: user, 
          message: messages.logoutMessage, 
          color: 'F04947', 
          channel: 'Guild' 
        })
      }
    }

    if (this.isJoinMessage(message)) {
      let user = message.replace(/\[(.*?)\]/g, '').trim().split(/ +/g)[0]
      return [this.minecraft.broadcastHeadedEmbed({
        message: `${user} ${messages.joinMessage}`,
        title: `Member Joined`,
        icon: `https://mc-heads.net/avatar/${user}`,
        color: '47F049',
        channel: 'Logger'
      }), this.minecraft.broadcastHeadedEmbed({
        message: `${user} ${messages.joinMessage}`,
        title: `Member Joined`,
        icon: `https://mc-heads.net/avatar/${user}`,
        color: '47F049',
        channel: 'Guild'
      })]  
    }

    if (this.isLeaveMessage(message)) {
      let user = message.replace(/\[(.*?)\]/g, '').trim().split(/ +/g)[0]
      return [this.minecraft.broadcastHeadedEmbed({
        message: `${user} ${messages.leaveMessage}`,
        title: `Member Left`,
        icon: `https://mc-heads.net/avatar/${user}`,
        color: 'F04947',
        channel: 'Logger'
      }), this.minecraft.broadcastHeadedEmbed({
        message: `${user} ${messages.leaveMessage}`,
        title: `Member Left`,
        icon: `https://mc-heads.net/avatar/${user}`,
        color: 'F04947',
        channel: 'Guild'
      })]
    }

    if (this.isKickMessage(message)) {
      let user = message.replace(/\[(.*?)\]/g, '').trim().split(/ +/g)[0]
      return [this.minecraft.broadcastHeadedEmbed({
        message: `${user} ${messages.kickMessage}`,
        title: `Member Kicked`,
        icon: `https://mc-heads.net/avatar/${user}`,
        color: 'F04947',
        channel: 'Logger'
      }), this.minecraft.broadcastHeadedEmbed({
        message: `${user} ${messages.kickMessage}`,
        title: `Member Kicked`,
        icon: `https://mc-heads.net/avatar/${user}`,
        color: 'F04947',
        channel: 'Guild'
      })]   
    }

    if (this.isPromotionMessage(message)) {
      let username = message.replace(/\[(.*?)\]/g, '').trim().split(/ +/g)[0]
      let newRank = message.replace(/\[(.*?)\]/g, '').trim().split(' to ').pop().trim()
      return [this.minecraft.broadcastCleanEmbed({ 
        message: `${username} ${messages.promotionMessage} ${newRank}`, 
        color: '47F049', 
        channel: 'Guild'
      }),
      this.minecraft.broadcastCleanEmbed({ 
        message: `${username} ${messages.promotionMessage} ${newRank}`, 
        color: '47F049', 
        channel: 'Logger' 
      })]
    }

    if (this.isDemotionMessage(message)) {
      let username = message.replace(/\[(.*?)\]/g, '').trim().split(/ +/g)[0]
      let newRank = message.replace(/\[(.*?)\]/g, '').trim().split(' to ').pop().trim()
      return [this.minecraft.broadcastCleanEmbed({ 
        message: `${username} ${messages.demotionMessage} ${newRank}`, 
        color: 'F04947', 
        channel: 'Guild' 
      }),
      this.minecraft.broadcastCleanEmbed({ 
        message: `${username} ${messages.demotionMessage} ${newRank}`, 
        color: 'F04947', 
        channel: 'Logger' 
      })]
    }

    if (this.isBlockedMessage(message)) {
      let blockedMsg = message.match(/".+"/g)[0].slice(1, -1)
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${messages.blockedMessageFirst} ${blockedMsg} ${blockedMessageSecond}`, 
        color: 'DC143C', 
        channel: 'Guild' 
      })
    }

    if (this.isRepeatMessage(message)) {
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${messages.repeatMessage}`, 
        color: 'DC143C', 
        channel: 'Guild' 
      })
    }

    if (this.isNoPermission(message)) {
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${messages.noPermissionMessage}`, 
        color: 'DC143C', 
        channel: 'Guild' 
      })
    }

    if (this.isIncorrectUsage(message)) {
      return this.minecraft.broadcastCleanEmbed({ 
        message: message.split("'").join("`"), 
        color: 'DC143C', 
        channel: 'Guild' 
      })
    }

    if (this.isOnlineInvite(message)) {
      let user = message.replace(/\[(.*?)\]/g, '').trim().split(/ +/g)[2]
      return [this.minecraft.broadcastCleanEmbed({ 
        message: `${user} ${messages.onlineInvite}`, 
        color: '47F049', 
        channel: 'Guild' 
      }), 
      this.minecraft.broadcastCleanEmbed({ 
        message: `${user} ${messages.onlineInvite}`, 
        color: '47F049', 
        channel: 'Logger' 
      })]
    }

    if (this.isOfflineInvite(message)) {
      let user = message.replace(/\[(.*?)\]/g, '').trim().split(/ +/g)[6].match(/\w+/g)[0]
      return [this.minecraft.broadcastCleanEmbed({ 
        message: `${user} ${messages.offlineInvite}`, 
        color: '47F049', 
        channel: 'Guild' 
      }), 
      this.minecraft.broadcastCleanEmbed({ 
        message: `${user} ${messages.offlineInvite}`, 
        color: '47F049', 
        channel: 'Logger' 
      })]
    }

    if (this.isFailedInvite(message)) {
      return [this.minecraft.broadcastCleanEmbed({ 
        message: message.replace(/\[(.*?)\]/g, '').trim(), 
        color: 'DC143C', channel: 'Guild' 
      }), 
      this.minecraft.broadcastCleanEmbed({ 
        message: message.replace(/\[(.*?)\]/g, '').trim(), 
        color: 'DC143C', 
        channel: 'Logger' 
      })]
    }

    if (this.isGuildMuteMessage(message)) {
      let time = message.replace(/\[(.*?)\]/g, '').trim().split(/ +/g)[7]
      return [ this.minecraft.broadcastCleanEmbed({ 
        message: `${messages.guildMuteMessage} ${time}`, 
        color: 'F04947', 
        channel: 'Guild' 
      }), 
      this.minecraft.broadcastCleanEmbed({ 
        message: `${messages.guildMuteMessage} ${time}`,
        color: 'DC143C', 
        channel: 'Logger' 
      })]
    }

    if (this.isGuildUnmuteMessage(message)) {
      return [ this.minecraft.broadcastCleanEmbed({ 
        message: `${messages.guildUnmuteMessage}`,
        color: '47F049', channel: 'Guild' 
      }), 
      this.minecraft.broadcastCleanEmbed({ 
        message: `${messages.guildUnmuteMessage}`,
        color: '47F049', 
        channel: 'Logger' 
      })]
    }

    if (this.isUserMuteMessage(message)) {
      let user = message.replace(/\[(.*?)\]/g, '').trim().split(/ +/g)[3].replace(/[^\w]+/g, '')
      let time = message.replace(/\[(.*?)\]/g, '').trim().split(/ +/g)[5]
      return [ this.minecraft.broadcastCleanEmbed({ 
        message: `${user} ${messages.userMuteMessage} ${time}`, 
        color: 'F04947', channel: 'Guild' 
      }), 
      this.minecraft.broadcastCleanEmbed({ 
        message: `${user} ${messages.userMuteMessage} ${time}`, 
        color: 'F04947', 
        channel: 'Logger' 
      })]
    }

    if (this.isUserUnmuteMessage(message)) {
      let user = message.replace(/\[(.*?)\]/g, '').trim().split(/ +/g)[3]
      return [ this.minecraft.broadcastCleanEmbed({
        message: `${user} ${messages.userUnmuteMessage}`, 
         color: '47F049', 
         channel: 'Guild' 
      }), 
      this.minecraft.broadcastCleanEmbed({ 
        message: `${user} ${messages.userUnmuteMessage}`, 
        color: '47F049', 
        channel: 'Logger' 
      })]
    }

    if (this.isSetrankFail(message)) {
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${messages.setrankFailMessage}`, 
        color: 'DC143C', 
        channel: 'Guild' 
      })
    }

    if (this.isGuildQuestCompletion(message)) { 
      this.minecraft.broadcastHeadedEmbed({ 
        title: guildQuestCompletion[0], 
        icon: `https://hypixel.paniek.de/guild/${config.minecraft.guildID}/banner.png`, 
        message: `${message}`,
        color: 'FFD700', 
        channel: 'Guild'
      })
    }

    if (this.isAlreadyMuted(message)) {
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${messages.alreadyMutedMessage}`, 
        color: 'DC143C', 
        channel: 'Guild' 
      })
    }

    if (this.isNotInGuild(message)) {
      let user = message.replace(/\[(.*?)\]/g, '').trim().split(' ')[0]
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${user} ${messages.notInGuildMessage}`, 
        color: 'DC143C', 
        channel: 'Guild' 
      })
    }

    if (this.isLowestRank(message)) {
      let user = message.replace(/\[(.*?)\]/g, '').trim().split(' ')[0]
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${user} ${messages.lowestRankMessage}`, 
        color: 'DC143C', 
        channel: 'Guild' 
      })
    }

    if (this.isAlreadyHasRank(message)) {
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${messages.alreadyHasRankMessage}`, 
        color: 'DC143C', 
        channel: 'Guild' })
    }

    if (this.isTooFast(message)) {
      return Logger.warnMessage(message)
    }

    if (this.isPlayerNotFound(message)) {
      let user = message.split(' ')[8].slice(1, -1)
      return this.minecraft.broadcastCleanEmbed({ 
        message: `${messages.playerNotFoundMessageFirst} ${user} ${messages.playerNotFoundMessageSecond}`, 
        color: 'DC143C',
        channel: 'Guild'
      })
    }

    if (this.isPartyMessage(message)) {
      console.log(message)
      this.minecraft.broadcastCleanEmbed({ 
        message: `${message}`, 
        color: 'DC143C', 
        channel: 'Guild' 
      })  
    }

    let parts = message.split(':')
    let group = parts.shift().trim()
    let hasRank = group.endsWith(']')
    let chat = message.split('>')
    let chatType = chat.shift().trim()
    let userParts = group.split(' ')
    let username = userParts[userParts.length - (hasRank ? 2 : 1)]
    let guildRank = userParts[userParts.length - 1].replace(/[\[\]]/g, '')
    const playerMessage = parts.join(':').trim()

    if (!this.isGuildMessage(message) && !this.isOfficerChatMessage(message)) return
    if (guildRank == username) guildRank = 'Member'
    if (this.isMessageFromBot(username)) return
    if (playerMessage.length == 0 || this.command.handle(username, playerMessage)) return
    if (playerMessage == '@') return

    if (config.console.debug) {
      this.minecraft.broadcastMessage({
        fullMessage: colouredMessage,
        message: 'debug_temp_message_ignore',
        chat: "debugChannel"
      }
    )}

    this.minecraft.broadcastMessage({
      fullMessage: colouredMessage,
      username: username,
      message: playerMessage,
      guildRank: guildRank,
      chat: chatType,
    })
    
  }

  isMessageFromBot(username) {
    return bot.username === username
  }

  isGuildMessage(message) {
    return message.startsWith('Guild >') && message.includes(':')
  }

  isOfficerChatMessage(message) {
    return message.startsWith('Officer >') && message.includes(':')
  }

  isGuildQuestCompletion(message) {
    return message.includes('GUILD QUEST TIER ') && message.includes('COMPLETED') && !message.includes(':')
  }

  isPartyMessage(message) {
    return message.startsWith('Party >')
  }

  isLoginMessage(message) {
    return message.startsWith('Guild >') && message.endsWith('joined.') && !message.includes(':')
  }

  isLogoutMessage(message) {
    return message.startsWith('Guild >') && message.endsWith('left.') && !message.includes(':')
  }

  isJoinMessage(message) {
    return message.includes('joined the guild!') && !message.includes(':')
  }

  isLeaveMessage(message) {
    return message.includes('left the guild!') && !message.includes(':')
  }

  isKickMessage(message) {
    return message.includes('was kicked from the guild by') && !message.includes(':')
  }

  isGuildTopMessage(message) {
    return message.includes('Guild Experience') && !message.includes(':')
  }
  isPartyMessage(message) {
    return message.includes('has invited you to join their party!') && !message.includes(':')
  }

  isGuildListMessage(message) {
    return message.includes('●') || message.includes(' -- ') && message.includes(' -- ') || message.startsWith('Online Members: ') || message.includes('Online Members: ') || message.startsWith('Total Members:') ||  message.startsWith('Guild Name:')
  }

  isPromotionMessage(message) {
    return message.includes('was promoted from') && !message.includes(':')
  }

  isDemotionMessage(message) {
    return message.includes('was demoted from') && !message.includes(':')
  }
  
  isRequestMessage(message) {
    return message.includes('has requested to join the Guild!')
  }

  isBlockedMessage(message) {
    return message.includes('We blocked your comment') && !message.includes(':')
  }

  isRepeatMessage(message) {
    return message == 'You cannot say the same message twice!'
  }

  isNoPermission(message) {
    return (message.includes('You must be the Guild Master to use that command!') || message.includes('You do not have permission to use this command!') || message.includes("I'm sorry, but you do not have permission to perform this command. Please contact the server administrators if you believe that this is in error.") || message.includes("You cannot mute a guild member with a higher guild rank!") || message.includes("You cannot kick this player!") || message.includes("You can only promote up to your own rank!") || message.includes("You cannot mute yourself from the guild!") || message.includes("is the guild master so can't be demoted!") || message.includes("is the guild master so can't be promoted anymore!")) && !message.includes(":")
  }

  isIncorrectUsage(message) {
    return message.includes('Invalid usage!') && !message.includes(':')
  }

  isOnlineInvite(message) {
    return message.includes('You invited') && message.includes('to your guild. They have 5 minutes to accept.') && !message.includes(':')
  }

  isOfflineInvite(message) {
    return message.includes('You sent an offline invite to') && message.includes('They will have 5 minutes to accept once they come online!') && !message.includes(':')
  }

  isFailedInvite(message) {
    return (message.includes('is already in another guild!') || message.includes('You cannot invite this player to your guild!') || (message.includes("You've already invited") && message.includes("to your guild! Wait for them to accept!")) || message.includes('is already in your guild!')) && !message.includes(':')
  }

  isUserMuteMessage(message) {
    return message.includes('has muted') && message.includes('for') && !message.includes(':')
  }

  isUserUnmuteMessage(message) {
    return message.includes('has unmuted') && !message.includes(':')
  }

  isGuildMuteMessage(message) {
    return message.includes('has muted the guild chat for') && !message.includes(':')
  }

  isGuildUnmuteMessage(message) {
    return message.includes('has unmuted the guild chat!') && !message.includes(':')
  }

  isSetrankFail(message) {
    return message.includes("I couldn't find a rank by the name of ") && !message.includes(':')
  }

  isAlreadyMuted(message) {
    return message.includes('This player is already muted!') && !message.includes(':')
  }

  isNotInGuild(message) {
    return message.includes(' is not in your guild!') && !message.includes(':')
  }

  isLowestRank(message) {
    return message.includes("is already the lowest rank you've created!") && !message.includes(':')
  }

  isAlreadyHasRank(message) {
    return message.includes('They already have that rank!') && !message.includes(':')
  }

  isTooFast(message) {
    return message.includes('You are sending commands too fast! Please slow down.') && !message.includes(':')
  }

  isPlayerNotFound(message) {
    return message.startsWith(`Can't find a player by the name of`)
  }
}

module.exports = StateHandler
