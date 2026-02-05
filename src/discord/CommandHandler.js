const { REST, Routes, Collection } = require("discord.js");
const config = require("../../config.json");
const fs = require("fs");

class CommandHandler {
  constructor(discord) {
    this.discord = discord;
  }

  async loadCommands() {
    const commands = [];
    this.discord.client.commands = new Collection();
    const commandFiles = fs.readdirSync("src/discord/commands").filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      if (command.inactivityCommand === true && config.verification.inactivity.enabled == false) {
        continue;
      }

      if (command.verificationCommand === true && config.verification.enabled === false) {
        continue;
      }

      if (command.channelsCommand === true && config.statsChannels.enabled === false) {
        continue;
      }
      commands.push(command.data.toJSON());
      this.discord.client.commands.set(command.data.name, command);
    }

    const rest = new REST({ version: "10" }).setToken(config.discord.bot.token);

    const clientID = Buffer.from(config.discord.bot.token.split(".")[0], "base64").toString("ascii");

    await rest.put(Routes.applicationGuildCommands(clientID, config.discord.bot.serverID), { body: commands }).catch((e) => console.error(e));
    console.discord(`Successfully reloaded ${commands.length} application command(s).`);
  }
}

module.exports = CommandHandler;
