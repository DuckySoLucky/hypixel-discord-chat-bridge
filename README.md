# Hypixel Discord Chat Bridge

A two-way chat bridge between [Hypixel](https://hypixel.net/) guild chat and a [Discord](https://discord.com/) channel. The application utilizes [Discord.js-light](https://github.com/timotejroiko/discord.js-light) for communicating with Discord, and [Mineflayer](https://github.com/PrismarineJS/mineflayer) for communicating with Hypixel.

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

> Note: The port must be a number, Mineflayer expects an integer so you can't wrap the port in quotes or Mineflayer won't create a connection to the Minecraft server.

#### Minecraft

The minecraft section includes a `username` and `password` option, if using a Mojang account these should be filled out with your Mojang username and password for the Minecraft account you plan on using, your Minecraft username is most likely the email it was created with. If using with a microsoft account change `accountType` to `microsoft`, `username` and `password` are not required and will be left blank as you will be directed to the [Microsoft Link page](https://www.microsoft.com/link). 

#### Discord

The Discord options includes the `token`, `channel`, `officerChannel`, `commandRole`, `ownerId`, `prefix`, `messageMode` and `joinMessage` options.

The token is the Discord application token, if you don't already have a Discord App, you can [create a new app](https://discordapp.com/developers), then convert the app to a Discord bot, and then get your Discord bot token on the "Bot" page.

The Discord channel is the ID of the text channel the bot should be linked with, the bot will only send and listen to messages in the channel defined in the config.

The Discord Officer channel is the ID of the text channel the bot should be linked with for the Officer Chat, the bot will only send and listen to messages in the channel defined in the config.

The command role is the ID of any role on the server the bot is hosted for, any user with the role will be able to run all the Discord commands built into the bot, like `!kick` and `!relog`.

> Note: Any user can run the `!help` command, however all the other commands requires the user has the command role.

The owner ID is similar to the command role, however this is the ID of the user that should have full access to the `!override` command, the user with this permission can use the command to run virtually any command via the bot, and should therefore be limited to just the owner of the bot.

The prefix is the command prefixed used for all the commands in the bot on the Discord side, by default this is set it `!`.

The messageMode can either be `bot` or `webhook`. This selects how the messages should be displayed when sent from Minecraft to Discord. If webhook mode is selected the bot requires the `Manage Webhooks` permission in the channel it's running in. The bot always requires the `Send Messages` and `View Channel` permissions in the channel you're using it in.

- [View Webhook example](https://imgur.com/)
- [View Bot Mode example](https://imgur.com/)

> Note: The Discord rate limit for webhooks is 30 requests every 60 seconds, whereas for normal bot messages it's 5 messages every 5 seconds. Using webhooks effectively halves the number of messages the bot can send per minute which may cause issues in an active guild.

The joinMessage is ability to toggle join and leave message being sent to the discord channel. This should be set to `false` in inactive guilds since it can be spammy. 

### Commands

`< >` = Required arguments, `[ ]` Optional arguments

`Discord`

- `!help` - Displays the list of commands
- `!relog [delay]` - Relogs the MC client, a delay can be given in seconds, if no delay is given it will default to 5 seconds
- `!override <command> [args]` - Executes the string attached. This is a dangerous permission to grant 
- `!invite <player>` - Invites the specified user to the guild, providing the guild isn't full 
- `!kick <user> [reason]` - Kicks the specified user from the guild 
- `!promote <user>` - Promotes the specified user by 1 rank 
- `!demote <user>` - Demotes the specified user by 1 rank 
- `!online` - View online player in the guild

`Minecraft` 

- `!8ball <question>` - Ask 8ball a question.
- `!bedwars [player]` - BedWars stats of specified user.
- `!duels [gamemode] [player]` - Duels stats of specified user.
- `!fairysouls [player]` - Fairy Souls of specified user.
- `!help` - Shows this help menu.
- `!math <calculation>` - Calculate.
- `!networth [player]` - Networth of specified user.
- `!news` - Check latest Hypixel Network News.
- `!skywars [player]` - Skywars stats of specified user.
- `!slayer [player] [type]` - Slayer of specified user.
- `!uhc [player]` - UHC Stats of specified user.
- `!weight [player]` - Skyblock Stats of specified user.


### To-Do List


- [ ] Chat message filter
  - The filter should block any messages sent from Discord to Hypixel that contains banable words, and words that could potentially cause a mute.
- [ ] More minecraft QOL commands
  - Add more QoL commands to the minecraft.
- [ ] `/` Command support
  - Rewrite how discord commands work. Add new `/` Discord Command support. Not sure about this yet.

## Credits


[MaroAPI](https://github.com/zt3h)
[SkyCryptAPI](https://github.com/SkyCryptWebsite)
[Senither](https://github.com/Senither)
