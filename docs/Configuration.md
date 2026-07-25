# Configuration

This document is generated from the Zod config schema in `src/types/config.ts`

# <Root>

| Key             | Type     | Required | Description                                          |
| --------------- | -------- | -------- | ---------------------------------------------------- |
| `$schema`       | `string` | Yes      |                                                      |
| `configVersion` | `number` | Yes      | !IMPORTANT DO NOT TOUCH Config format version number |
| `API`           | `object` | Yes      |                                                      |
| `bridge`        | `object` | Yes      |                                                      |
| `minecraft`     | `object` | Yes      |                                                      |
| `discord`       | `object` | Yes      |                                                      |
| `verification`  | `object` | Yes      |                                                      |
| `blacklist`     | `object` | Yes      |                                                      |
| `statsChannels` | `object` | Yes      |                                                      |
| `other`         | `object` | Yes      |                                                      |

## API

| Key        | Type     | Required | Description |
| ---------- | -------- | -------- | ----------- |
| `hypixel`  | `object` | Yes      |             |
| `mowojang` | `object` | Yes      |             |

### hypixel

| Key       | Type             | Required | Description                                                                         |
| --------- | ---------------- | -------- | ----------------------------------------------------------------------------------- |
| `key`     | `string`         | Yes      |                                                                                     |
| `baseURL` | `string OR null` | Yes      | The base URL for the Hypixel API. If null, the default Hypixel API URL will be used |

### mowojang

| Key       | Type             | Required | Description                                                                           |
| --------- | ---------------- | -------- | ------------------------------------------------------------------------------------- |
| `baseURL` | `string OR null` | Yes      | The base URL for the Mowojang API. If null, the default Mowojang API URL will be used |

## bridge

| Key                        | Type      | Required | Description |
| -------------------------- | --------- | -------- | ----------- |
| `minecraft`                | `object`  | Yes      |             |
| `discord`                  | `object`  | Yes      |             |
| `channels`                 | `object`  | Yes      |             |
| `filter`                   | `object`  | Yes      |             |
| `stripEmojisFromUsernames` | `boolean` | Yes      |             |

### minecraft

| Key      | Type     | Required | Description                                                                                                                           |
| -------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `format` | `string` | Yes      | The format for messages sent from Discord to Minecraft Use {username} for the player's username and {message} for the message content |

### discord

| Key           | Type                            | Required | Description                                                                                                                                                         |
| ------------- | ------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowedBots` | `array<string>`                 | Yes      | Array of discord User Ids                                                                                                                                           |
| `mode`        | `enum(bot, webhook, minecraft)` | Yes      |                                                                                                                                                                     |
| `format`      | `string`                        | Yes      | The format for messages sent from Minecraft to Discord Only used with `minecraft` mode Supported arguments: {chatType}, {username}, {rank}, {guildRank}, {username} |

### channels

| Key       | Type     | Required | Description |
| --------- | -------- | -------- | ----------- |
| `debug`   | `object` | Yes      |             |
| `guild`   | `object` | Yes      |             |
| `officer` | `object` | Yes      |             |
| `logging` | `object` | Yes      |             |

#### debug

| Key       | Type             | Required | Description                                                         |
| --------- | ---------------- | -------- | ------------------------------------------------------------------- |
| `enabled` | `boolean`        | Yes      |                                                                     |
| `channel` | `string OR null` | Yes      | Discord channel id. If null, an auto-generated channel will be used |

#### guild

| Key       | Type             | Required | Description                                                         |
| --------- | ---------------- | -------- | ------------------------------------------------------------------- |
| `enabled` | `boolean`        | Yes      |                                                                     |
| `channel` | `string OR null` | Yes      | Discord channel id. If null, an auto-generated channel will be used |

#### officer

| Key       | Type             | Required | Description                                                         |
| --------- | ---------------- | -------- | ------------------------------------------------------------------- |
| `enabled` | `boolean`        | Yes      |                                                                     |
| `channel` | `string OR null` | Yes      | Discord channel id. If null, an auto-generated channel will be used |

#### logging

| Key        | Type             | Required | Description                                                         |
| ---------- | ---------------- | -------- | ------------------------------------------------------------------- |
| `enabled`  | `boolean`        | Yes      |                                                                     |
| `channel`  | `string OR null` | Yes      | Discord channel id. If null, an auto-generated channel will be used |
| `channels` | `object`         | Yes      |                                                                     |

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
| `enabled`     | `boolean`       | Yes      |                                                 |
| `customWords` | `array<string>` | Yes      | Custom words used for filtering bridge messages |

## minecraft

| Key             | Type     | Required | Description |
| --------------- | -------- | -------- | ----------- |
| `commands`      | `object` | Yes      |             |
| `guild`         | `object` | Yes      |             |
| `hypixelAlerts` | `object` | Yes      |             |
| `bot`           | `object` | Yes      |             |

### commands

| Key                         | Type     | Required | Description |
| --------------------------- | -------- | -------- | ----------- |
| `messageRepeatBypassLength` | `number` | Yes      |             |
| `maxMessageLength`          | `number` | Yes      |             |
| `normal`                    | `object` | Yes      |             |
| `soopy`                     | `object` | Yes      |             |

#### normal

| Key       | Type      | Required | Description |
| --------- | --------- | -------- | ----------- |
| `enabled` | `boolean` | Yes      |             |
| `prefix`  | `string`  | Yes      |             |

#### soopy

| Key       | Type      | Required | Description |
| --------- | --------- | -------- | ----------- |
| `enabled` | `boolean` | Yes      |             |
| `prefix`  | `string`  | Yes      |             |

### guild

| Key            | Type     | Required | Description |
| -------------- | -------- | -------- | ----------- |
| `requirements` | `object` | Yes      |             |

#### requirements

| Key                        | Type                     | Required | Description                                                                             |
| -------------------------- | ------------------------ | -------- | --------------------------------------------------------------------------------------- |
| `enabled`                  | `boolean`                | Yes      |                                                                                         |
| `autoAccept`               | `boolean`                | Yes      | Whether new guild members are automatically accepted if they have pass the requirements |
| `requirementsNeededToPass` | `number`                 | Yes      | The number of requirements a player must meet to pass                                   |
| `requirements`             | `record<string, number>` | Yes      |                                                                                         |

### hypixelAlerts

| Key                       | Type     | Required | Description |
| ------------------------- | -------- | -------- | ----------- |
| `hypixelNews`             | `object` | Yes      |             |
| `statusUpdates`           | `object` | Yes      |             |
| `skyblockVersion`         | `object` | Yes      |             |
| `alphaPlayerCountTracker` | `object` | Yes      |             |

#### hypixelNews

| Key        | Type      | Required | Description                                  |
| ---------- | --------- | -------- | -------------------------------------------- |
| `enabled`  | `boolean` | Yes      |                                              |
| `interval` | `string`  | Yes      | How often should the alert be ran (/checked) |

#### statusUpdates

| Key        | Type      | Required | Description                                  |
| ---------- | --------- | -------- | -------------------------------------------- |
| `enabled`  | `boolean` | Yes      |                                              |
| `interval` | `string`  | Yes      | How often should the alert be ran (/checked) |

#### skyblockVersion

| Key        | Type      | Required | Description                                  |
| ---------- | --------- | -------- | -------------------------------------------- |
| `enabled`  | `boolean` | Yes      |                                              |
| `interval` | `string`  | Yes      | How often should the alert be ran (/checked) |

#### alphaPlayerCountTracker

| Key               | Type      | Required | Description                                      |
| ----------------- | --------- | -------- | ------------------------------------------------ |
| `enabled`         | `boolean` | Yes      |                                                  |
| `interval`        | `string`  | Yes      | How often should the alert be ran (/checked)     |
| `messageCooldown` | `string`  | Yes      | The cooldown between alpha player count messages |
| `playerThreshold` | `number`  | Yes      | The player count threshold to trigger an alert   |

### bot

| Key                | Type     | Required | Description                                    |
| ------------------ | -------- | -------- | ---------------------------------------------- |
| `server`           | `string` | Yes      |                                                |
| `port`             | `number` | Yes      |                                                |
| `version`          | `string` | Yes      | The Minecraft version                          |
| `accountsLocation` | `string` | Yes      | The file path to Minecraft account credentials |

## discord

| Key        | Type     | Required | Description                                |
| ---------- | -------- | -------- | ------------------------------------------ |
| `serverId` | `string` | Yes      | The Discord server (guild) ID              |
| `token`    | `string` | Yes      | The Discord bot token used to authenticate |
| `commands` | `object` | Yes      |                                            |

### commands

| Key                | Type            | Required | Description                                                                              |
| ------------------ | --------------- | -------- | ---------------------------------------------------------------------------------------- |
| `checkPermissions` | `boolean`       | Yes      |                                                                                          |
| `staffRole`        | `string`        | Yes      | The discord role Id of your staff members                                                |
| `adminUsers`       | `array<string>` | Yes      | The discord user Ids of any admins The people who own the bot are automatically included |

## verification

| Key          | Type      | Required | Description |
| ------------ | --------- | -------- | ----------- |
| `enabled`    | `boolean` | Yes      |             |
| `nickname`   | `object`  | Yes      |             |
| `roles`      | `object`  | Yes      |             |
| `inactivity` | `object`  | Yes      |             |

### nickname

| Key            | Type      | Required | Description                                                                                                 |
| -------------- | --------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| `enabled`      | `boolean` | Yes      |                                                                                                             |
| `nickname`     | `string`  | Yes      | The nickname format used for verified users. See docs/PlayerStatVaribles.md for list of supported variables |
| `removeCommas` | `boolean` | Yes      | Whether commas should be removed from generated nicknames                                                   |

### roles

| Key           | Type                      | Required | Description |
| ------------- | ------------------------- | -------- | ----------- |
| `verified`    | `object OR object`        | Yes      |             |
| `guildMember` | `object OR object`        | Yes      |             |
| `custom`      | `array<object OR object>` | Yes      |             |
| `autoUpdater` | `object`                  | Yes      |             |

#### autoUpdater

| Key        | Type      | Required | Description                                                |
| ---------- | --------- | -------- | ---------------------------------------------------------- |
| `enabled`  | `boolean` | Yes      |                                                            |
| `interval` | `string`  | Yes      | How often should all linked users have there roles updated |

### inactivity

| Key                 | Type      | Required | Description                                                |
| ------------------- | --------- | -------- | ---------------------------------------------------------- |
| `enabled`           | `boolean` | Yes      |                                                            |
| `maxInactivityTime` | `string`  | Yes      | The maximum allowed inactivity time before action is taken |

## blacklist

| Key             | Type      | Required | Description |
| --------------- | --------- | -------- | ----------- |
| `enabled`       | `boolean` | Yes      |             |
| `notifications` | `object`  | Yes      |             |
| `actions`       | `object`  | Yes      |             |

### notifications

| Key                 | Type      | Required | Description                                    |
| ------------------- | --------- | -------- | ---------------------------------------------- |
| `onBlacklistChange` | `object`  | Yes      |                                                |
| `onJoinRequest`     | `boolean` | Yes      | Whether join request notifications are enabled |
| `onUserJoinDiscord` | `boolean` | Yes      | Whether Discord join notifications are enabled |

#### onBlacklistChange

| Key                | Type      | Required | Description                                                                |
| ------------------ | --------- | -------- | -------------------------------------------------------------------------- |
| `enabled`          | `boolean` | Yes      | Whether the user being blacklisted with be notified of blacklist changes   |
| `shareBlacklister` | `boolean` | Yes      | Whether the user who blacklisted someone should be shared in notifications |

### actions

| Key              | Type      | Required | Description                                           |
| ---------------- | --------- | -------- | ----------------------------------------------------- |
| `blockBotAccess` | `boolean` | Yes      | Whether blacklisted users are blocked from bot access |
| `kickFromGuild`  | `object`  | Yes      |                                                       |

#### kickFromGuild

| Key       | Type      | Required | Description                                          |
| --------- | --------- | -------- | ---------------------------------------------------- |
| `enabled` | `boolean` | Yes      |                                                      |
| `reason`  | `string`  | Yes      | The reason used when kicking a player from the guild |

## statsChannels

| Key           | Type            | Required | Description |
| ------------- | --------------- | -------- | ----------- |
| `enabled`     | `boolean`       | Yes      |             |
| `autoUpdater` | `object`        | Yes      |             |
| `channels`    | `array<object>` | Yes      |             |

### autoUpdater

| Key        | Type      | Required | Description                          |
| ---------- | --------- | -------- | ------------------------------------ |
| `enabled`  | `boolean` | Yes      |                                      |
| `interval` | `string`  | Yes      | How often stats channels are updated |

## other

| Key             | Type                     | Required | Description                                             |
| --------------- | ------------------------ | -------- | ------------------------------------------------------- |
| `colors`        | `record<string, string>` | Yes      |                                                         |
| `backupConfigs` | `boolean`                | Yes      | Whether backup copies of config files should be created |
| `logToFiles`    | `boolean`                | Yes      | Whether log output should be written to files           |

---

This document is [auto generated](../scripts/generateConfigurationDocs.ts).

To update this please use `pnpm docgen`

---

If you need any help help consider checking out the [FAQ](FAQ.md)

Feel free to reach out to the maintainers directly on Discord. [@duckysolucky](https://discord.com/users/486155512568741900) and
[@.kathund](https://discord.com/users/1276524855445164098)
