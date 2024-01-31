// eslint-disable-next-line import/extensions
const { Routes } = require("discord-api-types/v9");
const config = require("../../config.json");
const { REST } = require("@discordjs/rest");
const fs = require("fs");

class CommandHandler {
  constructor(discord) {
    this.discord = discord;

    const commands = [];
    const commandFiles = fs.readdirSync("src/replication/commands").filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      commands.push(command);
    }

    const rest = new REST({ version: "10" }).setToken(config.discord.replication.token);

    const clientID = Buffer.from(config.discord.replication.token.split(".")[0], "base64").toString("ascii");

    rest
      .put(Routes.applicationGuildCommands(clientID, config.discord.replication.serverID), { body: commands })
      .catch(console.error);
  }
}

module.exports = CommandHandler;
