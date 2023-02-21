const minecraftCommand = require("../../contracts/minecraftCommand.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class warpoutCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "warpout";
    this.aliases = ["warp"];
    this.description = "Warp player out of the game";
    this.options = [];
  }

  async onCommand(username, message) {
    try {
      bot.chat("/lobby");
      await delay(1000);
      bot.chat("/play skyblock");
      const user = this.getArgs(message)[0];

      // eslint-disable-next-line no-throw-literal
      if (user === undefined) throw "Please provide a username!";
      let warped = false;

      const listener = async (message) => {
        message = message.toString();

        if (
          message.includes(
            "You cannot invite that player since they're not online."
          )
        ) {
          this.send(`/gc ${user} is not online!`);
        }

        if (message.includes("You cannot invite that player.")) {
          this.send(`/gc ${user} has party requests disabled!`);
        }

        if (
          message.includes("invited") &&
          message.includes("to the party! They have 60 seconds to accept.")
        ) {
          this.send(`/gc Succesfully invited ${user} to the party!`);
        }

        if (message.includes(" joined the party.")) {
          this.send(
            `/gc ${user} joined the party! Warping him out of the game..`
          );
          bot.removeListener("message", listener);
          await delay(1100);

          bot.chat("/p warp");
          warped = true;

          await delay(1000);
          bot.chat("/p disband");
        }
      };

      await bot.on("message", listener);
      bot.chat(`/p ${user}`);

      setTimeout(async () => {
        bot.removeListener("message", listener);

        if (!warped) {
          this.send("/gc Party timedout");
          await delay(1000);
          bot.chat("/p disband");
        }
      }, 30000);
    } catch (error) {
      this.send(`/gc ${username} Error: ${error || "Something went wrong.."}`);
    }
  }
}

module.exports = warpoutCommand;
