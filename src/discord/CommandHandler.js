const { REST, Routes } = require("discord.js");
const config = require("../../config.json");
const fs = require("fs");

class CommandHandler {
  constructor(discord) {
    this.discord = discord;

    const commands = [];
    const commandFiles = fs.readdirSync("src/discord/commands").filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      if (command.verificationCommand === true && config.verification.enabled === false) continue;
      if (command.channelsCommand === true && config.statsChannels.enabled === false) continue;
      commands.push({ contexts: [0], integration_types: [0], ...command });
    }

    const rest = new REST({ version: "10" }).setToken(config.discord.bot.token);

    const clientID = Buffer.from(config.discord.bot.token.split(".")[0], "base64").toString("ascii");

    rest
      .put(Routes.applicationGuildCommands(clientID, config.discord.bot.serverID), { body: commands })
      .catch((e) => console.error(e));
  }
}

module.exports = CommandHandler;
