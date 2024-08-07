const minecraftCommand = require("../../contracts/minecraftCommand.js");

class HelpCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "help";
    this.aliases = ["info"];
    this.description = "Shows help menu";
    this.options = [];
  }

  onCommand(username, message, officer) {
    try {
      this.send(`https://i.imgur.com/NsB9IuC.png`, officer);
    } catch (error) {
      this.send("[ERROR] Something went wrong..", officer);
    }
  }
}

module.exports = HelpCommand;
