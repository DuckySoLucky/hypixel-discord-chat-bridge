const minecraftCommand = require("../../contracts/minecraftCommand.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const helperFunctions = require("../../contracts/helperFunctions.js");

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
        return this.send(`${this.name} Command is on cooldown`);
      }

      bot.chat(`/boop ${this.getArgs(message)[0]}`);
      await delay(690);
      bot.chat(`/msg ${this.getArgs(message)[0]} ${username} Booped You!`);
      await delay(690);
      this.send(`Booped ${this.getArgs(message)[0]}!`);
      this.isOnCooldown = true;
      // CREDITS: @jaxieflaxie for finding this cooldown reset
      setTimeout(() => {
        bot.chat(
          `/w ${
            bot.username
          } jaxieflaxie is the best wristspasm member! your cool if u see this - ${helperFunctions.generateID(24)}`,
        );
        setTimeout(() => {
          bot.chat(`/w ${bot.username} ${helperFunctions.generateID(48)}`);
          this.isOnCooldown = false;
        }, 30000);
      }, 30000);
      this.isOnCooldown = false;
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = BoopCommand;
