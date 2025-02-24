const { delay } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
class warpoutCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);
    this.name = "warpout";
    this.aliases = ["warp"];
    this.description = "Warp player out of the game";
    this.options = [];
    this.isOnCooldown = false;
  }
  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    try {
      if (this.isOnCooldown) {
        return this.send(`${player} Command is on cooldown`);
      }

      this.isOnCooldown = true;

      const user = this.getArgs(message)[0];
      if (user === undefined) {
        throw "Please provide a username!";
      }
      bot.chat("/lobby megawalls");
      await delay(250);
      bot.chat("/play skyblock");

      // @ts-ignore
      const warpoutListener = async (message) => {
        message = message.toString();

        if (message.includes("You cannot invite that player since they're not online.")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.send(`${user} is offline!`);
        } else if (message.includes("You cannot invite that player!")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.send(`${user} has party requests disabled!`);
        } else if (message.includes("invited") && message.includes("to the party! They have 60 seconds to accept.")) {
          this.send(`Partying ${user}...`);
        } else if (message.includes(" joined the party.")) {
          bot.chat("/p warp");
        } else if (message.includes("warped to your server")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.send(`Successfully warped ${user}!`);
          bot.chat("/p disband");
          await delay(1500);
          bot.chat("/limbo");
        } else if (message.includes(" cannot warp from Limbo")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.send(`${user} cannot be warped from Limbo! Disbanding party..`);
          bot.chat("/p disband");
        } else if (message.includes(" is not allowed on your server!")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.send(`${user} is not allowed on my server! Disbanding party..`);
          bot.chat("/p leave");
          await delay(1500);
          this.send("\u00a7");
        } else if (message.includes("You are not allowed to invite players.")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.send(`Somehow I'm not allowed to invite players? Disbanding party..`);
          bot.chat("/p disband");
          await delay(1500);
          bot.chat("/limbo");
        } else if (message.includes("You are not allowed to disband this party.")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.send(`Somehow I'm not allowed to disband this party? Leaving party..`);
          bot.chat("/p leave");
          await delay(1500);
          bot.chat("/limbo");
        } else if (message.includes("You can't party warp into limbo!")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.send(`Somehow I'm inside in limbo? Disbanding party..`);
          bot.chat("/p disband");
        } else if (message.includes("Couldn't find a player with that name!")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.send(`Couldn't find a player with that name!`);
          bot.chat("/p disband");
        } else if (message.includes("You cannot party yourself!")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.send(`I cannot party myself!`);
        } else if (message.includes("didn't warp correctly!")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.send(`${user} didn't warp correctly! Please try again..`);
          bot.chat("/p disband");
        }
      };

      bot.on("message", warpoutListener);
      bot.chat(`/p invite ${user} `);
      setTimeout(() => {
        bot.removeListener("message", warpoutListener);

        if (this.isOnCooldown === true) {
          this.send("Party expired.");
          bot.chat("/p disband");
          bot.chat("/limbo");

          this.isOnCooldown = false;
        }
      }, 30000);
    } catch (error) {
      this.send(`${player} [ERROR] ${error || "Something went wrong.."}`);
      this.isOnCooldown = false;
    }
  }
}

module.exports = warpoutCommand;
