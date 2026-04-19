const DiscordCommand = require('../../contracts/DiscordCommand')

const config = require("../../../config.json");
const fs = require('fs');

function splitArrayThreeWays(arr) {
  const len = arr.length;
  const partSize1 = Math.ceil(len / 4);
  const partSize2 = Math.ceil((len - partSize1) / 3);
  const partSize3 = Math.ceil((len - partSize1 - partSize2) / 2);
  
  const firstPart = arr.slice(0, partSize1);
  const secondPart = arr.slice(partSize1, partSize1 + partSize2);
  const thirdPart = arr.slice(partSize1 + partSize2, partSize1 + partSize2 + partSize3);
  const fourthPart = arr.slice(partSize1 + partSize2 + partSize3);

  return [firstPart, secondPart, thirdPart, fourthPart];
}
const { version } = require('../../../package.json')

class HelpCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)
    this.permission = "all"
    this.name = 'help'
    this.aliases = ['h', 'info']
    this.description = 'Shows this help menu'
  }

  onCommand(message) {

    let discordCommands = []
    let minecraftCommands = []
    let staffCommands = []
    this.discord.messageHandler.oldcommand.oldcommands.forEach(command => {
      if(command.permission != "all"){
        staffCommands.push(`\`!${command.name}\`: ${command.description}\n`)
      }
      else{
        discordCommands.push(`\`!${command.name}\`: ${command.description}\n`)
      }
    })

    this.discord.app.minecraft.chatHandler.command.commands.forEach(command => {
      minecraftCommands.push(`\`!${command.name}\`: ${command.description}\n`)
    })
    let splitMC = splitArrayThreeWays(minecraftCommands)
    let dcMid = discordCommands.length / 2
    const dcFirstHalf = discordCommands.slice(0, dcMid);
    const dcSecondHalf = discordCommands.slice(dcMid);

    let args = this.getArgs(message)
    let user = args.shift()
    if(!user){
      message.channel.send({
        embeds: [{
          title: 'Bridge Commands',
          description: 'Chat with people in-game and gain access to a variety of commands to use!\n\n',
          fields: [
            {
              name: 'For discord commands',
              value: "Do the following command: `!help discord`"
            },
            {
              name: 'For minecraft commands',
              value: "Do the following command: `!help minecraft`"
            },
            {
              name: 'For slash commands',
              value: "Do the following command: `/help`"
            },
            {
              name: `Info`,
              value: [
                `Prefix: \`${config.discord.commands.prefix}\``,
                `Guild Channel: <#${config.discord.channels.guildChatChannel}>`,
                `Command Role: <@&${config.discord.commands.commandRole}>`,
              ].join('\n'),
            },
          ],
          color: 0x2eebf4,
          footer: {
            text: 'Made by Azael'
          },
          timestamp: new Date()
        }], 
      })
    }
    else if (user.toLowerCase()=="discord"){
      message.channel.send({
        embeds: [{
          title: 'Bridge Commands',
          description: 'Chat with people in-game and gain access to a variety of commands to use!\n\n',
          fields: [
            {
              name: 'Discord Commands #1',
              value: `These commands can only be used in this channel.\n\n${dcFirstHalf.join("")}`
            },
            {
              name: 'Discord Commands #2',
              value: `${dcSecondHalf.join("")}`
            },
            {
              name: `Info`,
              value: [
                `Prefix: \`${config.discord.commands.prefix}\``,
                `Guild Channel: <#${config.discord.channels.guildChatChannel}>`,
                `Command Role: <@&${config.discord.commands.commandRole}>`,
              ].join('\n'),
            },
          ],
          color: 0x2eebf4,
          footer: {
            text: 'Made by Azael'
          },
          timestamp: new Date()
        }], 
      })
    }
    else if(user.toLowerCase()=="minecraft"){
      message.channel.send({
        embeds: [{
          title: 'Bridge Commands',
          description: 'Chat with people in-game and gain access to a variety of commands to use!\n\n',
          fields: [
            {
              name: 'Minecraft Commands #1',
              value: `These commands can only be used through guild chat in-game.\n\n${splitMC[0].join("")}`
            },
            {
              name: 'Minecraft Commands #2',
              value: `${splitMC[1].join("")}`
            },
            {
              name: 'Minecraft Commands #3',
              value: `${splitMC[2].join("")}`
            },
            {
              name: 'Minecraft Commands #4',
              value: `${splitMC[3].join("")}`
            },
            {
              name: `Info`,
              value: [
                `Prefix: \`${config.discord.commands.prefix}\``,
                `Guild Channel: <#${config.discord.channels.guildChatChannel}>`,
                `Command Role: <@&${config.discord.commands.commandRole}>`,
              ].join('\n'),
            },
          ],
          color: 0x2eebf4,
          footer: {
            text: 'Made by Azael'
          },
          timestamp: new Date()
        }], 
      })
    }
    return
/*     message.channel.send({
      embeds: [{
        title: 'Bridge Commands',
        description: 'Chat with people in-game and gain access to a variety of commands to use!\n\n',
        fields: [
          {
            name: 'Discord Commands',
            value: `These commands can only be used in this channel.\n\n\`!help\`: Shows the entire bot's commands list.\n\`!top:\` Shows Top Guild EXP from the specified day.\n\`!online (!on)\`: Shows a list of guild members online.\n\`!stalk\`: Shows a specified player's location in Hypixel.\n\`!seen\`: Shows when a specified player was last online.\n\`!stats\`: Shows a specified player's general stats in SkyBlock.\n\`!skills\`: Shows a player's skills in SkyBlock.\n\`!cata\`: Shows a player's Dungeon stats.\n\`!contest\`: Tells you when the next Jacob's Contest is\n\`!networth (!nw)\`: Shows a player's networth.\n\`!render\`: Sends specified slots item to discord and in game with a renderer.`
          },
          {
            name: 'Minecraft Commands',
            value: `These commands can only be used through guild chat in-game.\n\n> **!claim**: Claim guild ranks based on player stats.\n> Refer to <#728262623354683473> for rank requirements.\n\n\`!stats\`: Shows a player's general stats in SkyBlock.\n\`!skills\`: Shows a player's skills in SkyBlock.\n\`!cata\`: Shows a player's Dungeon stats.\n\`!slayer\`: Shows a player's Slayer stats.\n\`!networth (!nw)\`: Shows a player's networth.\n\`!math\`: Calculation command.\n\`!ping\`: Replies with Pong! to the user.\n\`!seen\`: Shows a specified player's last logout date.\n\`!stalk\`: Shows a specified player's location in Hypixel.\n\`!seen\`: Shows a specified player's last logout date.\n\`!translate (!trans)\`: Translate text in different languages\n\`!farmhelper (!fh)\`: Tells you perfect speed to farm the specified crop\n\`!contest\`: Tells you when the next Jacob's Contest is\n\`!render\`: Sends specified slots item to discord and in game with a renderer.`
          },
          {
            name: 'Staff Commands',
            value: `These commands can only be used by staff members.\n\n\`!invite\`: Invites players to the guild.\n\`!setrank\`: Promote or Demote members to a rank.\n\`!kick\`: Kicks a player from the guild\n\`!mute\`: Mutes a player for a specified amount of time\n\`!unmute\`: Unmutes a player from the specified amount of time.\n\`!member\`: Shows weekly Guild EXP of a specified member.\n\`!relog\`: Reboots the bot's minecraft client.\n\`!kickinactive\`: Kicks people who have not logged on for 25 days.`
          },
          {
            name: `Info`,
            value: [
              `Prefix: \`${this.discord.app.config.discord.prefix}\``,
              `Guild Channel: <#${this.discord.app.config.discord.channel}>`,
              `Command Role: <@&${this.discord.app.config.discord.commandRole}>`,
            ].join('\n'),
          },
        ],
        color: 0x2eebf4,
        footer: {
          text: 'Made by Azael & Yonko'
        },
        timestamp: new Date()
      }], 
    }) */
  }
}

module.exports = HelpCommand
