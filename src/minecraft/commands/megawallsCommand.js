const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");

class EightBallCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "megawalls";
    this.aliases = ["mw"];
    this.description = "View the Megawalls stats of a player";
    this.options = ["username"];
    this.optionsDescription = ["Minecraft username"];
  }


  async onCommand(username, message) {
    try {
        username = this.getArgs(message)[0] || username;

      const megawalls = (await hypixel.getPlayer(username)).stats.megawalls;

      this.send(`/gc ${username}'s Megawalls: Class: ${megawalls.selectedClass || "None"} | FK: ${megawalls.finalKills} | FKDR: ${megawalls.finalKDRatio} | W: ${megawalls.wins} | WLR: ${megawalls.WLRatio} | K: ${megawalls.kills} | KDR: ${megawalls.KDRatio} | A: ${megawalls.assists}`)
    } catch (error) {
      this.send(`/gc ${error.toString().replace("[hypixel-api-reborn] ", "")}`);
    }
  }
}

module.exports = EightBallCommand;
