const minecraftCommand = require("../../contracts/minecraftCommand.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class warpoutCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "warpout";
    this.aliases = ["warp"];
    this.description = "Warp player out of the game";
    this.options = [];

    this.isOnCooldown = false;
  }

  async onCommand(username, message) {
    try {
      if (this.isOnCooldown) {
        return this.send(`/gc ${username} Command is on cooldown`);
      }

      this.isOnCooldown = true;

      const user = this.getArgs(message)[0];
      // eslint-disable-next-line no-throw-literal
      if (user === undefined) throw "Please provide a username!";
      bot.chat("/lobby megawalls");
      await delay(1000);
      bot.chat("/play skyblock");

      const warpoutListener = async (message) => {
        message = message.toString();

        if (message.includes("You cannot invite that player since they're not online.")) {
          this.send(`/gc ${user} is not online!`);
          this.isOnCooldown = false;
        }

        if (message.includes("You cannot invite that player!")) {
          this.send(`/gc ${user} has party requests disabled!`);
          this.isOnCooldown = false;
        }

        if (message.includes("invited") &&message.includes("to the party! They have 60 seconds to accept.")) {
          this.send(`/gc Succesfully invited ${user} to the party!`);
        }

        if (message.includes(" joined the party.")) {
          this.send(`/gc ${user} joined the party! Warping him out of the game..`);
          await delay(1100);

          bot.chat("/p warp");
        }

        if (message.includes(" is not allowed on your server!")) {
          this.send(`/gc ${user} is not allowed on my server! Disbanding party..`);
          this.isOnCooldown = false;

          await delay(1000);
          bot.chat("/p leave");
          await delay(690);
          bot.chat("\u00a7");
        }

        if (message.includes("warped to your server")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.send(`/gc ${user} warped out of the game! Disbanding party..`);

          await delay(1000);
          bot.chat("/p disband");
          await delay(690);
          bot.chat("\u00a7");
        }

        if (message.includes("You are not allowed to invite players.")) {
          this.send(`/gc Somehow I'm not allowed to invite players? Disbanding party..`);
          this.isOnCooldown = false;

          await delay(1000);
          bot.chat("/p disband");
          await delay(690);
          bot.chat("\u00a7");
        }

        if (message.includes("You are not allowed to disband this party.")) {
          this.send(`/gc Somehow I'm not allowed to disband this party? Leaving party..`);
          this.isOnCooldown = false;

          await delay(1000);
          bot.chat("/p leave");
          await delay(690);
          bot.chat("\u00a7");
        }
      };

      await bot.on("message", warpoutListener);
      bot.chat(`/p ${user}`);

      setTimeout(async () => {
        bot.removeListener("message", warpoutListener);

        if (this.isOnCooldown === true) {
          this.send("/gc Party timedout");
          await delay(1000);
          bot.chat("/p disband");

          this.isOnCooldown = false;
        }
      }, 30000);
    } catch (error) {
      this.send(`/gc ${username} Error: ${error || "Something went wrong.."}`);

      this.isOnCooldown = false;
    }
  }
}

module.exports = warpoutCommand;
