const minecraftCommand = require("../../contracts/minecraftCommand.js");

class helpCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "help";
    this.aliases = ["info"];
    this.description = "Shows help menu";
    this.options = [];
    this.optionsDescription = [];
  }

  onCommand(username, message) {
    try {
      this.send(`/gc https://imgur.com/4LoDwPs.png`);
    } catch (error) {
      console.log(error);
      this.send("/gc Something went wrong..");
    }
  }
}

module.exports = helpCommand;
