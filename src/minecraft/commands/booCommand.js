const minecraftCommand = require("../../contracts/minecraftCommand.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const helperFunctions = require("../../contracts/helperFunctions.js");

class BooCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "boo";
    this.aliases = [];
    this.description = "Boo someone!";
    this.options = [
      {
        name: "username",
        description: "User you want to boo!",
        required: true
      }
    ];
    this.isOnCooldown = false;
  }

  async onCommand(username, message) {
    try {
      if (this.getArgs(message).length === 0) {
        // eslint-disable-next-line no-throw-literal
        throw "You must provide a user to boo!";
      }

      if (9 !== new Date().getMonth()) {
        // eslint-disable-next-line no-throw-literal
        throw "It's not October!";
      }

      if (this.isOnCooldown) {
        return this.send(`/gc ${this.name} Command is on cooldown`);
      }

      this.send(`/boo ${this.getArgs(message)[0]}`);
      await delay(690);
      this.send(`/msg ${this.getArgs(message)[0]} ${username} Booed You!`);
      await delay(690);
      this.send(`/gc Booed ${this.getArgs(message)[0]}!`);
      this.isOnCooldown = true;
      // CREDITS: @jaxieflaxie for finding this cooldown reset
      setTimeout(() => {
        bot.chat(
          `/w ${
            bot.username
          } jaxieflaxie is the best wristspasm member! your cool if u see this - ${helperFunctions.generateID(24)}`
        );
        setTimeout(() => {
          bot.chat(`/w ${bot.username} ${helperFunctions.generateID(48)}`);
          this.isOnCooldown = false;
        }, 30000);
      }, 30000);
      this.isOnCooldown = false;
    } catch (error) {
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}

module.exports = BooCommand;
