const { formatNumber, formatError, titleCase } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");

class BedwarsCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
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

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    try {
      const msg = this.getArgs(message).map((arg) => arg.replaceAll("/", ""));
      const modes = ["solo", "doubles", "threes", "fours", "4v4"];

      /** @type {string} */
      const mode = modes.includes(msg[0]) ? msg[0] : "overall";
      player = modes.includes(msg[0]) ? (msg[1] ? msg[1] : player) : msg[0] || player;

      const hypixelPlayer = await hypixel.getPlayer(player);
      if (hypixelPlayer === undefined) {
        return this.send(`Couldn't find player ${player}.`);
      }

      if (hypixelPlayer?.stats?.bedwars === undefined) {
        return this.send(`${player} has no BedWars Stats.`);
      }

      if (["overall", "all"].includes(mode)) {
        const { level, finalKills, finalKDRatio, wins, WLRatio, winstreak } = hypixelPlayer.stats.bedwars;
        const { broken, BLRatio } = hypixelPlayer.stats.bedwars.beds;

        this.send(
          `[${level}✫] ${hypixelPlayer.nickname} FK: ${formatNumber(finalKills)} FKDR: ${finalKDRatio} W: ${formatNumber(
            wins
          )} WLR: ${WLRatio} BB: ${formatNumber(broken)} BLR: ${BLRatio} WS: ${winstreak}`
        );
      } else if (mode !== undefined) {
        const { level } = hypixelPlayer.stats.bedwars;

        // @ts-ignore
        const { finalKills, finalKDRatio, wins, WLRatio, winstreak } = hypixelPlayer.stats.bedwars[mode];
        // @ts-ignore
        const { broken, BLRatio } = hypixelPlayer.stats.bedwars[mode].beds;

        this.send(
          `[${level}✫] ${hypixelPlayer.nickname} ${titleCase(mode)} FK: ${formatNumber(
            finalKills
          )} FKDR: ${finalKDRatio} Wins: ${formatNumber(wins)} WLR: ${WLRatio} BB: ${formatNumber(broken)} BLR: ${BLRatio} WS: ${winstreak}`
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
