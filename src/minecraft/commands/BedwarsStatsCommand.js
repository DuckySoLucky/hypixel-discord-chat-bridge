const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const { addCommas } = require("../../contracts/helperFunctions.js");
const { capitalize } = require("../../contracts/helperFunctions.js");

class BedwarsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "bedwars";
    this.aliases = ["bw", "bws"];
    this.description = "BedWars stats of specified user.";
    this.options = ["name"];
    this.optionsDescription = ["Minecraft Username"];
  }

  async onCommand(username, message) {
    try {
      const msg = this.getArgs(message).map((arg) => arg.replaceAll("/", ""));
      const modes = ["solo", "doubles", "threes", "fours", "4v4"];

      const mode = modes.includes(msg[0]) ? msg[0] : "overall";
      username = modes.includes(msg[0]) ? msg[1] : msg[0] || username;

      const player = await hypixel.getPlayer(username);

      if (["overall", "all"].includes(mode)) {
        this.send(
          `/gc [${player.stats.bedwars.level}✫] ${
            player.nickname
          } FK: ${addCommas(player.stats.bedwars.finalKills)} FKDR: ${
            player.stats.bedwars.finalKDRatio
          } Wins: ${player.stats.bedwars.wins} WLR: ${
            player.stats.bedwars.WLRatio
          } BB: ${player.stats.bedwars.beds.broken} BLR: ${
            player.stats.bedwars.beds.BLRatio
          } WS: ${player.stats.bedwars.winstreak}`
        );
      } else if (mode !== undefined) {
        this.send(
          `/gc [${player.stats.bedwars.level}✫] ${player.nickname} ${capitalize(
            mode
          )} FK: ${addCommas(player.stats.bedwars[mode].finalKills)} FKDR: ${
            player.stats.bedwars[mode].finalKDRatio
          } Wins: ${player.stats.bedwars[mode].wins} WLR: ${
            player.stats.bedwars[mode].WLRatio
          } BB: ${player.stats.bedwars[mode].beds.broken} BLR: ${
            player.stats.bedwars[mode].beds.BLRatio
          } WS: ${player.stats.bedwars[mode].winstreak}`
        );
      } else {
        this.send(
          "/gc Invalid mode. Valid modes: overall, solo, doubles, threes, fours, 4v4"
        );
      }
    } catch (error) {
      this.send(`/gc ${error.toString().replace("[hypixel-api-reborn] ", "")}`);
    }
  }
}

module.exports = BedwarsCommand;
