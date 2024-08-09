// eslint-disable-next-line import/extensions
const { Routes } = require("discord-api-types/v9");
const config = require("../../config.json");
const { REST } = require("@discordjs/rest");
const fs = require("fs");

class CommandHandler {
  constructor(discord) {
    this.discord = discord;

    let commands = [];
    const commandFiles = fs.readdirSync("src/discord/commands").filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      if (command.verificationCommand === true && config.verification.enabled === false) {
        continue;
      }

      commands.push(command);
    }

    if (config.tickets.enabled === false) {
      commands = commands.filter((command) => !command.ticketCommand);
    }

    const rest = new REST({ version: "10" }).setToken(config.discord.bot.token);

    const clientID = Buffer.from(config.discord.bot.token.split(".")[0], "base64").toString("ascii");

    rest
      .put(Routes.applicationGuildCommands(clientID, config.discord.bot.serverID), { body: commands })
      .catch(console.error);
  }
}

module.exports = CommandHandler;
