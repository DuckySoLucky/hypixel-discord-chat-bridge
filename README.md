# Hypixel Discord Chat Bridge

## README is currently outdated, I will update it tomorrow

A two-way chat bridge between [Hypixel](https://hypixel.net/) guild chat and a [Discord](https://discord.com/) channel. The application utilizes [discord.js v13](https://github.com/discordjs/discord.js) for communicating with Discord, and [Mineflayer](https://github.com/PrismarineJS/mineflayer) for communicating with Hypixel.

> This application will login to Hypixel using Mineflayer which is not a normal Minecraft client, this could result in your Minecraft account getting banned from Hypixel, so use this application at your own risk. I have been using same account over a year, so as long u don't do something sketchy You will not get banned.

<hr>
 
## Table of Content

- [Installation using NodeJS](#NodeJS)
- [Installation using Docker](#Docker)
- [Commands](#Commands)
- [Configuration](#configuration)
- [To-Do List](#to-do-list)

## NodeJS

- Git
- NodeJS >= 14
- Yarn >= 1.2
- A Minecraft account

## Docker

- Git
- Docker >= 20
- A Minecraft account

_Older versions may also work, but have not been tested._

### Setup Guide

<hr>

### Configuration

#### Server

The server is the server the Minecraft client should connect to, by default it will point to Hypixels server so it can be left as-is if the plan is to use the app for Hypixel guild chat, if not then the `host` is the servers IP or hostname, and the `port` is the port the server is running on.

> Note: The port must be a number, Mineflayer expects an integer so you can't wrap the port in quotes or Mineflayer won't create a connection to the Minecraft server.

#### Minecraft

The minecraft section includes a `username` and `password` option, if using a Mojang account these should be filled out with your Mojang username and password for the Minecraft account you plan on using, your Minecraft username is most likely the email it was created with.
If using with a microsoft account change `accountType` to `microsoft`, `username` and `password` are not required and will be left blank as you will be directed to the [Microsoft Link page](https://www.microsoft.com/link).

The `prefix` is the command prefixed used for all the commands in the bot on the Discord side, by default this is set it `!`.

`guildID` is ID of the hypixel guild required for Hypixel API, `guildExp` is integer value required for `!gexp` command which is used for checking how much more Guild experience user has to collect to meet requirements of the guild.

`messageRepeatBypass` is ability to toggle bypass for users to use same command back to back without bot getting stopped by hypixel chat, I recommend you keep it on.

`messageRepeatBypassLength` is length of message which will be sent to bypass message repeat, I recommend You to keep it on at least 16.

#### Discord

The Discord options includes the `token`, `clientID`, `serverID`, `guildChatChannel`, `officerChannel`, `loggingChannel`, `commandRole`, `prefix`, `messageMode`, `joinMessage` and `filterMessages` options.

The `token` is the Discord application token, if you don't already have a Discord App, you can [create a new app](https://discordapp.com/developers), then convert the app to a Discord bot, and then get your Discord bot token on the "Bot" page.

The `clientID` is the Discord ID of the Discord Bot. First You have to enable Developer Mode which can be located inside Settings under Advanced tag, You can get Client ID by right clicking on discord bot and clicking Copy ID.

The `serverID` is same as `clientID` but it's ID of the server. You can get it by right clicking on server and clicking on Copy ID.

The `guildChatChannel` is the ID of the text channel the bot should be linked with, the bot will only send and listen to messages in the channel defined in the config.

The `officerChannel` is the ID of the text channel the bot should be linked with for the Officer Chat, the bot will only send and listen to messages in the channel defined in the config.

The `loggingChannel` is the ID of the text channel the bot should be linked with for the Logging Chat, the bot will only send and listen to guild managment stuff like kicks, mutes, promotions, demotions..

The `commandRole` is the ID of any role on the server the bot is hosted for, any user with the role will be able to run all the Discord commands built into the bot, like `/kick` and `/promote`.

> Note: Any user can run the `/online` and `/guildtop` commands, however all the other commands requires the user has the command role.

The `messageMode` can either be `bot`, `webhook` or `minecraft`. This selects how the messages should be displayed when sent from Minecraft to Discord. If webhook mode is selected the bot requires the `Manage Webhooks` permission in the channel it's running in. The bot always requires the `Send Messages` and `View Channel` permissions in the channel you're using it in.

- [View Webhook example](https://imgur.com/DttmVtQ)
- [View Bot Mode example](https://imgur.com/WvRAeZc)
- [View Minecraft Mode example](https://imgur.com/MAAMpiT)

> Note - The Discord rate limit for webhooks is 30 requests every 60 seconds, whereas for normal bot messages it's 5 messages every 5 seconds. Using webhooks effectively halves the number of messages the bot can send per minute which may cause issues in an active guild.

The filterMessage is ability to toggle filtering messages. This should be set to `false` otherwise bot might get banned.

The joinMessage is ability to toggle join and leave message being sent to the discord channel. This should be set to `false` in an inactive guilds since messages can be spammy.

### Console

The Discord options includes the `maxEventSize`, `debug`, and `debugChannel` options.

The `maxEventSize` is max length of message which can be logged. I recommend you not touching this unless u know what You are doing.

The `debug` is option to toggle logging all messags on discord, even public chat. This is useful for checking something but You can't get on the PC or You are lazy to launch minecraft.

The `debugChannel` is the ID of the text channel where the bot should send messages.

### Commands

`< >` = Required arguments, `[ ]` Optional arguments

`Discord`

- `/guildtop [integer]` - Top 10 members with the most guild experience.
- `/override <command> [args]` - executes the string attached. This is a dangerous permission to grant
- `/invite <player>` - Invites the specified user to the guild, providing the guild isn't full
- `/kick <user> [reason]` - Kicks the specified user from the guild
- `/promote <user>` - Promotes the specified user by 1 rank
- `/demote <user>` - Demotes the specified user by 1 rank
- `/online` - View online player in the guild

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

- [ ] Event Notifier
  - Ability for bot to send messages 24/12/6/1/0.15 hours before Skyblock event starts.
- [ ] Auto Guild Accept and Promote
  - Ability for bot to automatically promote and accept invites.
- [ ] Translate command
  - Ability for bot to translate message from one language to another.
- [ ] Drop Chance Command
  - Ability for player to run command and see drop chance of an item, will use Official Hypixel Network Wiki for Skyblock.

## Powered by

- [AltPapier](https://github.com/Altpapier/hypixel-discord-guild-bridge)
- [Hypixel Network API](http://api.hypixel.net/)
- [Hypixel API Reborn](https://hypixel.stavzdev.me/#/)
- [MaroAPI](https://github.com/zt3h)
- [PlayerDB API](https://playerdb.co/)
- [SkyHelper API](https://github.com/Altpapier/SkyHelperAPI)
- [SkyShiiyu API](https://github.com/SkyCryptWebsite/SkyCrypt)
- [Senither](https://github.com/Senither)
