# Permissions

| Name   | Description                                                                        |
| ------ | ---------------------------------------------------------------------------------- |
| Admin  | Your admin team. People will with this will be able to anything with the bot       |
| Staff  | Your staff team. Members who are verified and have the staffRole set in the config |
| Anyone | Kinda in the title. Any user                                                       |

Permissions will fall down. This means any Admin will also be able to use any staff command

# Commands

`()` = **required** argument, `[]` = **optional** argument

`u` = Minecraft Username

## Minecraft Commands

Minecraft commands can be executed from any chat channel that the bot can see. This includes guild and officer chat.

| Command              | Description                                                                   | Aliases                                                | Syntax                     | Permission |
| -------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------ | -------------------------- | ---------- |
| `8ball`              | Ask an 8ball a question.                                                      | 8b                                                     | `!8ball (question)`        | Anyone     |
| `accessories`        | Accessories of specified user.                                                | acc, talismans, talisman, mp, magicpower               | `!accessories [u]`         | Anyone     |
| `bedwars`            | BedWars stats of specified user.                                              | bw, bws                                                | `!bedwars [u]`             | Anyone     |
| `bestiary`           | Bestiary of specified user.                                                   | be                                                     | `!bestiary [u]`            | Anyone     |
| `blitzsurvivalgames` | Blitz Survival Games stats of specified user.                                 | blitz, blitzsg, bsg                                    | `!blitzsurvivalgames [u]`  | Anyone     |
| `boo`                | Boo someone!                                                                  | None                                                   | `!boo (u)`                 | Anyone     |
| `boop`               | Boop someone!                                                                 | bp                                                     | `!boop (u)`                | Anyone     |
| `buildbattle`        | Build Battle Stats of specified user.                                         | bb                                                     | `!buildbattle [u]`         | Anyone     |
| `calculate`          | Calculate.                                                                    | math, calc                                             | `!calculate (calculation)` | Anyone     |
| `catacombs`          | Skyblock Dungeons Stats of specified user.                                    | cata, dungeons                                         | `!catacombs [u]`           | Anyone     |
| `chocolatefactory`   | Skyblock Chocolate Factory Stats of specified user.                           | cf, factory, chocolate                                 | `!chocolatefactory [u]`    | Anyone     |
| `coinflip`           | Flips a coin.                                                                 | coin                                                   | `!coinflip`                | Anyone     |
| `crimsonisle`        | Crimson Isle Stats of specified user.                                         | crimson, nether, isle                                  | `!crimsonisle [u]`         | Anyone     |
| `dojo`               | Dojo Stats of specified user.                                                 | None                                                   | `!dojo [u]`                | Anyone     |
| `duels`              | Duel stats of specified user.                                                 | d                                                      | `!duels [u]`               | Anyone     |
| `essence`            | Skyblock Dungeons Stats of specified user.                                    | None                                                   | `!essence [u]`             | Anyone     |
| `fairysouls`         | Fairy Souls of specified user.                                                | fs, fairysoul                                          | `!fairysouls [u]`          | Anyone     |
| `floor`              | Returns stats about a floor                                                   | f1, f2, f3, f4, f5, f6, f7, m1, m2, m3, m4, m5, m6, m7 | `!floor [u]`               | Anyone     |
| `forge`              | Skyblock Forge Info Stats of specified user.                                  | None                                                   | `!forge [u]`               | Anyone     |
| `garden`             | Skyblock Garden Stats of specified user.                                      | None                                                   | `!garden [u]`              | Anyone     |
| `guild`              | View information of a guild                                                   | g                                                      | `!guild (guild)`           | Anyone     |
| `guildexp`           | Guilds experience of specified user.                                          | gexp                                                   | `!guildexp [u]`            | Anyone     |
| `guildof`            | View the player's guild                                                       | gof, guildofplayer, gop                                | `!guildof (player)`        | Anyone     |
| `hotm`               | Skyblock Hotm Stats of specified user.                                        | mining                                                 | `!hotm [u]`                | Anyone     |
| `jacob`              | Jacob's Contest Stats of specified user.                                      | jacobs, jacobcontest, contest                          | `!jacob [u]`               | Anyone     |
| `kuudra`             | Kuudra Stats of specified user.                                               | None                                                   | `!kuudra [u]`              | Anyone     |
| `mayor`              | Skyblock Mayor.                                                               | None                                                   | `!mayor`                   | Anyone     |
| `megawalls`          | View the Megawalls stats of a player                                          | mw                                                     | `!megawalls [u]`           | Anyone     |
| `meow`               | meow                                                                          | mrrp, mrrow, miau, mauww, meep, :3, nja, nya, awawa    | `!meow`                    | Anyone     |
| `murdermystery`      | Get Murder Mystery Player Stats                                               | mm                                                     | `!murdermystery [u]`       | Anyone     |
| `networth`           | Networth of specified user.                                                   | nw                                                     | `!networth (u)`            | Anyone     |
| `player`             | Get Hypixel Player Stats                                                      | None                                                   | `!player [u]`              | Anyone     |
| `skills`             | Skills and Skill Average of specified user.                                   | skill, sa                                              | `!skills [u]`              | Anyone     |
| `level`              | Skyblock Level of specified user.                                             | lvl                                                    | `!level [u]`               | Anyone     |
| `skywars`            | Skywars stats of specified user.                                              | sw                                                     | `!skywars [u]`             | Anyone     |
| `skyblock`           | Skyblock Stats of specified user.                                             | stats, sb                                              | `!skyblock [u]`            | Anyone     |
| `slayer`             | Slayer of specified user.                                                     | slayers                                                | `!slayer [u]`              | Anyone     |
| `specialmayor`       | How many years until next special mayor, along with speculated special mayor. | specmayor                                              | `!specialmayor`            | Anyone     |
| `trophyfish`         | Trophy Fish Stats of specified user.                                          | tf, trophyfishing, trophy                              | `!trophyfish [u]`          | Anyone     |
| `warpout`            | Warp player out of the game                                                   | warp                                                   | `!warpout [u]`             | Anyone     |
| `woolwars`           | WoolWars stats of specified user.                                             | ww                                                     | `!woolwars [u]`            | Anyone     |

## Discord Commands

| Command                | Description                                            | Syntax                                    | Permission |
| ---------------------- | ------------------------------------------------------ | ----------------------------------------- | ---------- |
| `blacklist`            | Blacklist a user                                       | `/blacklist [add] [remove] [get]`         | Staff      |
| `credits`              | Shows the credits of the people who make this possible | `/credits`                                | Anyone     |
| `execute`              | Executes commands as the minecraft bot.                | `/execute (command)`                      | Admin      |
| `force-execute-script` | Allows executing scripts                               | `/force-execute-script (script-name)`     | Staff      |
| `help`                 | Shows the help menu.                                   | `/help [command]`                         | Anyone     |
| `information`          | Shows information about the bot.                       | `/information`                            | Anyone     |
| `ping`                 | Show the latency of the bot.                           | `/ping`                                   | Anyone     |
| `requirements`         | Check a user's requirements to join the guild          | `/requirements [u]`                       | Anyone     |
| `restart`              | Restarts the bot.                                      | `/restart`                                | Staff      |
| `uptime`               | Shows the uptime of the bot.                           | `/uptime`                                 | Anyone     |
| `force-unverify`       | Remove a linked Minecraft account                      | `/force-unverify (user)`                  | Staff      |
| `force-update`         | Update user's roles                                    | `/force-update (user)`                    | Staff      |
| `force-verify`         | Connect Discord account to a Minecraft                 | `/force-verify (user) (u)`                | Staff      |
| `linked`               | View who a user is linked to                           | `/linked [user] [u]`                      | Staff      |
| `unverify`             | Remove your linked Minecraft account                   | `/unverify`                               | Anyone     |
| `update`               | Update your current roles                              | `/update`                                 | Anyone     |
| `verify`               | Connect your Discord account to Minecraft              | `/verify (u)`                             | Anyone     |
| `gexp-check`           | Shows everyone under an set amount of gexp             | `/gexp-check (requirement)`               | Staff      |
| `inactivity`           | Send an inactivity notice to the guild staff           | `/inactivity (time) [reason]`             | Anyone     |
| `manage-inactivity`    | Manage inactivity                                      | `/manage-inactivity [add] [delete] [get]` | Staff      |
| `guildtop`             | Top 10 members with the most guild experience.         | `/guildtop [time]`                        | Anyone     |
| `list`                 | List of guild members.                                 | `/list`                                   | Anyone     |
| `online`               | List of online members.                                | `/online`                                 | Anyone     |
| `demote`               | Demotes the given user by one guild rank.              | `/demote (u)`                             | Staff      |
| `invite`               | Invites the given user to the guild.                   | `/invite (u)`                             | Staff      |
| `kick`                 | Kicks the given user to the guild.                     | `/kick (u) (reason)`                      | Staff      |
| `mute`                 | Mutes the given user for a given amount of time.       | `/mute (u) (time)`                        | Staff      |
| `promote`              | Promote the given user by one guild rank.              | `/promote (u)`                            | Staff      |
| `set-rank`             | Set rank of the given user.                            | `/set-rank (u) (rank)`                    | Staff      |
| `unmute`               | Unmute the given user.                                 | `/unmute (u)`                             | Staff      |

---

This document is [auto generated](../scripts/generateCommandsDocs.ts).

To update this please use `pnpm docgen`

---

If you need any help help consider checking out the [FAQ](FAQ.md)

Feel free to reach out to the maintainers directly on Discord. [@duckysolucky](https://discord.com/users/486155512568741900) and
[@.kathund](https://discord.com/users/1276524855445164098)
