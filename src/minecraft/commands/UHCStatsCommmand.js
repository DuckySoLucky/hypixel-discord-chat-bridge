const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const { formatError } = require("../../contracts/helperFunctions.js");

class UHCStatsCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "UHC";
    this.aliases = ["uhc"];
    this.description = "UHC Stats of specified user.";
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
      if (hypixelPlayer.stats?.uhc === undefined) {
        return this.send("This player has no UHC stats.");
      }

      const { starLevel, KDRatio, wins, headsEaten } = hypixelPlayer.stats.uhc;
      this.send(`[${starLevel}✫] ${hypixelPlayer.nickname} | KDR: ${KDRatio} | W: ${wins} | Heads: ${headsEaten}`);
    } catch (error) {
      this.send(formatError(error));
    }
  }
}

module.exports = UHCStatsCommand;
