const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const { getUUID } = require("../../contracts/API/PlayerDBAPI.js");

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

  async onCommand(username, message, channel = "gc") {
    try {
      username = this.getArgs(message)[0] || username;

      let uuid = await getUUID(username);
      const player = await hypixel.getPlayer(uuid);

      const { starLevel, KDRatio, wins, headsEaten } = player.stats.uhc;

      this.send(`/${channel} [${starLevel}✫] ${player.nickname} | KDR: ${KDRatio} | W: ${wins} | Heads: ${headsEaten}`);
    } catch (error) {
      this.send(
        `/${channel} ${error
          .toString()
          .replace("[hypixel-api-reborn] ", "")
          .replace("For help join our Discord Server https://discord.gg/NSEBNMM", "")
          .replace("Error:", "[ERROR]")}`
      );
    }
  }
}

module.exports = UHCStatsCommand;
