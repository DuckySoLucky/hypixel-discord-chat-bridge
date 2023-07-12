const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
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

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;

      const player = await hypixel.getPlayer(username);

      const { level, KDRatio, WLRatio, winstreak } = player.stats.skywars;

      this.send(
        `/gc [${level}✫] ${player.nickname} | KDR: ${KDRatio} | WLR: ${WLRatio} | WS: ${winstreak}`
      );
    } catch (error) {
      this.send(`/gc ${error.toString().replace("[hypixel-api-reborn] ", "")}`);
    }
  }
}

module.exports = SkywarsCommand;
