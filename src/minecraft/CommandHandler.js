const { Collection } = require("discord.js");
const config = require("../../config.json");
const Logger = require("../Logger");
const fs = require("fs");

class CommandHandler {
  constructor(minecraft) {
    this.minecraft = minecraft;

    this.prefix = config.minecraft.prefix;
    this.commands = new Collection();

    let commandFiles = fs.readdirSync("./src/minecraft/commands").filter((file) => file.endsWith(".js"));
    global.minecraftCommandList = [];
    for (const file of commandFiles) {
      const command = new (require(`./commands/${file}`))(minecraft);
      minecraftCommandList.push(command);

      this.commands.set(command.name, command);
    }
  }

  handle(player, message) {
    if (!message.startsWith(this.prefix)) return false;

    let args = message.slice(this.prefix.length).trim().split(/ +/);
    let commandName = args.shift().toLowerCase();
    let command = this.commands.get(commandName) || this.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return false;

    Logger.minecraftMessage(`${player} - [${command.name}] ${message}`);
    command.onCommand(player, message);

    return true;
  }
}

module.exports = CommandHandler;
