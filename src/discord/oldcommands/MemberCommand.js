const DiscordCommand = require('../../contracts/DiscordCommand')

const config = require("../../../config.json");
const axios = require("axios");
async function getUUIDFromUsername(username) {
  if (!(/^[a-zA-Z0-9_]{2,16}$/mg.test(username))) {
    return "Error"
  }
  else {
    const { data } = await axios.get('https://api.mojang.com/users/profiles/minecraft/' + username)
    let uuid = data.id
    let user = username
    return data.id
  }
}
async function getGMemberFromUUID(uuid) {
  try {
    if (uuid == undefined){
      uuid = "a"
    }
    const { data } = await axios.get(`https://api.hypixel.net/v2/guild?key=${config.minecraft.API.hypixelAPIkey}&player=` + uuid)
    try {
      if (data.guild.name_lower != "bakacord") {
        let ret = "This player is not in our guild."
        return ret
      }
    }
    catch {
      let ret = "Please confirm the name of the player you're trying to look up."
      return ret
    }
    if (data.guild.name_lower != "bakacord") {
      let ret = "This player is not in our guild."
      return ret
    }
    else {
      let targetUUID
      targetUUID = uuid
      let name
      for (i = 0; i < data.guild.members.length; i++) {
        if (data.guild.members[i].uuid == targetUUID) {
          let rank = data.guild.members[i].rank
          let joined = data.guild.members[i].joined
          joined = new Date(joined).toLocaleString()
          let newData = data.guild.members[i];
          let expTime = Object.keys(newData.expHistory)
          let expValue = Object.values(newData.expHistory)
          let date
          let expTime0 = expTime[0].toString()
          date = new Date(expTime0)
          expTime0 = Math.floor(date.getTime() / 1000)
          expTime0 = `Today`
          let expTime1 = expTime[1].toString()
          date = new Date(expTime1)
          expTime1 = Math.floor(date.getTime() / 1000)
          expTime1 = `Yesterday`
          let expTime2 = expTime[2].toString()
          date = new Date(expTime2)
          expTime2 = Math.floor(date.getTime() / 1000)
          expTime2 = `2 days ago`
          let expTime3 = expTime[3].toString()
          date = new Date(expTime3)
          expTime3 = Math.floor(date.getTime() / 1000)
          expTime3 = `3 days ago`
          let expTime4 = expTime[4].toString()
          date = new Date(expTime4)
          expTime4 = Math.floor(date.getTime() / 1000)
          expTime4 = `4 days ago`
          let expTime5 = expTime[5].toString()
          date = new Date(expTime5)
          expTime5 = Math.floor(date.getTime() / 1000)
          expTime5 = `5 days ago`
          let expTime6 = expTime[6].toString()
          date = new Date(expTime6)
          expTime6 = Math.floor(date.getTime() / 1000)
          expTime6 = `6 days ago`
          let expValue0 = expValue[0].toString()
          let expValue1 = expValue[1].toString()
          let expValue2 = expValue[2].toString()
          let expValue3 = expValue[3].toString()
          let expValue4 = expValue[4].toString()
          let expValue5 = expValue[5].toString()
          let expValue6 = expValue[6].toString()

          let total = expValue[0] + expValue[1] + expValue[2] + expValue[3] + expValue[4] + expValue[5] + expValue[6]

          ret = `Rank: ${rank}; Member since: ${joined};; EXP Gained this week:;- ${expTime0}: ${expValue0} EXP;- ${expTime1}: ${expValue1} EXP;- ${expTime2}: ${expValue2} EXP;- ${expTime3}: ${expValue3} EXP;- ${expTime4}: ${expValue4} EXP;- ${expTime5}: ${expValue5} EXP;- ${expTime6}: ${expValue6} EXP;; Total EXP: ${total} EXP`
          return ret
        }

      }

    }
  }
  catch (error) {
    return `[ERROR] ${error.response.data.reason}`
  }
}
async function getGMemberFromUsername(username) {
  return await getGMemberFromUUID(await getUUIDFromUsername(username))
}
class MemberCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)
    this.permission = "all"

    this.name = 'member'
    this.description = 'Returns Guild Top EXP from specified day'
  }

  onCommand(message) {
    let args = this.getArgs(message)
    let user = args.shift()
    getGMemberFromUsername(user).then(ret => {
      if(ret.includes("[ERROR]")){
        message.channel.send({
          embeds: [{
            description: `${ret}`,
            color: 0x47F049
          }]
        })
      }
      else if (ret.toString().includes("Please confirm the name of the player you're trying to look up.")) {
        message.channel.send({
          embeds: [{
            description: `${ret.replaceAll(";", "\n")}`,
            color: 0x47F049
          }]
        })
      }
      else if (ret.toString().includes("This player is not in our guild.")) {
        message.channel.send({
          embeds: [{
            description: `${ret.replaceAll(";", "\n")}`,
            color: 0x47F049
          }]
        })
      }
      else {
        message.channel.send({
          embeds: [{
            description: `${user}'s guild stats:\n ${ret.replaceAll(";", "\n")}`,
            color: 0x47F049
          }]
        })
      }

    })
  }
}
module.exports = MemberCommand