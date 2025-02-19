const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const { formatError } = require("../../contracts/helperFunctions.js");

class UHCStatsCommand extends minecraftCommand {
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

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;

      const player = await hypixel.getPlayer(username);

      const { starLevel, KDRatio, wins, headsEaten } = player.stats.uhc;

      this.send(`[${starLevel}✫] ${player.nickname} | KDR: ${KDRatio} | W: ${wins} | Heads: ${headsEaten}`);
    } catch (error) {
      this.send(formatError(error));
    }
  }
}

module.exports = UHCStatsCommand;
