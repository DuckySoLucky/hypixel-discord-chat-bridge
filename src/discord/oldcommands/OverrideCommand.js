const DiscordCommand = require('../../contracts/DiscordCommand')

const config = require("../../../config.json");

class OverrideCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)
    this.name = 'override'
    this.aliases = ['o']
    this.permission = "mod"
    this.description = 'Executes commands as the minecraft bot'
  }

  onCommand(message) {
    let args = message.content.trim().split(/\s+/);

    if (args.length < 2 || args[1].toLowerCase() !== 'sky') {
      return;
    }
    
    // Remove the command and the keyword 'aria'
    console.log(args)
    args.shift(); // Remove the command part
    console.log(args)
    args.shift(); // Remove the 'aria' part
    console.log(args)
    if (args.length == 0) {
      return message.reply(`No command specified`);
    }

    let command = args.join(' ');

    this.sendMinecraftMessage(`/${command}`);

    message.reply(`\`/${command}\` has been executed in Bakacord`);
}
}

module.exports = OverrideCommand
