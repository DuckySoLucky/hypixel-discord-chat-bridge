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
      this.send(`/gc https://imgur.com/lXwXJhd.png`);
    } catch (error) {
      this.send("/gc Something went wrong..");
    }
  }
}

module.exports = HelpCommand;
