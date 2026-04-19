const minecraftCommand = require("../../contracts/minecraftCommand.js");
const config = require("../../../config.json");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
 return result;
}
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

      this.isOnCooldown = true;
      
      const user = this.getArgs(message)[0];
      console.log(user)
      if (user === undefined) {
        // eslint-disable-next-line no-throw-literal
        throw "Please provide a username!";
      }
      this.warpSend("/lobby megawalls");
      await delay(250);
      this.warpSend("/play skyblock");

      const warpoutListener = async (message) => {
        message = message.toString();

        if (message.includes("You cannot invite that player since they're not online.")) {
          bot.removeListener("message", warpoutListener);
          this.warpSend(`/gc ${user} is offline! {${makeid(7)}}`);
        } else if (message.includes("You cannot invite that player!")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.warpSend(`/gc ${user} has party requests disabled! {${makeid(7)}}`);
        } else if (message.includes("invited") && message.includes("to the party! They have 60 seconds to accept.")) {
          this.warpSend(`/gc Partying ${user}... {${makeid(7)}}`);
        } else if (message.includes(" joined the party.")) {
          this.warpSend("/p warp");
        } else if (message.includes("warped to your server")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.warpSend(`/gc Successfully warped ${user}! {${makeid(7)}}`);
          this.warpSend("/p disband");
          await delay(1500);
          this.warpSend("\u00a7");
        } else if (message.includes(" cannot warp from Limbo")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.warpSend(`/gc ${user} cannot be warped from Limbo! Disbanding party..`);
          this.warpSend("/p disband");
        } else if (message.includes(" is not allowed on your server!")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.warpSend(`/gc ${user} is not allowed on my server! Disbanding party..`);
          this.warpSend("/p leave");
          await delay(1500);
          this.warpSend("\u00a7");
        } else if (message.includes("You are not allowed to invite players.")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.warpSend(`/gc Somehow I'm not allowed to invite players? Disbanding party..`);
          this.warpSend("/p disband");
          await delay(1500);
          this.warpSend("\u00a7");
        } else if (message.includes("You are not allowed to disband this party.")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.warpSend(`/gc Somehow I'm not allowed to disband this party? Leaving party..`);
          this.warpSend("/p leave");
          await delay(1500);
          this.warpSend("\u00a7");
        } else if (message.includes("You can't party warp into limbo!")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.warpSend(`/gc Somehow I'm inside in limbo? Disbanding party..`);
          this.warpSend("/p disband");
        } else if (message.includes("Couldn't find a player with that name!")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.warpSend(`/gc Couldn't find a player with that name!`);
          this.warpSend("/p disband");
        } else if (message.includes("You cannot party yourself!")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.warpSend(`/gc I cannot party myself!`);
        } else if (message.includes("didn't warp correctly!")) {
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
          this.warpSend(`/gc ${user} didn't warp correctly! Please try again..`);
          this.warpSend("/p disband");
        }
      };

      bot.on("message", warpoutListener);
      this.warpSend(`/p invite ${user} `);
      setTimeout(() => {
        bot.removeListener("message", warpoutListener);

        if (this.isOnCooldown === true) {
          this.warpSend("/gc Party expired.");
          this.warpSend("/p disband");
          this.warpSend("\u00a7");

          this.isOnCooldown = false;
        }
      }, 30000);
    } catch (error) {
      this.warpSend(`/gc ${username} [ERROR] ${error || "Something went wrong.."}`);
      this.isOnCooldown = false;
    }
  }
}

module.exports = warpoutCommand;
