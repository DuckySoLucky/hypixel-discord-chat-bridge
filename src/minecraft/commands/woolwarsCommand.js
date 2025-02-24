const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { formatNumber } = require("../../contracts/helperFunctions.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");

class WoolwarsCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "woolwars";
    this.aliases = ["ww"];
    this.description = "WoolWars stats of specified user.";
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
      if (hypixelPlayer.stats?.woolwars === undefined) {
        return this.send(`${player} has never played WoolWars.`);
      }

      const { level } = hypixelPlayer.stats.woolwars;
      const { roundWins, gamesPlayed, woolsPlaced, blocksBroken, KDRatio } = hypixelPlayer.stats.woolwars.stats.overall;

      this.send(
        `[${Math.floor(level)}✫] ${player}: W: ${formatNumber(roundWins)} | WLR: ${(roundWins / gamesPlayed).toFixed(
          2
        )} | KDR: ${KDRatio} | BB: ${formatNumber(blocksBroken)} | WP: ${formatNumber(
          woolsPlaced
        )} | WPP: ${formatNumber(woolsPlaced / gamesPlayed)} | WPG: ${(woolsPlaced / blocksBroken).toFixed(2)}`
      );
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = WoolwarsCommand;
