const { capitalize, formatNumber, formatError } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");

class BedwarsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "bedwars";
    this.aliases = ["bw", "bws"];
    this.description = "BedWars stats of specified user.";
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
      const msg = this.getArgs(message).map((arg) => arg.replaceAll("/", ""));
      const modes = ["solo", "doubles", "threes", "fours", "4v4"];

      const mode = modes.includes(msg[0]) ? msg[0] : "overall";
      username = modes.includes(msg[0]) ? (msg[1] ? msg[1] : username) : msg[0] || username;

      const player = await hypixel.getPlayer(username);

      if (["overall", "all"].includes(mode)) {
        const { level, finalKills, finalKDRatio, wins, WLRatio, winstreak } = player.stats.bedwars;
        const { broken, BLRatio } = player.stats.bedwars.beds;

        this.send(
          `[${level}✫] ${player.nickname} FK: ${formatNumber(finalKills)} FKDR: ${finalKDRatio} W: ${formatNumber(
            wins
          )} WLR: ${WLRatio} BB: ${formatNumber(broken)} BLR: ${BLRatio} WS: ${winstreak}`
        );
      } else if (mode !== undefined) {
        const { level } = player.stats.bedwars;
        const { finalKills, finalKDRatio, wins, WLRatio, winstreak } = player.stats.bedwars[mode];
        const { broken, BLRatio } = player.stats.bedwars[mode].beds;

        this.send(
          `[${level}✫] ${player.nickname} ${capitalize(mode)} FK: ${formatNumber(
            finalKills
          )} FKDR: ${finalKDRatio} Wins: ${formatNumber(wins)} WLR: ${WLRatio} BB: ${formatNumber(
            broken
          )} BLR: ${BLRatio} WS: ${winstreak}`
        );
      } else {
        this.send("Invalid mode. Valid modes: overall, solo, doubles, threes, fours, 4v4");
      }
    } catch (error) {
      this.send(formatError(error));
    }
  }
}

module.exports = BedwarsCommand;
