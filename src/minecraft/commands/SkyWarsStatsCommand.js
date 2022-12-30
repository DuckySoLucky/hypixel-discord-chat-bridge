const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
class SkywarsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "skywars";
    this.aliases = ["sw"];
    this.description = "Skywars stats of specified user.";
    this.options = ["name"];
    this.optionsDescription = ["Minecraft Username"];
  }

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;

      const player = await hypixel.getPlayer(username);

      this.send(
        `/gc [${player.stats.skywars.level}✫] ${player.nickname}ᐧᐧᐧᐧKDR:${player.stats.skywars.KDRatio}ᐧᐧᐧᐧWLR:${player.stats.skywars.WLRatio}ᐧᐧᐧᐧWS:${player.stats.skywars.winstreak}`
      );
    } catch (error) {
      this.send(`/gc ${error.toString().replace("[hypixel-api-reborn] ", "")}`);
    }
  }
}

module.exports = SkywarsCommand;
