const minecraftCommand = require("../../contracts/minecraftCommand.js");

class HelpCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "help";
    this.aliases = ["info"];
    this.description = "Shows help menu";
    this.options = [];
  }

  onCommand(username, message) {
    try {
      this.send(`/gc https://imgur.com/jUX06BC.png`);
    } catch (error) {
      this.send("/gc [ERROR] Something went wrong..");
    }
  }
}

module.exports = HelpCommand;
