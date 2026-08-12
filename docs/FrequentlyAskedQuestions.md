# Frequently Asked Questions

- [Frequently Asked Questions](#frequently-asked-questions)
  - [How to setup the Discord Bot](#how-to-setup-the-discord-bot)
  - [How to get an Hypixel API Key](#how-to-get-an-hypixel-api-key)
  - [Use the account while it is connected](#use-the-account-while-it-is-connected)
  - [How do I add a Minecraft Account](#how-do-i-add-a-minecraft-account)
  - [How do I remove a Minecraft Account](#how-do-i-remove-an-minecraft-account)
  - [How do I manage the profanity filter](#how-do-i-manage-the-profanity-filter)
  - [How do I get extra help](#how-do-i-get-extra-help)

## How to setup the Discord Bot

Discord.js has an good guide on how to create a discord bot linked [here](https://discordjs.guide/legacy/preparations/app-setup)

Make sure to enable all the intents as they are needed to run the bot

## How to get an hypixel api key

Get hypixel key at [Hypixel Developer Dashboard](https://developer.hypixel.net). Make an application for a key and wait for its activation.

> Do **NOT generate and use developing key** for the application!

## Use the account while it is connected

Only application administrators have the permission to execute arbitrarily commands.

From Discord via slash commands: `/execute guild party` will run `/guild party` in game as the bot

## How do I add a Minecraft Account

When you first start the bot you will be given an Microsoft login message that looks like this

> [msa] First time signing in. Please authenticate now: To sign in, use a web browser to open the page https://www.microsoft.com/link and use the code XXXXXXXX or visit
> http://microsoft.com/link?otc=XXXXXXXX

Click the Microsoft link that you are given and sign into the account

## How do I remove an Minecraft Account

Delete the `auth-cache` folder

## How do I manage the profanity filter

In the `config.json` under bridge there is the filter options. From there you can either fully disable it or add custom words to the filter

## How do I get extra help

You can get extra help by reaching out to the maintainers dirrectly on discord. [@duckysolucky](https://discord.com/users/486155512568741900) and
[@.kathund](https://discord.com/users/1276524855445164098)
