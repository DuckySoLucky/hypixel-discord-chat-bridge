# Configuration

This document is generated from the Zod config schema in [`src/types/config.ts`](/src/types/config.ts)

# <Root>

| Key             | Type     | Description                                                                          |
| --------------- | -------- | ------------------------------------------------------------------------------------ |
| `$schema`       | `string` | !IMPORTANT DO NOT TOUCH Config schema format path                                    |
| `configVersion` | `number` | !IMPORTANT DO NOT TOUCH Config format version number                                 |
| `API`           | `object` | Configuration options for API's used inside of the bot                               |
| `bridge`        | `object` | Configuration options for the chat bridge                                            |
| `minecraft`     | `object` | Configuration options for minecraft related stuff                                    |
| `discord`       | `object` | Configuration options for discord related stuff                                      |
| `verification`  | `object` | Configuration for user verification                                                  |
| `blacklist`     | `object` | Configuration for blacklist handling                                                 |
| `statsChannels` | `object` | Configuration for stats channels                                                     |
| `other`         | `object` | Configuration options for misc/other stuff or things that don't have a good location |

## API

| Key        | Type     | Description                        |
| ---------- | -------- | ---------------------------------- |
| `hypixel`  | `object` | Configuration for the Hypixel API  |
| `mowojang` | `object` | Configuration for the Mowojang API |
| `soopy`    | `object` | Configuration for the Soopy API    |
| `mcHeads`  | `object` | Configuration for the mc-heads API |

### hypixel

| Key       | Type             | Description                                                                         |
| --------- | ---------------- | ----------------------------------------------------------------------------------- |
| `key`     | `string`         | The Hypixel API key itself                                                          |
| `baseURL` | `string OR null` | The base URL for the Hypixel API. If null, the default Hypixel API URL will be used |

### mowojang

| Key       | Type             | Description                                                                           |
| --------- | ---------------- | ------------------------------------------------------------------------------------- |
| `baseURL` | `string OR null` | The base URL for the Mowojang API. If null, the default Mowojang API URL will be used |

### soopy

| Key       | Type     | Description                    |
| --------- | -------- | ------------------------------ |
| `baseURL` | `string` | The base URL for the Soopy API |

### mcHeads

| Key       | Type     | Description                       |
| --------- | -------- | --------------------------------- |
| `baseURL` | `string` | The base URL for the mc-heads API |

## bridge

| Key                     | Type      | Description                                                                |
| ----------------------- | --------- | -------------------------------------------------------------------------- |
| `minecraft`             | `object`  | Configuration options for how the minecraft side of the bridge behaves     |
| `discord`               | `object`  | Configuration options for how the discord side of the bridge behaves       |
| `channels`              | `object`  | Configuration options for the bridge channels                              |
| `filter`                | `object`  | Bridge chat filtering configuration                                        |
| `strippers`             | `object`  | Configuration options for the bridge message/username strippers            |
| `timeout`               | `string`  | How long should bridged messages wait before assuming something went wrong |
| `messageErrorReactions` | `boolean` | Should the bot react X when a message fails                                |

### minecraft

| Key      | Type     | Description                                                                                                                           |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `format` | `string` | The format for messages sent from Discord to Minecraft Use {username} for the player's username and {message} for the message content |

### discord

| Key           | Type                            | Description                                                                                                                                                         |
| ------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowedBots` | `array<string>`                 | Array of discord User Ids                                                                                                                                           |
| `mode`        | `enum(bot, webhook, minecraft)` | Which Discord bridge mode should be used                                                                                                                            |
| `format`      | `string`                        | The format for messages sent from Minecraft to Discord Only used with `minecraft` mode Supported arguments: {chatType}, {username}, {rank}, {guildRank}, {username} |

### channels

| Key       | Type     | Description                                |
| --------- | -------- | ------------------------------------------ |
| `debug`   | `object` | Configuration for a single bridge channel  |
| `guild`   | `object` | Configuration for a single bridge channel  |
| `officer` | `object` | Configuration for a single bridge channel  |
| `logging` | `object` | Configuration for a bridge logging channel |

#### debug

| Key       | Type             | Description                                                         |
| --------- | ---------------- | ------------------------------------------------------------------- |
| `enabled` | `boolean`        | Should this bridge channel be enabled                               |
| `channel` | `string OR null` | Discord channel id. If null, an auto-generated channel will be used |

#### guild

| Key       | Type             | Description                                                         |
| --------- | ---------------- | ------------------------------------------------------------------- |
| `enabled` | `boolean`        | Should this bridge channel be enabled                               |
| `channel` | `string OR null` | Discord channel id. If null, an auto-generated channel will be used |

#### officer

| Key       | Type             | Description                                                         |
| --------- | ---------------- | ------------------------------------------------------------------- |
| `enabled` | `boolean`        | Should this bridge channel be enabled                               |
| `channel` | `string OR null` | Discord channel id. If null, an auto-generated channel will be used |

#### logging

| Key        | Type             | Description                                                         |
| ---------- | ---------------- | ------------------------------------------------------------------- |
| `enabled`  | `boolean`        | Should this bridge channel be enabled                               |
| `channel`  | `string OR null` | Discord channel id. If null, an auto-generated channel will be used |
| `channels` | `object`         | Specific logging channels for different bridge events               |

##### channels

| Key          | Type             | Description                                                        |
| ------------ | ---------------- | ------------------------------------------------------------------ |
| `guild`      | `string OR null` | Discord channel id. If null, an auto-generated thread will be used |
| `event`      | `string OR null` | Discord channel id. If null, an auto-generated thread will be used |
| `error`      | `string OR null` | Discord channel id. If null, an auto-generated thread will be used |
| `blacklist`  | `string OR null` | Discord channel id. If null, an auto-generated thread will be used |
| `scripts`    | `string OR null` | Discord channel id. If null, an auto-generated thread will be used |
| `inactivity` | `string OR null` | Discord channel id. If null, an auto-generated thread will be used |

### filter

| Key           | Type            | Description                                     |
| ------------- | --------------- | ----------------------------------------------- |
| `enabled`     | `boolean`       | Should the chat filter be enabled               |
| `customWords` | `array<string>` | Custom words used for filtering bridge messages |

### strippers

| Key         | Type     | Description                     |
| ----------- | -------- | ------------------------------- |
| `usernames` | `object` | Stripper settings for usernames |
| `messages`  | `object` | Stripper settings for messages  |

#### usernames

| Key               | Type      | Description                                                                       |
| ----------------- | --------- | --------------------------------------------------------------------------------- |
| `emojis`          | `boolean` | Whether emoji characters should be stripped from usernames or messages            |
| `spaces`          | `boolean` | Whether extra spaces should be stripped from usernames or messages                |
| `nonAlphanumeric` | `boolean` | Whether non-alphanumeric characters should be stripped from usernames or messages |

#### messages

| Key               | Type      | Description                                                                       |
| ----------------- | --------- | --------------------------------------------------------------------------------- |
| `emojis`          | `boolean` | Whether emoji characters should be stripped from usernames or messages            |
| `spaces`          | `boolean` | Whether extra spaces should be stripped from usernames or messages                |
| `nonAlphanumeric` | `boolean` | Whether non-alphanumeric characters should be stripped from usernames or messages |

## minecraft

| Key             | Type     | Description                                    |
| --------------- | -------- | ---------------------------------------------- |
| `commands`      | `object` | Configuration for minecraft command handling   |
| `guild`         | `object` | Configuration for minecraft guild behavior     |
| `hypixelAlerts` | `object` | Configuration for Hypixel alerts               |
| `bot`           | `object` | Configuration for the minecraft bot connection |
| `fontRenderer`  | `object` | Configuration for the minecraft font renderer  |

### commands

| Key                         | Type     | Description                                                           |
| --------------------------- | -------- | --------------------------------------------------------------------- |
| `timeout`                   | `string` | How long the command should wait before assuming something went wrong |
| `messageRepeatBypassLength` | `number` | The number of repeated messages allowed before a command is ignored   |
| `maxMessageLength`          | `number` | The maximum length of a minecraft command message                     |
| `normal`                    | `object` | Configuration for the normal minecraft command system                 |
| `soopy`                     | `object` | Configuration for the Soopy minecraft command system                  |

#### normal

| Key       | Type      | Description                                        |
| --------- | --------- | -------------------------------------------------- |
| `enabled` | `boolean` | Whether this minecraft command is enabled          |
| `prefix`  | `string`  | The command prefix used for this minecraft command |

#### soopy

| Key       | Type      | Description                                        |
| --------- | --------- | -------------------------------------------------- |
| `enabled` | `boolean` | Whether this minecraft command is enabled          |
| `prefix`  | `string`  | The command prefix used for this minecraft command |

### guild

| Key            | Type     | Description                                 |
| -------------- | -------- | ------------------------------------------- |
| `requirements` | `object` | Configuration for guild join requirements   |
| `welcomer`     | `object` | Configuration for the guild welcome message |

#### requirements

| Key                        | Type                     | Description                                                                             |
| -------------------------- | ------------------------ | --------------------------------------------------------------------------------------- |
| `enabled`                  | `boolean`                | Whether guild requirement checking is enabled                                           |
| `autoAccept`               | `boolean`                | Whether new guild members are automatically accepted if they have pass the requirements |
| `requirementsNeededToPass` | `number`                 | The number of requirements a player must meet to pass                                   |
| `requirements`             | `record<string, number>` | The guild requirement thresholds keyed by player stat                                   |

#### welcomer

| Key           | Type      | Description                                     |
| ------------- | --------- | ----------------------------------------------- |
| `enabled`     | `boolean` | Whether the guild welcome message is enabled    |
| `message`     | `string`  | The welcome message sent to new guild members   |
| `showCredits` | `boolean` | Whether welcome message credits should be shown |

### hypixelAlerts

| Key                       | Type     | Description                                             |
| ------------------------- | -------- | ------------------------------------------------------- |
| `hypixelNews`             | `object` | Hypixel news alert settings                             |
| `statusUpdates`           | `object` | Hypixel status update alert settings                    |
| `skyblockVersion`         | `object` | SkyBlock version alert settings                         |
| `alphaPlayerCountTracker` | `object` | Configuration for the alpha player count tracking alert |

#### hypixelNews

| Key        | Type      | Description                                  |
| ---------- | --------- | -------------------------------------------- |
| `enabled`  | `boolean` | Whether this Hypixel alert is enabled        |
| `interval` | `string`  | How often should the alert be ran (/checked) |

#### statusUpdates

| Key        | Type      | Description                                  |
| ---------- | --------- | -------------------------------------------- |
| `enabled`  | `boolean` | Whether this Hypixel alert is enabled        |
| `interval` | `string`  | How often should the alert be ran (/checked) |

#### skyblockVersion

| Key        | Type      | Description                                  |
| ---------- | --------- | -------------------------------------------- |
| `enabled`  | `boolean` | Whether this Hypixel alert is enabled        |
| `interval` | `string`  | How often should the alert be ran (/checked) |

#### alphaPlayerCountTracker

| Key               | Type      | Description                                      |
| ----------------- | --------- | ------------------------------------------------ |
| `enabled`         | `boolean` | Whether this Hypixel alert is enabled            |
| `interval`        | `string`  | How often should the alert be ran (/checked)     |
| `messageCooldown` | `string`  | The cooldown between alpha player count messages |
| `playerThreshold` | `number`  | The player count threshold to trigger an alert   |

### bot

| Key                | Type     | Description                                    |
| ------------------ | -------- | ---------------------------------------------- |
| `server`           | `string` | The Minecraft server address to connect to     |
| `port`             | `number` | The Minecraft server port to connect to        |
| `version`          | `string` | The Minecraft version                          |
| `accountsLocation` | `string` | The file path to Minecraft account credentials |

### fontRenderer

| Key            | Type                   | Description                                 |
| -------------- | ---------------------- | ------------------------------------------- |
| `target`       | `enum(modern, legecy)` | What rendering system should be used        |
| `maxLineWidth` | `number`               | How long should each line be                |
| `xPadding`     | `number`               | The horizontal padding around rendered text |
| `yPadding`     | `number`               | The vertical padding around rendered text   |
| `fontSize`     | `number`               | The size of the font                        |
| `shadowOffset` | `number`               | How big the shadow offset should be         |
| `skinToken`    | `string`               | What should the replacer for skins be       |
| `skinWidth`    | `number`               | The width of the skin                       |

## discord

| Key        | Type     | Description                                                 |
| ---------- | -------- | ----------------------------------------------------------- |
| `serverId` | `string` | The Discord server (guild) ID                               |
| `token`    | `string` | The Discord bot token used to authenticate                  |
| `commands` | `object` | Configuration for discord bot commands                      |
| `embeds`   | `object` | Configuration options for embeds and how they are displayed |

### commands

| Key             | Type            | Description                                                                              |
| --------------- | --------------- | ---------------------------------------------------------------------------------------- |
| `staffRole`     | `string`        | The discord role Id of your staff members                                                |
| `adminUsers`    | `array<string>` | The discord user Ids of any admins The people who own the bot are automatically included |
| `debugCommands` | `boolean`       | Should the debug commands be enabled                                                     |

### embeds

| Key              | Type                     | Description                                                 |
| ---------------- | ------------------------ | ----------------------------------------------------------- |
| `showTime`       | `boolean`                | Should the default generic embed show the current timestamp |
| `showDevFooters` | `boolean`                | Whether dev footers should be disabled or not               |
| `colors`         | `record<string, string>` | The default colors for embeds                               |

## verification

| Key          | Type      | Description                                        |
| ------------ | --------- | -------------------------------------------------- |
| `enabled`    | `boolean` | Whether verification is enabled                    |
| `nickname`   | `object`  | Configuration for automatic nickname updates       |
| `roles`      | `object`  | Configuration for verification roles               |
| `inactivity` | `object`  | Configuration for verification inactivity tracking |

### nickname

| Key            | Type      | Description                                                                                                 |
| -------------- | --------- | ----------------------------------------------------------------------------------------------------------- |
| `enabled`      | `boolean` | Whether verified user nicknames should be managed automatically                                             |
| `nickname`     | `string`  | The nickname format used for verified users. See docs/PlayerStatVaribles.md for list of supported variables |
| `removeCommas` | `boolean` | Whether commas should be removed from generated nicknames                                                   |

### roles

| Key           | Type                      | Description                                            |
| ------------- | ------------------------- | ------------------------------------------------------ |
| `verified`    | `object OR object`        | Role assigned to verified users                        |
| `guildMember` | `object OR object`        | Role assigned to guild members                         |
| `custom`      | `array<object OR object>` | Custom verification roles based on player requirements |
| `autoUpdater` | `object`                  | Configuration for automatic verification role updates  |

#### autoUpdater

| Key        | Type      | Description                                                |
| ---------- | --------- | ---------------------------------------------------------- |
| `enabled`  | `boolean` | Whether role auto-updating is enabled for verified users   |
| `interval` | `string`  | How often should all linked users have there roles updated |

### inactivity

| Key                 | Type      | Description                                                |
| ------------------- | --------- | ---------------------------------------------------------- |
| `enabled`           | `boolean` | Whether inactivity checks are enabled for verified users   |
| `maxInactivityTime` | `string`  | The maximum allowed inactivity time before action is taken |

## blacklist

| Key             | Type      | Description                                               |
| --------------- | --------- | --------------------------------------------------------- |
| `enabled`       | `boolean` | Whether the blacklist feature is enabled                  |
| `notifications` | `object`  | Configuration for blacklist notifications                 |
| `actions`       | `object`  | Configuration for actions taken against blacklisted users |

### notifications

| Key                 | Type      | Description                                                         |
| ------------------- | --------- | ------------------------------------------------------------------- |
| `onBlacklistChange` | `object`  | Configuration for notifications sent when a blacklist change occurs |
| `onJoinRequest`     | `boolean` | Whether join request notifications are enabled                      |
| `onUserJoinDiscord` | `boolean` | Whether Discord join notifications are enabled                      |

#### onBlacklistChange

| Key                | Type      | Description                                                                |
| ------------------ | --------- | -------------------------------------------------------------------------- |
| `enabled`          | `boolean` | Whether the user being blacklisted with be notified of blacklist changes   |
| `shareBlacklister` | `boolean` | Whether the user who blacklisted someone should be shared in notifications |

### actions

| Key              | Type      | Description                                                |
| ---------------- | --------- | ---------------------------------------------------------- |
| `blockBotAccess` | `boolean` | Whether blacklisted users are blocked from bot access      |
| `kickFromGuild`  | `object`  | Configuration for kicking blacklisted users from the guild |

#### kickFromGuild

| Key       | Type      | Description                                               |
| --------- | --------- | --------------------------------------------------------- |
| `enabled` | `boolean` | Whether blacklisted users should be kicked from the guild |
| `reason`  | `string`  | The reason used when kicking a player from the guild      |

## statsChannels

| Key           | Type            | Description                                       |
| ------------- | --------------- | ------------------------------------------------- |
| `enabled`     | `boolean`       | Whether stats channels are enabled                |
| `autoUpdater` | `object`        | Configuration for automatic stats channel updates |
| `channels`    | `array<object>` | The stats channels to maintain                    |

### autoUpdater

| Key        | Type      | Description                                    |
| ---------- | --------- | ---------------------------------------------- |
| `enabled`  | `boolean` | Whether stats channel auto-updating is enabled |
| `interval` | `string`  | How often stats channels are updated           |

## other

| Key             | Type      | Description                                             |
| --------------- | --------- | ------------------------------------------------------- |
| `backupConfigs` | `boolean` | Whether backup copies of config files should be created |
| `logger`        | `object`  | Configuration options for the logger                    |

### logger

| Key                         | Type      | Description                                         |
| --------------------------- | --------- | --------------------------------------------------- |
| `saveToFiles`               | `boolean` | Whether log output should be written to files       |
| `location`                  | `string`  | The location of where these files should be saved   |
| `warningForDisabledChannel` | `boolean` | Whether the channel disabled warning should be sent |

---

This document is [auto generated](/scripts/docs/Configuration.ts) and was last updated on `Sat, 26 Sep 2026 14:19:42 GMT` (`1790432382319`)

To update this document please run `pnpm docgen` or contact a maintainer and ask them to update it.

---

If you need any help help consider checking out the [FAQ](/docs/FrequentlyAskedQuestions.md)

Feel free to reach out to the maintainers directly on Discord. [@duckysolucky](https://discord.com/users/486155512568741900),
[@.kathund](https://discord.com/users/1276524855445164098)
