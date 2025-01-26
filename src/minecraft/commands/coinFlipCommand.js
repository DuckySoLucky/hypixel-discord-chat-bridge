const minecraftCommand = require("../../contracts/minecraftCommand.js");

class CoinFlipCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "coinflip";
    this.aliases = ["coin"];
    this.description = "Flips a coin.";
    this.options = [];
  }

  async onCommand(username, message) {
    try {
      const randNum = Math.random();

      if(randNum < .5){
        this.send("/gc Heads!");
      } else {
        this.send("/gc Tails!");
      }
    } catch (error) {
      this.send(`/gc [ERROR] ${error ?? "Something went wrong.."}`);
    }
  }
}

module.exports = CoinFlipCommand;
