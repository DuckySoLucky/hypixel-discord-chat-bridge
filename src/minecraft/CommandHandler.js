const { Collection } = require("discord.js");
const Logger = require("../Logger.js");
const config = require("../../config.json");
const fs = require("fs");

class CommandHandler {
  constructor(minecraft) {
    this.minecraft = minecraft;

    this.prefix = config.minecraft.bot.prefix;
    this.commands = new Collection();

    const commandFiles = fs.readdirSync("./src/minecraft/commands").filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = new (require(`./commands/${file}`))(minecraft);

      this.commands.set(command.name, command);
    }
  }

  handle(player, message, command_channel = "gc") {
    if (message.startsWith(this.prefix)) {
      if (config.minecraft.commands.normal === false) {
        return;
      }

      const args = message.slice(this.prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command =
        this.commands.get(commandName) ?? this.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

      if (command === undefined) {
        return;
      }

      Logger.minecraftMessage(`${player} - [${command.name}] ${message}`);
      command.onCommand(player, message, command_channel);
      return true;
    }
  }
}

module.exports = CommandHandler;
