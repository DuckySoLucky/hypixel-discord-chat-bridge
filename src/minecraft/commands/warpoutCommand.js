const { replaceVariables } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const doNotResetCooldown = ["to the party! They have 60 seconds to accept.", "joined the party."];
const warpoutMessages = {
  "You cannot invite that player since they're not online.": "{username} is not online!",
  "You cannot invite that player!": "{username} has party invites disabled!",
  invited: "{username} succesfully invited",
  "joined the party.": "{username} joined the party! Trying to warp them out of the game.",
  "warped to your server": "{username} warped out of the game! Trying to disband party.",
  "cannot warp from Limbo": "somehow I'm inside of limbo. Please try again later.",
  "is not allowed on your server!": "{username} is not allowed on my server!",
  "You are not allowed to invite players.": "I'm not allowed to invite that player.",
  "You are not allowed to disband this party.": "I'm in someone else's party. Please try again later.",
};

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

      username = this.getArgs(message)[0];
      if (username === undefined || username === bot.username) {
        // eslint-disable-next-line no-throw-literal
        throw "Please provide a username!";
      }

      this.send("/lobby megawalls");
      await delay(1000);
      this.send("/play skyblock");

      this.isOnCooldown = true;
      const warpoutListener = async (message) => {
        message = message.toString();

        if (this.getWarpoutMessage(message) !== null) {
          this.send(`/gc ${replaceVariables(this.getWarpoutMessage(message), { username })}`);
          await new Promise((resolve) => setTimeout(resolve, 1500));
          this.send(this.getWarpoutCommand(message));

          if (this.resetCooldown(message)) {
            this.resetWarpout(warpoutListener);
          }
        }
      };

      bot.on("message", warpoutListener);
      this.send(`/p ${username} `);

      setTimeout(() => {
        bot.removeListener("message", warpoutListener);

        if (this.isOnCooldown === true) {
          this.send(this.getWarpoutCommand(message));
          this.resetWarpout(warpoutListener);
        }
      }, 30000);
    } catch (error) {
      this.send(`/gc [ERROR] ${error || "Something went wrong.."}`);

      this.isOnCooldown = false;
    }
  }

  getWarpoutMessage(message) {
    for (const [key, value] of Object.entries(warpoutMessages)) {
      if (message.includes(key) && message.includes(":") === false) {
        return value;
      }
    }

    return null;
  }

  getWarpoutCommand(message) {
    return message.includes("joined the party.") ? "/p warp" : "/p leave";
  }

  resetCooldown(message) {
    return doNotResetCooldown.some((element) => message.includes(element)) === false;
  }

  resetWarpout(warpoutListener) {
    bot.removeListener("message", warpoutListener);
    this.isOnCooldown = false;
  }
}

module.exports = warpoutCommand;
