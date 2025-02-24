const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { delay } = require("../../contracts/helperFunctions.js");

class BoopCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "boop";
    this.aliases = ["bp"];
    this.description = "Boop someone!";
    this.options = [
      {
        name: "username",
        description: "User you want to boop!",
        required: true
      }
    ];
    this.isOnCooldown = false;
  }

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    // CREDITS: by @Zickles (https://github.com/Zickles)
    try {
      const args = this.getArgs(message);
      if (args.length === 0) {
        throw "You must provide a user to boo!";
      }

      player = args[0];
      if (this.isOnCooldown) {
        return this.send(`${this.name} Command is on cooldown`);
      }

      this.isOnCooldown = true;
      bot.chat(`/boop ${args[0]}`);
      await delay(690);
      this.send(`Booped ${args[0]}!`);
      setTimeout(() => {
        this.isOnCooldown = false;
      }, 30000);
    } catch (error) {
      this.send(`[ERROR] ${error}`);
      this.isOnCooldown = false;
    }
  }
}

module.exports = BoopCommand;
