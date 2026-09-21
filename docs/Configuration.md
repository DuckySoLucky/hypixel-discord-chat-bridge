# Configuration

This document is generated from the Zod config schema in [`src/types/config.ts`](/src/types/config.ts)

# <Root>

| Key             | Type     | Required | Description                                                                          |
| --------------- | -------- | -------- | ------------------------------------------------------------------------------------ |
| `$schema`       | `string` | Yes      | !IMPORTANT DO NOT TOUCH Config schema format path                                    |
| `configVersion` | `number` | Yes      | !IMPORTANT DO NOT TOUCH Config format version number                                 |
| `API`           | `object` | Yes      | Configuration options for API's used inside of the bot                               |
| `bridge`        | `object` | Yes      | Configuration options for the chat bridge                                            |
| `minecraft`     | `object` | Yes      | Configuration options for minecraft related stuff                                    |
| `discord`       | `object` | Yes      | Configuration options for discord related stuff                                      |
| `verification`  | `object` | Yes      | Configuration for user verification                                                  |
| `blacklist`     | `object` | Yes      | Configuration for blacklist handling                                                 |
| `statsChannels` | `object` | Yes      | Configuration for stats channels                                                     |
| `other`         | `object` | Yes      | Configuration options for misc/other stuff or things that don't have a good location |

## API

| Key        | Type     | Required | Description                        |
| ---------- | -------- | -------- | ---------------------------------- |
| `hypixel`  | `object` | Yes      | Configuration for the Hypixel API  |
| `mowojang` | `object` | Yes      | Configuration for the Mowojang API |
| `soopy`    | `object` | Yes      | Configuration for the Soopy API    |
| `mcHeads`  | `object` | Yes      | Configuration for the mc-heads API |

### hypixel

| Key       | Type             | Required | Description                                                                         |
| --------- | ---------------- | -------- | ----------------------------------------------------------------------------------- |
| `key`     | `string`         | Yes      | The Hypixel API key itself                                                          |
| `baseURL` | `string OR null` | Yes      | The base URL for the Hypixel API. If null, the default Hypixel API URL will be used |

### mowojang

| Key       | Type             | Required | Description                                                                           |
| --------- | ---------------- | -------- | ------------------------------------------------------------------------------------- |
| `baseURL` | `string OR null` | Yes      | The base URL for the Mowojang API. If null, the default Mowojang API URL will be used |

### soopy

| Key       | Type     | Required | Description                    |
| --------- | -------- | -------- | ------------------------------ |
| `baseURL` | `string` | Yes      | The base URL for the Soopy API |

### mcHeads

| Key       | Type     | Required | Description                       |
| --------- | -------- | -------- | --------------------------------- |
| `baseURL` | `string` | Yes      | The base URL for the mc-heads API |

## bridge

| Key                     | Type      | Required | Description                                                                |
| ----------------------- | --------- | -------- | -------------------------------------------------------------------------- |
| `minecraft`             | `object`  | Yes      | Configuration options for how the minecraft side of the bridge behaves     |
| `discord`               | `object`  | Yes      | Configuration options for how the discord side of the bridge behaves       |
| `channels`              | `object`  | Yes      | Configuration options for the bridge channels                              |
| `filter`                | `object`  | Yes      | Bridge chat filtering configuration                                        |
| `strippers`             | `object`  | Yes      | Configuration options for the bridge message/username strippers            |
| `timeout`               | `string`  | Yes      | How long should bridged messages wait before assuming something went wrong |
| `messageErrorReactions` | `boolean` | Yes      | Should the bot react X when a message fails                                |

### minecraft

| Key      | Type     | Required | Description                                                                                                                           |
| -------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `format` | `string` | Yes      | The format for messages sent from Discord to Minecraft Use {username} for the player's username and {message} for the message content |

### discord

| Key           | Type                            | Required | Description                                                                                                                                                         |
| ------------- | ------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowedBots` | `array<string>`                 | Yes      | Array of discord User Ids                                                                                                                                           |
| `mode`        | `enum(bot, webhook, minecraft)` | Yes      | Which Discord bridge mode should be used                                                                                                                            |
| `format`      | `string`                        | Yes      | The format for messages sent from Minecraft to Discord Only used with `minecraft` mode Supported arguments: {chatType}, {username}, {rank}, {guildRank}, {username} |

### channels

| Key       | Type     | Required | Description                                |
| --------- | -------- | -------- | ------------------------------------------ |
| `debug`   | `object` | Yes      | Configuration for a single bridge channel  |
| `guild`   | `object` | Yes      | Configuration for a single bridge channel  |
| `officer` | `object` | Yes      | Configuration for a single bridge channel  |
| `logging` | `object` | Yes      | Configuration for a bridge logging channel |

#### debug

| Key       | Type             | Required | Description                                                         |
| --------- | ---------------- | -------- | ------------------------------------------------------------------- |
| `enabled` | `boolean`        | Yes      | Should this bridge channel be enabled                               |
| `channel` | `string OR null` | Yes      | Discord channel id. If null, an auto-generated channel will be used |

#### guild

| Key       | Type             | Required | Description                                                         |
| --------- | ---------------- | -------- | ------------------------------------------------------------------- |
| `enabled` | `boolean`        | Yes      | Should this bridge channel be enabled                               |
| `channel` | `string OR null` | Yes      | Discord channel id. If null, an auto-generated channel will be used |

#### officer

| Key       | Type             | Required | Description                                                         |
| --------- | ---------------- | -------- | ------------------------------------------------------------------- |
| `enabled` | `boolean`        | Yes      | Should this bridge channel be enabled                               |
| `channel` | `string OR null` | Yes      | Discord channel id. If null, an auto-generated channel will be used |

#### logging

| Key        | Type             | Required | Description                                                         |
| ---------- | ---------------- | -------- | ------------------------------------------------------------------- |
| `enabled`  | `boolean`        | Yes      | Should this bridge channel be enabled                               |
| `channel`  | `string OR null` | Yes      | Discord channel id. If null, an auto-generated channel will be used |
| `channels` | `object`         | Yes      | Specific logging channels for different bridge events               |

##### channels

| Key          | Type             | Required | Description                                                        |
| ------------ | ---------------- | -------- | ------------------------------------------------------------------ |
| `guild`      | `string OR null` | Yes      | Discord channel id. If null, an auto-generated thread will be used |
| `event`      | `string OR null` | Yes      | Discord channel id. If null, an auto-generated thread will be used |
| `error`      | `string OR null` | Yes      | Discord channel id. If null, an auto-generated thread will be used |
| `blacklist`  | `string OR null` | Yes      | Discord channel id. If null, an auto-generated thread will be used |
| `scripts`    | `string OR null` | Yes      | Discord channel id. If null, an auto-generated thread will be used |
| `inactivity` | `string OR null` | Yes      | Discord channel id. If null, an auto-generated thread will be used |

### filter

| Key           | Type            | Required | Description                                     |
| ------------- | --------------- | -------- | ----------------------------------------------- |
| `enabled`     | `boolean`       | Yes      | Should the chat filter be enabled               |
| `customWords` | `array<string>` | Yes      | Custom words used for filtering bridge messages |

### strippers

| Key         | Type     | Required | Description                     |
| ----------- | -------- | -------- | ------------------------------- |
| `usernames` | `object` | Yes      | Stripper settings for usernames |
| `messages`  | `object` | Yes      | Stripper settings for messages  |

#### usernames

| Key               | Type      | Required | Description                                                                       |
| ----------------- | --------- | -------- | --------------------------------------------------------------------------------- |
| `emojis`          | `boolean` | Yes      | Whether emoji characters should be stripped from usernames or messages            |
| `spaces`          | `boolean` | Yes      | Whether extra spaces should be stripped from usernames or messages                |
| `nonAlphanumeric` | `boolean` | Yes      | Whether non-alphanumeric characters should be stripped from usernames or messages |

#### messages

| Key               | Type      | Required | Description                                                                       |
| ----------------- | --------- | -------- | --------------------------------------------------------------------------------- |
| `emojis`          | `boolean` | Yes      | Whether emoji characters should be stripped from usernames or messages            |
| `spaces`          | `boolean` | Yes      | Whether extra spaces should be stripped from usernames or messages                |
| `nonAlphanumeric` | `boolean` | Yes      | Whether non-alphanumeric characters should be stripped from usernames or messages |

## minecraft

| Key             | Type     | Required | Description                                    |
| --------------- | -------- | -------- | ---------------------------------------------- |
| `commands`      | `object` | Yes      | Configuration for minecraft command handling   |
| `guild`         | `object` | Yes      | Configuration for minecraft guild behavior     |
| `hypixelAlerts` | `object` | Yes      | Configuration for Hypixel alerts               |
| `bot`           | `object` | Yes      | Configuration for the minecraft bot connection |

### commands

| Key                         | Type     | Required | Description                                                           |
| --------------------------- | -------- | -------- | --------------------------------------------------------------------- |
| `timeout`                   | `string` | Yes      | How long the command should wait before assuming something went wrong |
| `messageRepeatBypassLength` | `number` | Yes      | The number of repeated messages allowed before a command is ignored   |
| `maxMessageLength`          | `number` | Yes      | The maximum length of a minecraft command message                     |
| `normal`                    | `object` | Yes      | Configuration for the normal minecraft command system                 |
| `soopy`                     | `object` | Yes      | Configuration for the Soopy minecraft command system                  |

#### normal

| Key       | Type      | Required | Description                                        |
| --------- | --------- | -------- | -------------------------------------------------- |
| `enabled` | `boolean` | Yes      | Whether this minecraft command is enabled          |
| `prefix`  | `string`  | Yes      | The command prefix used for this minecraft command |

#### soopy

| Key       | Type      | Required | Description                                        |
| --------- | --------- | -------- | -------------------------------------------------- |
| `enabled` | `boolean` | Yes      | Whether this minecraft command is enabled          |
| `prefix`  | `string`  | Yes      | The command prefix used for this minecraft command |

### guild

| Key            | Type     | Required | Description                                 |
| -------------- | -------- | -------- | ------------------------------------------- |
| `requirements` | `object` | Yes      | Configuration for guild join requirements   |
| `welcomer`     | `object` | Yes      | Configuration for the guild welcome message |

#### requirements

| Key                        | Type                     | Required | Description                                                                             |
| -------------------------- | ------------------------ | -------- | --------------------------------------------------------------------------------------- |
| `enabled`                  | `boolean`                | Yes      | Whether guild requirement checking is enabled                                           |
| `autoAccept`               | `boolean`                | Yes      | Whether new guild members are automatically accepted if they have pass the requirements |
| `requirementsNeededToPass` | `number`                 | Yes      | The number of requirements a player must meet to pass                                   |
| `requirements`             | `record<string, number>` | Yes      | The guild requirement thresholds keyed by player stat                                   |

#### welcomer

| Key           | Type      | Required | Description                                     |
| ------------- | --------- | -------- | ----------------------------------------------- |
| `enabled`     | `boolean` | Yes      | Whether the guild welcome message is enabled    |
| `message`     | `string`  | Yes      | The welcome message sent to new guild members   |
| `showCredits` | `boolean` | Yes      | Whether welcome message credits should be shown |

### hypixelAlerts

| Key                       | Type     | Required | Description                                             |
| ------------------------- | -------- | -------- | ------------------------------------------------------- |
| `hypixelNews`             | `object` | Yes      | Hypixel news alert settings                             |
| `statusUpdates`           | `object` | Yes      | Hypixel status update alert settings                    |
| `skyblockVersion`         | `object` | Yes      | SkyBlock version alert settings                         |
| `alphaPlayerCountTracker` | `object` | Yes      | Configuration for the alpha player count tracking alert |

#### hypixelNews

| Key        | Type      | Required | Description                                  |
| ---------- | --------- | -------- | -------------------------------------------- |
| `enabled`  | `boolean` | Yes      | Whether this Hypixel alert is enabled        |
| `interval` | `string`  | Yes      | How often should the alert be ran (/checked) |

#### statusUpdates

| Key        | Type      | Required | Description                                  |
| ---------- | --------- | -------- | -------------------------------------------- |
| `enabled`  | `boolean` | Yes      | Whether this Hypixel alert is enabled        |
| `interval` | `string`  | Yes      | How often should the alert be ran (/checked) |

#### skyblockVersion

| Key        | Type      | Required | Description                                  |
| ---------- | --------- | -------- | -------------------------------------------- |
| `enabled`  | `boolean` | Yes      | Whether this Hypixel alert is enabled        |
| `interval` | `string`  | Yes      | How often should the alert be ran (/checked) |

#### alphaPlayerCountTracker

| Key               | Type      | Required | Description                                      |
| ----------------- | --------- | -------- | ------------------------------------------------ |
| `enabled`         | `boolean` | Yes      | Whether this Hypixel alert is enabled            |
| `interval`        | `string`  | Yes      | How often should the alert be ran (/checked)     |
| `messageCooldown` | `string`  | Yes      | The cooldown between alpha player count messages |
| `playerThreshold` | `number`  | Yes      | The player count threshold to trigger an alert   |

### bot

| Key                | Type     | Required | Description                                    |
| ------------------ | -------- | -------- | ---------------------------------------------- |
| `server`           | `string` | Yes      | The Minecraft server address to connect to     |
| `port`             | `number` | Yes      | The Minecraft server port to connect to        |
| `version`          | `string` | Yes      | The Minecraft version                          |
| `accountsLocation` | `string` | Yes      | The file path to Minecraft account credentials |

## discord

| Key        | Type     | Required | Description                                                 |
| ---------- | -------- | -------- | ----------------------------------------------------------- |
| `serverId` | `string` | Yes      | The Discord server (guild) ID                               |
| `token`    | `string` | Yes      | The Discord bot token used to authenticate                  |
| `commands` | `object` | Yes      | Configuration for discord bot commands                      |
| `embeds`   | `object` | Yes      | Configuration options for embeds and how they are displayed |

### commands

| Key             | Type            | Required | Description                                                                              |
| --------------- | --------------- | -------- | ---------------------------------------------------------------------------------------- |
| `staffRole`     | `string`        | Yes      | The discord role Id of your staff members                                                |
| `adminUsers`    | `array<string>` | Yes      | The discord user Ids of any admins The people who own the bot are automatically included |
| `debugCommands` | `boolean`       | Yes      | Should the debug commands be enabled                                                     |

### embeds

| Key              | Type                     | Required | Description                                                 |
| ---------------- | ------------------------ | -------- | ----------------------------------------------------------- |
| `showTime`       | `boolean`                | Yes      | Should the default generic embed show the current timestamp |
| `showDevFooters` | `boolean`                | Yes      | Whether dev footers should be disabled or not               |
| `colors`         | `record<string, string>` | Yes      | The default colors for embeds                               |

## verification

| Key          | Type      | Required | Description                                        |
| ------------ | --------- | -------- | -------------------------------------------------- |
| `enabled`    | `boolean` | Yes      | Whether verification is enabled                    |
| `nickname`   | `object`  | Yes      | Configuration for automatic nickname updates       |
| `roles`      | `object`  | Yes      | Configuration for verification roles               |
| `inactivity` | `object`  | Yes      | Configuration for verification inactivity tracking |

### nickname

| Key            | Type      | Required | Description                                                                                                 |
| -------------- | --------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| `enabled`      | `boolean` | Yes      | Whether verified user nicknames should be managed automatically                                             |
| `nickname`     | `string`  | Yes      | The nickname format used for verified users. See docs/PlayerStatVaribles.md for list of supported variables |
| `removeCommas` | `boolean` | Yes      | Whether commas should be removed from generated nicknames                                                   |

### roles

| Key           | Type                      | Required | Description                                            |
| ------------- | ------------------------- | -------- | ------------------------------------------------------ |
| `verified`    | `object OR object`        | Yes      | Role assigned to verified users                        |
| `guildMember` | `object OR object`        | Yes      | Role assigned to guild members                         |
| `custom`      | `array<object OR object>` | Yes      | Custom verification roles based on player requirements |
| `autoUpdater` | `object`                  | Yes      | Configuration for automatic verification role updates  |

#### autoUpdater

| Key        | Type      | Required | Description                                                |
| ---------- | --------- | -------- | ---------------------------------------------------------- |
| `enabled`  | `boolean` | Yes      | Whether role auto-updating is enabled for verified users   |
| `interval` | `string`  | Yes      | How often should all linked users have there roles updated |

### inactivity

| Key                 | Type      | Required | Description                                                |
| ------------------- | --------- | -------- | ---------------------------------------------------------- |
| `enabled`           | `boolean` | Yes      | Whether inactivity checks are enabled for verified users   |
| `maxInactivityTime` | `string`  | Yes      | The maximum allowed inactivity time before action is taken |

## blacklist

| Key             | Type      | Required | Description                                               |
| --------------- | --------- | -------- | --------------------------------------------------------- |
| `enabled`       | `boolean` | Yes      | Whether the blacklist feature is enabled                  |
| `notifications` | `object`  | Yes      | Configuration for blacklist notifications                 |
| `actions`       | `object`  | Yes      | Configuration for actions taken against blacklisted users |

### notifications

| Key                 | Type      | Required | Description                                                         |
| ------------------- | --------- | -------- | ------------------------------------------------------------------- |
| `onBlacklistChange` | `object`  | Yes      | Configuration for notifications sent when a blacklist change occurs |
| `onJoinRequest`     | `boolean` | Yes      | Whether join request notifications are enabled                      |
| `onUserJoinDiscord` | `boolean` | Yes      | Whether Discord join notifications are enabled                      |

#### onBlacklistChange

| Key                | Type      | Required | Description                                                                |
| ------------------ | --------- | -------- | -------------------------------------------------------------------------- |
| `enabled`          | `boolean` | Yes      | Whether the user being blacklisted with be notified of blacklist changes   |
| `shareBlacklister` | `boolean` | Yes      | Whether the user who blacklisted someone should be shared in notifications |

### actions

| Key              | Type      | Required | Description                                                |
| ---------------- | --------- | -------- | ---------------------------------------------------------- |
| `blockBotAccess` | `boolean` | Yes      | Whether blacklisted users are blocked from bot access      |
| `kickFromGuild`  | `object`  | Yes      | Configuration for kicking blacklisted users from the guild |

#### kickFromGuild

| Key       | Type      | Required | Description                                               |
| --------- | --------- | -------- | --------------------------------------------------------- |
| `enabled` | `boolean` | Yes      | Whether blacklisted users should be kicked from the guild |
| `reason`  | `string`  | Yes      | The reason used when kicking a player from the guild      |

## statsChannels

| Key           | Type            | Required | Description                                       |
| ------------- | --------------- | -------- | ------------------------------------------------- |
| `enabled`     | `boolean`       | Yes      | Whether stats channels are enabled                |
| `autoUpdater` | `object`        | Yes      | Configuration for automatic stats channel updates |
| `channels`    | `array<object>` | Yes      | The stats channels to maintain                    |

### autoUpdater

| Key        | Type      | Required | Description                                    |
| ---------- | --------- | -------- | ---------------------------------------------- |
| `enabled`  | `boolean` | Yes      | Whether stats channel auto-updating is enabled |
| `interval` | `string`  | Yes      | How often stats channels are updated           |

## other

| Key             | Type      | Required | Description                                             |
| --------------- | --------- | -------- | ------------------------------------------------------- |
| `backupConfigs` | `boolean` | Yes      | Whether backup copies of config files should be created |
| `logger`        | `object`  | Yes      | Configuration options for the logger                    |

### logger

| Key           | Type      | Required | Description                                       |
| ------------- | --------- | -------- | ------------------------------------------------- |
| `saveToFiles` | `boolean` | Yes      | Whether log output should be written to files     |
| `location`    | `string`  | Yes      | The location of where these files should be saved |

---

This document is [auto generated](/scripts/docs/Configuration.ts) and was last updated on `Mon, 21 Sep 2026 10:54:11 GMT` (`1789988051965`)

To update this document please run `pnpm docgen` or contact a maintainer and ask them to update it.

---

If you need any help help consider checking out the [FAQ](/docs/FrequentlyAskedQuestions.md)

Feel free to reach out to the maintainers directly on Discord. [@duckysolucky](https://discord.com/users/486155512568741900),
[@.kathund](https://discord.com/users/1276524855445164098)
