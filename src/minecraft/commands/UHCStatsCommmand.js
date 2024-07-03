const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");

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
        required: false,
      },
    ];
  }

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;

      const player = await hypixel.getPlayer(username);

      const { starLevel, KDRatio, wins, headsEaten } = player.stats.uhc;

      this.send(`/gc [${starLevel}✫] ${player.nickname} | KDR: ${KDRatio} | W: ${wins} | Heads: ${headsEaten}`);
    } catch (error) {
      this.send(
        `/gc ${error
          .toString()
          .replace("[hypixel-api-reborn] ", "")
          .replace("For help join our Discord Server https://discord.gg/NSEBNMM", "")
          .replace("Error:", "[ERROR]")}`,
      );
    }
  }
}

module.exports = UHCStatsCommand;
