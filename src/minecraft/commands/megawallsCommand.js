const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const { formatError } = require("../../contracts/helperFunctions.js");

class EightBallCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "megawalls";
    this.aliases = ["mw"];
    this.description = "View the Megawalls stats of a player";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false
      }
    ];
  }

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    try {
      player = this.getArgs(message)[0] || player;

      const hypixelPlayer = await hypixel.getPlayer(player);
      if (hypixelPlayer.stats?.megawalls === undefined) {
        return this.send("This player has no Megawalls stats.");
      }

      const { selectedClass = "None", finalKills, finalKDRatio, wins, WLRatio, kills, KDRatio, assists } = hypixelPlayer.stats.megawalls;
      this.send(
        `${player}'s Megawalls: Class: ${
          selectedClass ?? "None"
        } | FK: ${finalKills} | FKDR: ${finalKDRatio} | W: ${wins} | WLR: ${WLRatio} | K: ${kills} | KDR: ${KDRatio} | A: ${assists}`
      );
    } catch (error) {
      this.send(formatError(error));
    }
  }
}

module.exports = EightBallCommand;
