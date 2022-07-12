# Hypixel Discord Chat Bridge

A two-way chat bridge between [Hypixel](https` -//hypixel.net/) guild chat and a [Discord](https` -//discord.com/) channel. The application utilizes [Discord.js-light](https` -//github.com/timotejroiko/discord.js-light) for communicating with Discord, and [Mineflayer](https` -//github.com/PrismarineJS/mineflayer) for communicating with Hypixel.

> This application will login to Hypixel using Mineflayer which is not a normal Minecraft client, this could result in your Minecraft account getting banned from Hypixel, so use this application at your own risk.

<hr>
 
## Table of Content

- [Installation using NodeJS](#installation-using-nodejs)
  - [Prerequisites](#prerequisites) 
- [Installation using Docker](#installation-using-docker)
  - [Prerequisites](#prerequisites-1)
- [Configuration](#configuration)
- [To-Do List](#to-do-list)

## Installation using NodeJS

### Prerequisites

- Git
- NodeJS >= 14
- Yarn >= 1.2
- A Minecraft account

## Installation using Docker

### Prerequisites

- Git
- Docker >= 20
- A Minecraft account

_Older versions may also work, but have not been tested._

### Setup Guide

### Configuration

#### Server

The server is the server the Minecraft client should connect to, by default it will point to Hypixels server so it can be left as-is if the plan is to use the app for Hypixel guild chat, if not then the `host` is the servers IP or hostname, and the `port` is the port the server is running on.

> Note` - The port must be a number, Mineflayer expects an integer so you can't wrap the port in quotes or Mineflayer won't create a connection to the Minecraft server.

#### Minecraft

The minecraft section includes a `username` and `password` option, if using a Mojang account these should be filled out with your Mojang username and password for the Minecraft account you plan on using, your Minecraft username is most likely the email it was created with. 
If using with a microsoft account change `accountType` to `microsoft`, `username` and `password` are not required and will be left blank as you will be directed to the [Microsoft Link page](https://www.microsoft.com/link). 

`guildID` is ID of the hypixel guild required for Hypixel API, `guildExp` is integer value required for `!gexp` command which is used for checking how much more Guild experience user has to collect to meet requirements of the guild. 

`messageRepeatBypass` is ability to toggle bypass for users to use same command back to back without bot getting stopped by hypixel chat, I recommend you keep it on. 

`messageRepeatBypassLength` is length of message which will be sent to bypass message repeat, I recommend You to keep it on at least 16.

#### Discord

The Discord options includes the `token`, `guildChatChannel`, `officerChannel`, `loggingChannel`, `commandRole`, `prefix`, `messageMode`, `joinMessage` and `filterMessages` options.

The `token` is the Discord application token, if you don't already have a Discord App, you can [create a new app](https://discordapp.com/developers), then convert the app to a Discord bot, and then get your Discord bot token on the "Bot" page.

The `guildChatChannel` is the ID of the text channel the bot should be linked with, the bot will only send and listen to messages in the channel defined in the config.

The `officerChannel` is the ID of the text channel the bot should be linked with for the Officer Chat, the bot will only send and listen to messages in the channel defined in the config.

The `loggingChannel` is the ID of the text channel the bot should be linked with for the Logging Chat, the bot will only send and listen to guild managment stuff like kicks, mutes, promotions, demotions..

The `commandRole` is the ID of any role on the server the bot is hosted for, any user with the role will be able to run all the Discord commands built into the bot, like `!kick` and `!relog`.

> Note` - Any user can run the `!help`, `!online` and `!guildtop` commands, however all the other commands requires the user has the command role.

The `prefix` is the command prefixed used for all the commands in the bot on the Discord side, by default this is set it `!`.

The `messageMode` can either be `bot` or `webhook`. This selects how the messages should be displayed when sent from Minecraft to Discord. If webhook mode is selected the bot requires the `Manage Webhooks` permission in the channel it's running in. The bot always requires the `Send Messages` and `View Channel` permissions in the channel you're using it in.

- [View Webhook example](https://imgur.com/)
- [View Bot Mode example](https://imgur.com/)

> Note` - The Discord rate limit for webhooks is 30 requests every 60 seconds, whereas for normal bot messages it's 5 messages every 5 seconds. Using webhooks effectively halves the number of messages the bot can send per minute which may cause issues in an active guild.

The filterMessage is ability to toggle filtering messages. This should be set to `false` otherwise bot might get banned.

The joinMessage is ability to toggle join and leave message being sent to the discord channel. This should be set to `false` in an inactive guilds since messages can be spammy. 

### Commands

`< >` = Required arguments, `[ ]` Optional arguments

`Discord`

- `!help` - Displays the list of commands
- `!guildtop [integer]` - Top 10 members with the most guild experience.
- `!relog [delay]` - Relogs the MC client, a delay can be given in seconds, if no delay is given it will default to 5 seconds
- `!override <command> [args]` - Executes the string attached. This is a dangerous permission to grant 
- `!invite <player>` - Invites the specified user to the guild, providing the guild isn't full 
- `!kick <user> [reason]` - Kicks the specified user from the guild 
- `!promote <user>` - Promotes the specified user by 1 rank 
- `!demote <user>` - Demotes the specified user by 1 rank 
- `!online` - View online player in the guild

`Minecraft` 

- `!8ball <question>` - Ask an 8ball a question.
- `!fairysouls [player]` - Fairy Souls of specified user.
- `!UHC [player]` - UHC Stats of specified user.
- `!accessories [player]` - Accessories of specified user.
- `!bedwars [player]` - BedWars stats of specified user.
- `!catacombs [player]` - Skyblock Dungeons Stats of specified user.
- `!denick [player]` - Denick username of specified user.
- `!duels [player]` - Duel stats of specified user.
- `!fetchur` - Information about an item for Fetchur.
- `!guildexp [player]` - Guilds experience of specified user.
- `!help` - Shows help menu
- `!kitty` - Random image of cute cat.
- `!math <calculation>` - Calculate.
- `!namehistory [player]` - Name History of specified user.
- `!networth [player]` - Networth of specified user.
- `!skills [player]` - Skills and Skill Average of specified user.
- `!skywars [player]` - Skywars stats of specified user.
- `!skyblock [player]` - Skyblock Stats of specified user.
- `!news` - Check latest Hypixel Network News.
- `!slayer [player] [type]` - Slayer of specified user.
- `!weight [player]` - Skyblock Stats of specified user.


### To-Do List

- [ ] 2.0 Release
  - Rewrite whole code with usage of discordjs v13 and slash commands.

## Powered by
- [Senither](https://github.com/Senither)
- [Hypixel Network API](http://api.hypixel.net/)
- [Hypixel API Reborn](https://hypixel.stavzdev.me/#/)
- [PlayerDB API](https://playerdb.co/)
- [SkyHelper API](https://github.com/Altpapier/SkyHelperAPI)
- [SkyShiiyu API](https://github.com/SkyCryptWebsite/SkyCrypt)
- [MaroAPI](https://github.com/zt3h)

