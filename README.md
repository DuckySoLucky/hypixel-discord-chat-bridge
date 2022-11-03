# Hypixel Discord Chat Bridge

<img src="https://img.shields.io/github/contributors/DuckySoLucky/hypixel-discord-chat-bridge?color=success&style=for-the-badge"> <img src="https://img.shields.io/github/stars/DuckySoLucky/hypixel-discord-chat-bridge?color=success&style=for-the-badge"> <img src="https://img.shields.io/github/forks/DuckySoLucky/hypixel-discord-chat-bridge?color=success&style=for-the-badge"> <img src="https://img.shields.io/tokei/lines/github/DuckySoLucky/hypixel-discord-chat-bridge?color=success&style=for-the-badge"> <img src="https://img.shields.io/github/repo-size/DuckySoLucky/hypixel-discord-chat-bridge?color=success&style=for-the-badge"> <img src='https://img.shields.io/github/commit-activity/m/DuckySoLucky/hypixel-discord-chat-bridge?color=success&style=for-the-badge'>

A two-way chat bridge between [Hypixel](https://hypixel.net/) guild chat and a [Discord](https://discord.com/) channel. The application utilizes [discord.js v13](https://github.com/discordjs/discord.js) for communicating with Discord, and [Mineflayer](https://github.com/PrismarineJS/mineflayer) for communicating with Hypixel.

> ⚠️This application will login to Hypixel using Mineflayer which is not a normal Minecraft client, this could result in your Minecraft account getting banned from Hypixel, so use this application at your own risk. I have been using same account over a year, so as long u don't do something sketchy you will not get banned.

<hr>

## Table of Content

- [Installation using NodeJS](#NodeJS)
- [Installation guide for Git](#installation-guide-for-git)
- [Installation guide for NodeJS](#installation-guide-for-nodejs)
- [Installation using Docker](#Docker)
- [Commands](#Commands)
  - [Commands for Discord](#discord-commands)
  - [Commands for Minecraft](#minecraft-commands)
- [Configuration](#configuration)
- [To-Do List](#to-do-list)

## NodeJS

- Git [Install Guide](#installation-guide-for-git)
- NodeJS >= 16.9 [Install Guide](#installation-guide-for-nodejs)
- A Minecraft account

### Installation guide for Git

[More in depth guide](guides/git.md)

To get started, download git [from this link](https://git-scm.com/downloads) by selecting the operating system you are using.

Once the installer is downloaded, run it and follow the instructions.
Leave most of the settings as default

Then go onto the next step of [installing NodeJS](#installing-nodejs).

### Installation guide for NodeJS

[More in depth guide](guides/NodeJS.md)

To get started, download NodeJS [from this link](https://nodejs.org/en/download/) by selecting the operating system you are using.

Once the installer is downloaded, run it and follow the instructions.
Leave most of the settings as default

Then go onto the next step of [Setup for NodeJS](#setup-guide-for-nodejs).

### Setup Guide for NodeJS

To get started, clone down the repository using:

    git clone https://github.com/DuckySoLucky/hypixel-discord-chat-bridge.git

Next go into the `hypixel-discord-chat-bridge` folder and install all the dependencies using NPM.

    npm i

While the dependencies are being installed you edit the configuration file. To edit the configuration file, open the `config-EXAMPLE.json` file in your favorite text editor. The configuration file is pretty self explanatory, but if you need help with it, you can check out the [Configuration](#configuration) section. Once you are done editing the configuration file, save it and rename it to `config.json`.

Once edited and the dependencies are installed, you can start the application using:

    node index.js

Using the link provided in the console, you sign into the minecraft account that you want to use.

## Docker

- Git
- Docker >= 20<br>
_Older versions may also work, but have not been tested._
- A Minecraft account

### Setup Guide for Docker

## Configuration

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

The `loggingChannel` is the ID of the text channel the bot should be linked with for the Logging Chat, the bot will only send and listen to guild managment stuff like kicks, mutes, promotions, demotions etc.

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

The API options include information about APIs which are being used, the only one which needs to be changed are `hypixelAPIkey`, `antiSniperKey` and `imgurAPIkey`.

You can receive Hypixel API key by joining Hypixel Network and typing `/api new` command.

AntiSniper key can be generated [Here](https://api.antisniper.net/).

Imgur API can be generated [Here](https://api.imgur.com/oauth2/addclient).

### Event

The Event options include various events which will be notified by bot 30 and 5 minutes before event starts. If you do not like one of the events just change value from `true` to `false`. There is also ability to toggle off bot notifier fully in `enabled` option

### Guild Requirements

The bot also includes automatic guild accept if the user meets requirements. The requirements are set in the config.json, is requirement's value is 0 or below 0, it will not be accounted.

`enabled` is option, should it check requirements of person who tries to join Guild or not. If this is enabled, request will be sent to the Logging Channel on the discord.

`autoAccept` is option to enable automatic Guild accept or not, if the user meets requirements he will be automatically accepted by the bot.

`requirements` option has suboptions, which are requirements.

### Commands

`< >` = Required arguments, `[ ]` = Optional arguments

#### Discord Commands

- `/blacklist [player]` - Blacklists specified user from using bot.
- `/demote [player]` - Demotes the given user by one guild rank.
- `/guildtop [integer]` - Top 10 members with the most guild experience.
- `/help` - Shows help menu.
- `/info` - Shows information about bot.
- `/invite <player>` - Invites the specified user to the guild.
- `/kick <user> <reason>` - Kicks the specified user from the guild.
- `/mute <user> <time>` - Mutes the given user for a given amount of time.
- `/online` - View online player in the guild.
- `/override <command>` - Executes commands as the minecraft bot.
- `/ping` - Shows the latency of the bot.
- `/promote <user>` - Promotes the specified user by 1 rank.
- `/unmute <user>` - Unmutes the given user.
- `/uptime` - Shows the uptime of the bot.

#### Minecraft Commands

`< >` = Required arguments, `[ ]` = Optional arguments
|Command|Feature|Aliases|Syntax|Example|Response|
|--|--|--|--|--|--|
|`8ball` | Ask an 8ball a question | `8b` | `!8ball <question>` | !8ball is DuckySoLucky Hot? | [Example](https://i.imgur.com/mLyICsX.jpeg)
|`accessories` | Accessories of specified user | `talismans, talisman` | `!accessories [player]` | !accessories | [Example](https://i.imgur.com/0E3lMwc.jpg)
|`armor` | Renders armor of specified user | `None` | `!armor [player]` | !Armour SpookyKath | [Example](https://i.imgur.com/enFiSct.jpg)
|`auction` | Active Auctions of specified user | `ah, auctions` | `!auction [player]` | !auction | [Example](imgurLinkWhen)
|`bedwars` | BedWars stats of specified user | `bws, bw` | `!bedwars [player]` | !bedwars | [Example](https://i.imgur.com/CKjLKMs.jpg)
|`calculate` | Calculate any kind of math problem | `calc, math` | `!calculate <calculation>` | !math 1+1 | [Example](imgurLinkWhen)
|`catacombs` | Skyblock Dungeons Stats of specified user | `cata, dungeons` | `!catacombs [player]` | !dungeons | [Example](https://i.imgur.com/RoRSo8Q.jpg)
|`daily` | Shows your daily stats for bedwars | `None` | `!daily <player>` | !daily SpookyKath | [Example](imgurLinkWhen)
|`denick` | Denick username of specified user | `unnick` | `!denick <player> [mode]` | !denick Jediiii | [Example](https://i.imgur.com/XTjg0CX.jpg)
|`duels` | Duel stats of specified user | `duel` | `!duels [player]` | !duels | [Example](imgurLinkWhen)
|`equipment` | Renders equipment of specified user | `None` | `!equipment [player]` | !equipment | [Example](imgurLinkWhen)
|`fairysouls` | Fairy Souls of specified user | `fs` | `!fairysouls [player]` | !fairysouls |[Example](imgurLinkWhen)
|`fetchur` | Information about an item for Fetchur | `None` | `!fetcher` | !fetcher | [Example](imgurLinkWhen)
|`findnick` | Information about an item for Fetchur | `whonick, fnick` | `!findnick <player>` | !findnick SpookyBurger | [Example](imgurLinkWhen)
|`guild` | Look up a guild based on its name | `g` | `!guild <guildName>` | !guild Felony | [Example](imgurLinkWhen)
|`guildexp` | Guilds experience of specified user  | `gexp, gxp`| `!guildexp [player]` | !guildexp | [Example](imgurLinkWhen)
|`go` | Look up a guild based on a players ign | `guildof` | `!go <player>` | !go SpookyKath | [Example](imgurLinkWhen)
|`help` | Shows help menu | `None` | `!help` | !help | [Example](imgurLinkWhen)
|`kitty` | Random image of cute cat | `None` | `!kitty` | !kitty | [Example](imgurLinkWhen)
|`monthly` | Shows your monthly stats for bedwars | `None` | `!monthly <player>` | !monthly SpookyKath | [Example](imgurLinkWhen)
|`networth` | Networth of specified user | `nw` | `!networth [player]` | !networth | [Example](imgurLinkWhen)
|`pet` | Renders active pet of specified user | `pets` | `!pet [player]` | !pet | [Example](imgurLinkWhen)
|`register` | registers your ign into the database for !daily/weekly/monthly | `None` | `!register <player>` | !register Spookykath | [Example](imgurLinkWhen)
|`render` | Renders item of specified user | `inventory, inv, i` | `!render [player] [slot]` | !redner SpookyKath 1 | [Example](imgurLinkWhen)
|`skills` | Skills and Skill Average of specified user | `skill` | `!skills [player]` | !skills | [Example](imgurLinkWhen)
|`skyblock` | Skyblock Stats of specified user | `sb, stats` | `!skyblock [player]` | !skyblock | [Example](imgurLinkWhen)
|`skywars` | Skywars stats of specified user | `sw` | `!skywars [player]` | !skywars | [Example](imgurLinkWhen)
|`slayer` | Slayer of specified user | `slayers` | `!slayer [player] [type]` | !slayer | [Example](imgurLinkWhen)
|`UHC` | UHC Stats of specified user | `None` | `!uhc [player]` | !uhc | [Example](imgurLinkWhen)
|`weekly` | Shows your weekly stats for bedwars | `None` | `!weekly <player>` | !weekly SpookyKath | [Example](imgurLinkWhen)
|`weight` | Skyblock Stats of specified user | `w` | `!weight [player]` | !weight | [Example](imgurLinkWhen)
|`winstreak` | Estimated winstreaks of the specified user in bedwars | `ws` | `!winstreak [player]` | !winstreak | [Example](imgurLinkWhen)
|`woolwars` | WoolWars stats of specified user  | `ww`| `!woolwars [player]` | !woolwars | [Example](imgurLinkWhen)

### Chat Triggers Module

If you think message format is boring You can check out my repository for ChatTriggers module which changes the way messages from Bot look like. [Click Here](https://github.com/DuckySoLucky/Hypixel-Guild-Chat-Format)

### Events Notifier

The bot also includes event notifier that can be used to send message in guild 30 & 5 minutes before the event starts, by the default all of the events are toggled on. Feel free to disable events which you do not like in config.

#### Frag Bot

The bot also includes an integrated frag bot that can be used for Hypixel Skyblock dungeons.

### To-Do List

- [ ] Setup inside a console
  - Title
- [ ] `!pet` Command lore splitting
  - Lore of pet can sometimes be very long, to solve this issue there should be lore formatter function which will split lore every x characters so it looks better.
- [ ] Fragbot Whitelist
  - Abiliy to make frag bot be used only by specified users or by guild members only.

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
