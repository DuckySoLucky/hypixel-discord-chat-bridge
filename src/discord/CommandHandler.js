// eslint-disable-next-line import/extensions
const { Routes } = require("discord-api-types/v9");
const config = require("../../config.json");
const { REST } = require("@discordjs/rest");
const { Collection } = require('discord.js')
const Logger = require(".././Logger.js");

const fs = require("fs");

class CommandHandler {
  constructor(discord) {
    this.discord = discord;

    const commands = [];
    const commandFiles = fs.readdirSync("src/discord/commands").filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      if (command.verificationCommand === true && config.verification.enabled === false) {
        continue;
      }

      commands.push(command);
    }

    const rest = new REST({ version: "10" }).setToken(config.discord.bot.token);

    const clientID = Buffer.from(config.discord.bot.token.split(".")[0], "base64").toString("ascii");

    rest
      .put(Routes.applicationGuildCommands(clientID, config.discord.bot.serverID), { body: commands })
      .catch(console.error);


    this.prefix = config.discord.commands.prefix
    this.oldcommands = new Collection()
    let oldcommandFiles = fs.readdirSync('./src/discord/oldcommands').filter(file => file.endsWith('.js'))
    for (const file of oldcommandFiles) {
      const oldcommand = new (require(`./oldcommands/${file}`))(discord)
      this.oldcommands.set(oldcommand.name, oldcommand)
    }
  }

  handle(message) {

    if (!message.content.startsWith(this.prefix)) {
      return false
    }

    let args = message.content.slice(this.prefix.length).trim().split(/ +/)
    let commandName = args.shift().toLowerCase()

    let command = this.oldcommands.get(commandName)
      || this.oldcommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

    if (!command) {
      return false
    }
    if (command.permission == "all") {
      Logger.webMessage(`[${command.name}] ${message.content}`)
      command.onCommand(message)
    }
    else if (command.permission == "commander") {
      if (!this.isCommander(message.member)) {
        return message.channel.send({
          embeds: [{
            description: `You don't have permission to do that.`,
            color: 0xDC143C
          }]
        })
      } else {
        Logger.webMessage(`[${command.name}] ${message.content}`)
        command.onCommand(message)
      }
    }
    else if (command.permission == "mod") {
      if (!this.isMod(message.member)) {
        return message.channel.send({
          embeds: [{
            description: `You don't have permission to do that.`,
            color: 0xDC143C
          }]
        })
      } else {
        Logger.webMessage(`[${command.name}] ${message.content}`)
        command.onCommand(message)
      }
    }
    else {
      return message.channel.send({
        embeds: [{
          description: `Error, yell at Aza.`,
          color: 0xDC143C
        }]
      })
    }
  }

  isCommander(member) {
    return (
      member.roles.cache.find(r => r.id == config.discord.commands.commandRole) ||
      config.discord.commands.users.includes(member.id)
    )
  }
  isMod(member) {
    return (
      member.roles.cache.find(r => r.id == config.discord.commands.modRole) ||
      config.discord.commands.users.includes(member.id)
    );
  }
  isOwner(member) {
    return member.id == this.discord.app.config.discord.ownerId
  }
  isDyno(member) {
    return member.id == "752236274261426212"
  }
}

module.exports = CommandHandler;
