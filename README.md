# Hypixel Discord Chat Bridge

A two-way chat bridge between [Hypixel](https://hypixel.net/) guild chat and a [Discord](https://discord.com/) channel. The application utilizes [discord.js v14](https://github.com/discordjs/discord.js) for communicating with Discord, and [Mineflayer](https://github.com/PrismarineJS/mineflayer) for communicating with Hypixel.

> ⚠️ This application will login to Hypixel using Mineflayer which is not a normal Minecraft client, this could result in your Minecraft account getting banned from Hypixel, so use this application at your own risk. I am not responsible for any bans that may occur. ⚠️

<hr>
 
## Table of Content

- [Installation using NodeJS](#NodeJS)
- [Installation using Docker](#Docker)
- [Commands](#Commands)
- [Configuration](#configuration)
- [To-Do List](#to-do-list)

## NodeJS

- Git
- NodeJS >= 16.9
- A Minecraft account

### Setup Guide for NodeJS

To get started, clone down the repository using:

    git clone https://github.com/DuckySoLucky/hypixel-discord-chat-bridge.git

Next go into the `hypixel-discord-chat-bridge` folder and install all the dependencies using NPM.

    npm install

While the dependencies are being installed you can edit the configuration file. The configuration file is called `config.example.json`. It is pretty self explanatory, but if you need help with it, you can check out the [Configuration](#configuration) section. Once you are done editing, save it and rename it to `config.json`.

Once edited and the dependencies are installed, you can start the application using:

    node index.js

Using the link provided in the console, you sign into the minecraft account that you want to use.

## Docker

- Git
- Docker >= 20<br>
  _Older versions may also work, but have not been tested._
- A Minecraft account

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

The API options include information about APIs which are being used, the only one which needs to be changed are `hypixelAPIkey`, `antiSniperKey`, `pixelicAPIkey` and `imgurAPIkey`.

You can receive Hypixel API key by joining Hypixel Network and typing `/api new` command.

> Hypixel API is used for most of the commands.

AntiSniper key can be generated [Here](https://api.antisniper.net/).

> AntiSniper API is used for `!denick` and `!winstreak` commands.

Imgur API can be generated [Here](https://api.imgur.com/oauth2/addclient).

> Imgur API is used for rendering commands like `!armor`, `!pet`, `!equipment` etc.

Pixelic API can be generated [Here](https://docs.pixelic.de/).

> Pixelic API is used for `!daily`, `!weekly` and `!monthly` commands.

### Event

The Event options include various events which will be notified by bot 30 and 5 minutes before event starts. If you do not like one of the events just change value from `true` to `false`. There is also ability to toggle off bot notifier fully in `enabled` option

### Guild Requirements

The bot also includes automatic guild accept if the user meets requirements. The requirements are set in the config.json, is requirement's value is 0 or below 0, it will not be accounted.

`enabled` is option, should it check requirements of person who tries to join Guild or not. If this is enabled, request will be sent to the Logging Channel on the discord.

`autoAccept` is option to enable automatic Guild accept or not, if the user meets requirements he will be automatically accepted by the bot.

`requirements` option has suboptions, which are requirements.

### Commands

`< >` = Required arguments, `[ ]` = Optional arguments

`Discord`

| Command   | Description                                      | Syntax                      | Example                             | Response                           |
| --------- | ------------------------------------------------ | --------------------------- | ----------------------------------- | ---------------------------------- |
| blacklist | Blacklists specified user from using bot.        | `/blacklist [arg] [player]` | `/blacklist add DuckySoSkilled`     | ![](https://imgur.com/Ybaj9wj.png) |
| demote    | Demotes the given user by one guild rank.        | `/demote [player]`          | `/demote DuckySoSkilled`            | ![](https://imgur.com/liHDaOW.png) |
| guildtop  | Top 10 members with the most guild xp.           | `/guildtop [integer]`       | `/guildtop 5`                       | ![](https://imgur.com/7oV77ey.png) |
| help      | Shows help menu.                                 | `/help`                     | `/help`                             | ![](https://imgur.com/CLka3pQ.png) |
| info      | Shows information about bot.                     | `/info`                     | `/info`                             | ![](https://imgur.com/pRONsiE.png) |
| invite    | Invites the specified user to the guild.         | `/invite [player]`          | `/invite DuckySoSkilled`            | ![](https://imgur.com/DIfzSS7.png) |
| kick      | Kicks the specified user from the guild.         | `/kick [player] [reason]`   | `/kick DuckySoSkilled`              | ![](https://imgur.com/auMbSD9.png) |
| mute      | Mutes the given user for a given amount of time. | `/mute [player] [time]`     | `/mute DuckySoSkilled 1h`           | ![](https://imgur.com/fQxoyHv.png) |
| online    | View online player in the guild.                 | `/online`                   | `/online`                           | ![](https://imgur.com/Ny4vTRQ.png) |
| execute   | Executes commands as the minecraft bot.          | `/execute [command]`        | `/execute /g unmute DuckySoSkilled` | ![](https://imgur.com/fBi2Bv2.png) |
| ping      | Shows the latency of the bot.                    | `/ping`                     | `/ping`                             | ![](https://imgur.com/9sHFgGT.png) |
| promote   | Promotes the specified user by 1 rank.           | `/promote [player]`         | `/promote DuckySoSkilled`           | ![](https://imgur.com/wmMWP5b.png) |
| unmute    | Unmutes the given user.                          | `/unmute [player]`          | `/unmute DuckySoSkilled`            | ![](https://imgur.com/nlu8lo6.png) |
| uptime    | Shows the uptime of the bot.                     | `/uptime`                   | `/uptime`                           | ![](https://imgur.com/R1cnJfn.png) |

`Minecraft`

| Command     | Description                                 | Syntax                       | Example                     | Response                                                                                                                                                                                                                     |
| ----------- | ------------------------------------------- | ---------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 8ball       | Ask an 8ball a question.                    | `!8ball <question>`          | `!8ball Is this bot good?`  | `Yes definitely.`                                                                                                                                                                                                            |
| accessories | Accessories of specified user.              | `!accessories [player]`      | `!accessories Refraction`   | `Refraction's Accessories » 98 Recombobulated » 97 Enriched » 43` & `Refraction's Accessories » Common - 0 Uncommon - 16 Rare - 13 Epic - 26 Legendary - 16 Special - 0  Very Special - 2`                                   |
| armor       | Renders armor of specified user.            | `!armor [player]`            | `!armor DeathStreeks`       | `DeathStreeks's armor » https://i.imgur.com/JdijFmo.png https://i.imgur.com/8uBpRrY.png https://i.imgur.com/oVQl6WV.png https://i.imgur.com/x7wlfnk.png`                                                                     |
| auction     | Active Auctions of specified user.          | `!auction [player]`          | `!auction DuckySoSkilled`   | `DuckySoSkilled's Active Auctions » https://i.imgur.com/9Jw8zCK.png`                                                                                                                                                         |
| bedwars     | BedWars stats of specified user.            | `!bedwars [player]`          | `!bedwars Refraction`       | `[13✫] Refraction FK: 358 FKDR: 7.31 Wins: 83 WLR: 1.54 BB: 216 BLR: 3.09 WS: 3`                                                                                                                                             |
| catacombs   | Skyblock Dungeons Stats of specified user.  | `!catacombs [player]`        | `!catacombs DeathStreeks`   | `DeathStreeks's Catacombs: 62.29 Class Average: 50 Secrets Found: 279,088 (8.50 SPR) Classes: H - 50 M - 50 B - 50 A - 50 T - 50`                                                                                            |
| daily       | Get daily stats of specified user.          | `!daily [player] [gamemode]` | `!daily DuckySoSkilled`     | `DuckySoSkilled has gained 0 karma and gained 0.1 levels in the last day.`                                                                                                                                                   |
| denick      | Denick username of specified user.          | `!denick [player]`           | `!denick the_good_anime`    | `[MVP++] rajas0423 is nicked as the_good_anime`                                                                                                                                                                              |
| duels       | Duel stats of specified user.               | `!duels [player]`            | `!duels DuckySoSkilled`     | `[Duels] [Godlike II] DuckySoSkilled Wins: 27044 CWS: 6 BWS: 536 WLR: 4.95`                                                                                                                                                  |
| equipment   | Renders equipment of specified user.        | `!equipment [name]`          | `!equipment Refraction`     | `Refraction's Equipment » https://i.imgur.com/QOU2r0O.png https://i.imgur.com/dUrotYa.png https://i.imgur.com/0Fxnkjd.png https://i.imgur.com/wIEcrZX.png`                                                                   |
| fairysouls  | Fairy Souls of specified user.              | `!fairysouls [player]`       | `!fairysouls DeathStreeks`  | `DeathStreeks's Fairy Souls: 238/238  Progress: 100.00%`                                                                                                                                                                     |
| fetchur     | Information about an item for Fetchur.      | `!fetchur [item]`            | `!fetchur`                  | `Fetchur Requests » 1x Superboom TNT Description: This item can be purchased from the Auction House or found in dungeons`                                                                                                    |
| guildexp    | Guilds experience of specified user.        | `!guildexp [player]`         | `!guildexp DuckySoSkilled`  | `Your Weekly Guild Experience » 1,495`                                                                                                                                                                                       |
| help        | Shows help menu.                            | `!help`                      | `!help`                     | `https://imgur.com/BQBQXwN.png`                                                                                                                                                                                              |
| kitty       | Random image of cute cat.                   | `!kitty`                     | `!kitty`                    | `https://i.imgur.com/jgUI7KO.jpg`                                                                                                                                                                                            |
| level       | Skyblock Level of specified user.           | `level [player]`             | `!level DeathStreeks`       | `DeathStreek's Skyblock Level » 354.59`                                                                                                                                                                                      |
| math        | Calculate any kind of math problem.         | `!math <calculation>`        | `!math 6 * 9 + 6 + 9`       | `6*9+6+9 = 69`                                                                                                                                                                                                               |
| monthly     | Get monthly stats of specified user.        | `!monthly [player]`          | `!monthly DuckySoSkilled`   | `DuckySoSkilled has gained 0 karma and gained 0.1 levels in the last month.`                                                                                                                                                 |
| networth    | Networth of specified user.                 | `!networth [player]`         | `!networth Refraction  `    | `Refraction's Networth is 114 B Unsoulbound Networth: 61.9 B Purse: 3.56 B Bank: 1.07 B`                                                                                                                                     |
| pet         | Renders active pet of specified user.       | `!pet [player]`              | `!pet Refraction`           | `Refraction's Active Pet » https://i.imgur.com/FVuLQk4.png`                                                                                                                                                                  |
| render      | Renders item of specified user.             | `!render [player] [slot]`    | `!render DuckySoSkilled`    | `DuckySoSkilled's item at slot 1 » https://i.imgur.com/U2dIcSc.png`                                                                                                                                                          |
| skills      | Skills and Skill Average of specified user. | `!skills [player]`           | `!skills DuckySoSkilled`    | `Skill Average » 54.44 Farming - 60.00 Mining - 60.00 Combat - 60.00 Enchanting - 60.00 Fishing - 50.00 Foraging - 50.00 Alchemy - 50.00 Taming - 50.00 Carpentry - 50.00`                                                   |
| skywars     | Skywars stats of specified user.            | `!skywars [player]`          | `!skywars DuckySoSkilled`   | `[38✫] Refraction KDR: 6.04 WLR: 1.01 WS: 0`                                                                                                                                                                                 |
| skyblock    | Skyblock Stats of specified user.           | `!skyblock [player]`         | `!skyblock DeathStreeks`    | `DeathStreeks's Level » 354.59 Senither Weight » 44,455 Lily Weight » 39,268 Skill Average » 54.4 Slayer » 7,918,100 Catacombs » 62 Class Average » 50 Networth » 133 B Accessories » 98 Recombobulated » 97 Enriched » 44`  |
| slayer      | Slayer of specified user.                   | `!slayer [player] [type]`    | `!slayer DeathStreeks`      | `DeathStreeks's Slayer -  Zombie: Level: 9 Experience: 3,165,000 Spider: Level: 9 Experience: 1,000,625 Wolf: Level: 9 Experience: 1,002,000 Enderman: Level: 9 Experience: 1,715,475 Blaze: Level: 9 Experience: 1,035,000` |
| UHC         | UHC Stats of specified user.                | `!UHC [player]`              | `!UHC DuckySoSkilled`       | `[6✫] Refraction KDR: 2.54 WLR: 69 Heads: 578`                                                                                                                                                                               |
| weekly      | Get weekly stats of specified user.         | `!weekly [player]`           | `!weekly DuckySoSkilled`    | `DuckySoSkilled has gained 0 karma and gained 0.1 levels in the last week.`                                                                                                                                                  |
| weight      | Skyblock Stats of specified user.           | `!weight [player]`           | `!weight DuckySoSkilled`    | `Refraction's Senither Weight » 27721.82 Skills: 12991.95 Dungeons: 11353.90` & `Refraction's Lily Weight » 28342.24 Skills » 12310.84 Slayer » 4476.85 Dungeons » 11554.55`                                                 |
| winstreak   | Estimated winstreaks of the specified user. | `!winstreak [player]`        | `!winstreak DuckySoSkilled` | `[3395✫] Manhal_IQ_: Accurrate » No Overall » 10 Solo » 9 Doubles » 1 Trios » 2 Fours » 0 4v4  » 74`                                                                                                                         |
| woolwars    | WoolWars stats of specified user.           | `!woolwars [player]`         | `!woolwars DuckySoSkilled`  | `[2✫] DuckySoSkilled » W: 5 WLR: 0.5 KDR: 1.19 BB: 37 WP: 45`                                                                                                                                                                |

### Chat Triggers Module

If you think that message format is boring, you can check out my repository for ChatTriggers module which changes the way messages from Bot look like. [Click Here](https://github.com/DuckySoLucky/Hypixel-Guild-Chat-Format)

### Events Notifier

The bot also includes event notifier that can be used to send message in guild 30 & 5 minutes before the event starts, by the default all of the events are toggled on. Feel free to disable events which you do not like in config.

#### Frag Bot

The bot also includes an integrated frag bot that can be used by the guild.

### To-Do List

- [ ] `!pet` Command lore splitting
  - Lore of pet can sometimes be very long, to solve this issue there should be lore formatter function which will split lore every x characters so it looks better.
- [ ] Fragbot Whitelist
  - Ability to make frag bot be used only by specified users or by guild members only.

## Credits

- [Altpapier](https://github.com/altpapier/hypixel-discord-guild-bridge/)
- [DawJaw](https://dawjaw.net/jacobs)
- [Hypixel API Reborn](https://hypixel.stavzdev.me/#/)
- [Hypixel Network API](http://api.hypixel.net/)
- [PlayerDB API](https://playerdb.co/)
- [SkyHelper API](https://github.com/Altpapier/SkyHelperAPI)
- [SkyCrypt](https://github.com/SkyCryptWebsite/SkyCrypt)
- [Senither](https://github.com/Senither)
- [LilyWeight](https://github.com/Antonio32A/lilyweight)
- [Pixelic API](https://docs.pixelic.de/)
