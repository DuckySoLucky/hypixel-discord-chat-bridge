const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const { getUUID } = require("../../contracts/API/PlayerDBAPI.js");

class SkywarsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "skywars";
    this.aliases = ["sw"];
    this.description = "Skywars stats of specified user.";
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

      const { wins, kills, level, KDRatio, WLRatio, winstreak } = player.stats.skywars;

      this.send(
        `/${channel} [${level}✫] ${player.nickname} | Kills: ${kills} KDR: ${KDRatio} | Wins: ${wins} WLR: ${WLRatio} | WS: ${winstreak}`
      );
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

module.exports = SkywarsCommand;
