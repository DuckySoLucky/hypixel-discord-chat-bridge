const alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class BoopCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "boop";
    this.aliases = ["bp"];
    this.description = "Boop someone!";
    this.options = [
      {
        name: "username",
        description: "User you want to boop!",
        required: true,
      },
    ];
    this.isOnCooldown = false;
  }

  async onCommand(username, message) {
    // CREDITS: by @Zickles (https://github.com/Zickles)
    try {
      if (this.getArgs(message).length === 0) {
        // eslint-disable-next-line no-throw-literal
        throw "You must provide a user to boop!";
      }

      if (this.isOnCooldown) {
        return this.send(`/gc ${this.name} Command is on cooldown`);
      }

      this.send(`/boop ${this.getArgs(message)[0]}`);
      await delay(690);
      this.send(`/msg ${this.getArgs(message)[0]} ${username} Booped You!`);
      await delay(690);
      this.send(`/gc Booped ${this.getArgs(message)[0]}!`);
      this.isOnCooldown = true;
      // CREDITS: @jaxieflaxie for finding this cooldown reset
      for (let i = 0; i < alphabet.length; i++) {
        this.send(`/w ${bot.username} ${alphabet[i]}`);
        await delay(690);
      }
      this.isOnCooldown = false;
    } catch (error) {
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}

module.exports = BoopCommand;
