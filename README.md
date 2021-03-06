# Hypixel Discord Chat Bridge

A two-way chat bridge between [Hypixel](https://hypixel.net/) guild chat and a [Discord](https://discord.com/) channel. The application utilizes [discord.js v13](https://github.com/discordjs/discord.js) for communicating with Discord, and [Mineflayer](https://github.com/PrismarineJS/mineflayer) for communicating with Hypixel.

> This application will login to Hypixel using Mineflayer which is not a normal Minecraft client, this could result in your Minecraft account getting banned from Hypixel, so use this application at your own risk. I have been using same account over a year, so as long u don't do something sketchy you will not get banned.

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

#### Minecraft

The `prefix` is the command prefixed used for all the commands in the bot on the Discord side, by default this is set it `!`.

`guildID` is ID of the hypixel guild required for Hypixel API, `guildExp` is integer value required for `!gexp` command which is used for checking how much more Guild experience user has to collect to meet requirements of the guild.

`messageRepeatBypass` is ability to toggle bypass for users to use same command back to back without bot getting stopped by hypixel chat, I recommend you keep it on.

`messageRepeatBypassLength` is length of message which will be sent to bypass message repeat, I recommend you to keep it on at least 16.

#### Discord

The Discord options includes the `token`, `clientID`, `serverID`, `guildChatChannel`, `officerChannel`, `loggingChannel`, `commandRole`, `prefix`, `messageMode`, `joinMessage` and `filterMessages` options.

The `token` is the Discord application token, if you don't already have a Discord App, you can [create a new app](https://discordapp.com/developers), then convert the app to a Discord bot, and then get your Discord bot token on the "Bot" page.

The `clientID` is the Discord ID of the Discord Bot. First you have to enable Developer Mode which can be located inside Settings under Advanced tag, you can get Client ID by right clicking on discord bot and clicking Copy ID.

The `serverID` is same as `clientID` but it's ID of the server. you can get it by right clicking on server and clicking on Copy ID.

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

The `maxEventSize` is max length of message which can be logged. I recommend you not touching this unless u know what you are doing.

The `debug` is option to toggle logging all messags on discord, even public chat. This is useful for checking something but you can't get on the PC or you are lazy to launch minecraft.

The `debugChannel` is the ID of the text channel where the bot should send messages.

### API

The API options include information about APIs which are being used, the only one which needs to be changed are `hypixelAPIkey`, `antiSniperKey` and `imgurAPIkey`

You can receive Hypixel API key by joining Hypixel Network and typing `/api new` command.

AntiSniper key can be generated [Here](https://api.antisniper.net/)

Imgur API can be generated [Here](https://api.imgur.com/oauth2/addclient)

### Event

The Event options include various events which will be notified by bot 30 and 5 minutes before event starts. If you do not like one of the events just change value from `true` to `false`. There is also ability to toggle off bot notifier fully in `enabled` option

### Commands

`< >` = Required arguments, `[ ]` Optional arguments

`Discord`

- `/guildtop [integer]` - Top 10 members with the most guild experience.
- `/help` - Shows help menu
- `/override <command> [args]` - executes the string attached. This is a dangerous permission to grant
- `/invite <player>` - Invites the specified user to the guild, providing the guild isn't full
- `/kick <user> [reason]` - Kicks the specified user from the guild
- `/promote <user>` - Promotes the specified user by 1 rank
- `/demote <user>` - Demotes the specified user by 1 rank
- `/online` - View online player in the guild

`Minecraft`

- `!8ball <question>` - Ask an 8ball a question.
- `!armor [player]` - Renders armor of specified user.
- `!auction [player]` - Active Auctions of specified user.
- `!bedwars [player]` - BedWars stats of specified user.
- `!catacombs [player]` - Skyblock Dungeons Stats of specified user.
- `!accessories [player]` - Accessories of specified user.
- `!denick [player]` - Denick username of specified user.
- `!duels [player]` - Duel stats of specified user.
- `!fairysouls [player]` - Fairy Souls of specified user.
- `!fetchur` - Information about an item for Fetchur.
- `!guildexp [player]` - Guilds experience of specified user.
- `!help` - Shows help menu
- `!kitty` - Random image of cute cat.
- `!math <calculation>` - Calculate.
- `!namehistory [player]` - Name History of specified user.
- `!news` - Check latest Hypixel Network News.
- `!networth [player]` - Networth of specified user.
- `!pet [player]` - Renders active pet of specified user.
- `!render [player] [slot]` - Renders item of specified user.
- `!skills [player]` - Skills and Skill Average of specified user.
- `!skywars [player]` - Skywars stats of specified user.
- `!skyblock [player]` - Skyblock Stats of specified user.
- `!slayer [player] [type]` - Slayer of specified user.
- `!UHC [player]` - UHC Stats of specified user.
- `!weight [player]` - Skyblock Stats of specified user.

### Events Notifier

The bot also includes event notifier that can be used to send message in guild 30 & 5 minutes before the event starts, by the default all of the events are toggled on. Feel free to disable events which you do not like in config.

### Chat Triggers Module

If you think message format is boring You can check out my repository for ChatTriggers module which changes the way messages from Bot look like. [Click Here](https://github.com/DuckySoLucky/Hypixel-Guild-Chat-Format)

#### Frag Bot

The bot also includes an integrated frag bot that can be used for Hypixel Skyblock dungeons.

### To-Do List

*Grammar and other stuff might be broken, Im writing this more for myself so I dont forget ;-;*
- [x] Auto Guild Accept
  - Ability for bot to automatically accept invites if user meets requirements
- [ ] Auto Promote
  - Ability for bot to automatically promote player if he meets requirements
- [ ] Cannot send same message better handling
  - If you use bot in officer channel and u send same message it will send embed into guild chat channel instead of officer
- [x] `!ah [player]`
  - Show player's current auctions, useful while playing other hypixel games or dungeons
- [ ] Automatic API key grabber
  - Bot will automaticaly run `/api new` after joining hypixel and storing it info config
- [x] Rewriting Commands
  - Rewrite commands which aren't complex and can use Hypixel's offical API to make them faster
- [x] `/info` command
  - Shows bot uptime, ping and other useful information
- [x] Make some discord command client sided
  - Make some command visible only by executor
- [ ] `!analyzeparty [integer] [player]` command
  - Analyze past x games of player, and checks which players were in the same game as him. The players which were in his game the most are most likely in player's party. 
- [x] Linking System 
  - Players will have to link before using bridge bot, will be used for a lot of features like feature below
- [ ] Automatic guild kick
  - Bot will automatically kick everyone who do not meet requirements every x Days, player will receive discord DM x hours before getting kicked
- [x] Command Blacklist
  - Ability to blacklist someone from using commands 
- [ ] Fragbot Whitelist
  - Abiliy to make frag bot be used only by specified users or by guild members only
- [x] Clean a lot of code
  - As it says clean code, mostly minecraft to discord message part, It's pretty much copy pasted
- [x] `!winstreak` command
  - Send estimated winstreak of player which has Winstreak API off
- [ ] `!daily` and `!weekly` command
   - Show daily/weekly stats of specified user
- [x] `/uptime`
   - Send uptime of bridge bot
- [x] `/info`
   - Send information of bridge bot, like config information
- [x] Command Error Handler
   - Respond to guild chat if something goes wrong with command instead of just logging it in console
- [x] Clean code for Frag Bot
   - Clean code
- [x] Fix Guild Quest Message 
   - Broke in 2.0 release
- [x] Better Guild Requirements Handler
   - If input is -1, that means that option is disabled

## Powered by

- [AltPapier](https://github.com/Altpapier/hypixel-discord-guild-bridge)
- [DawJaw](https://dawjaw.net/jacobs)
- [Hypixel API Reborn](https://hypixel.stavzdev.me/#/)
- [Hypixel Skyblock Facade](https://hypixel-api.senither.com/)
- [Hypixel Network API](http://api.hypixel.net/)
- [MaroAPI](https://github.com/zt3h)
- [PlayerDB API](https://playerdb.co/)
- [SkyHelper API](https://github.com/Altpapier/SkyHelperAPI)
- [SkyShiiyu API](https://github.com/SkyCryptWebsite/SkyCrypt)
- [SlothPixel API](https://github.com/slothpixel)
- [Senither](https://github.com/Senither)
