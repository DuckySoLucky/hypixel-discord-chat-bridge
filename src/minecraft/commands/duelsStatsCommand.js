const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const { formatNumber } = require("../../contracts/helperFunctions.js");

class DuelsStatsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "duels";
    this.aliases = ["duel"];
    this.description = "Duel stats of specified user.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false,
      },
      {
        name: "duel",
        description: "Type of duel",
        required: false,
      },
    ];
  }

  async onCommand(username, message) {
    try {
      const duelTypes = [
        "blitz",
        "uhc",
        "parkour",
        "boxing",
        "bowspleef",
        "spleef",
        "arena",
        "megawalls",
        "op",
        "sumo",
        "classic",
        "combo",
        "bridge",
        "nodebuff",
        "bow",
      ];
      const arg = this.getArgs(message) ?? [username];
      let duel;

      if (!arg[0] || arg[0].includes("/")) {
        arg[0] = username;
      }

      if (duelTypes.includes(arg[0].toLowerCase())) {
        duel = arg[0].toLowerCase();
        if (arg[1] && !arg[1].includes("/")) {
          username = arg[1];
        }
      } else {
        username = arg[0];

        if (arg[1] && duelTypes.includes(arg[1].toLowerCase())) {
          duel = arg[1].toLowerCase();
        }
      }

      const player = await hypixel.getPlayer(username);

      if (!duel) {
        this.send(
          `/gc [Duels] [${player.stats.duels.division}] ${username} Wins: ${formatNumber(player.stats.duels.wins)} | CWS: ${player.stats.duels.winstreak} | BWS: ${player.stats.duels.bestWinstreak} | WLR: ${player.stats.duels.WLRatio}`
        );
      } else {
        const duelData = player.stats.duels?.[duel]?.[Object.keys(player.stats.duels[duel])[0]];
        const division = duelData?.division ?? player.stats.duels?.[duel]?.division ?? "Unknown";
        const wins = duelData?.wins ?? 0;
        const winstreak = duelData?.winstreak ?? 0;
        const bestWinstreak = duelData?.bestWinstreak ?? 0;
        const WLRatio = duelData?.WLRatio ?? 0;

        this.send(
          `/gc [${duel.toUpperCase() ?? "Unknown"}] [${division}] ${
            username ?? 0
          } Wins: ${wins} | CWS: ${winstreak} | BWS: ${bestWinstreak} | WLR: ${WLRatio}`
        );
      }
    } catch (error) {
      this.send(`/gc ${error.toString().replace("[hypixel-api-reborn] ", "")}`);
    }
  }
}

module.exports = DuelsStatsCommand;
