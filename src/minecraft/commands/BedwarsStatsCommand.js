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
      const msg = this.getArgs(message);
      let mode = null;

      if (["solo", "doubles", "threes", "fours", "4v4"].includes(msg[0])) {
        mode = msg[0];
        if (msg[1] && !msg[1].includes("/")) {
          username = msg[1];
        }
      } else {
        if (msg[0] && !msg[0].includes("/")) {
          username = msg[0];
        }

        if (["solo", "doubles", "threes", "fours", "4v4"].includes(msg[1])) {
          mode = msg[1];
        }
      }

      const player = await hypixel.getPlayer(username);

      if (!mode || ["overall", "all"].includes(mode)) {
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
      } else if (mode) {
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
      }
    } catch (error) {
      this.send(
        "There is no player with the given UUID or name or player has never joined Hypixel."
      );
      console.log(error);
    }
  }
}

module.exports = BedwarsCommand;