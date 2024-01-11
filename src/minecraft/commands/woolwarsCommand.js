const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { formatNumber } = require("../../contracts/helperFunctions.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const { getUUID } = require("../../contracts/API/PlayerDBAPI.js");

class WoolwarsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "woolwars";
    this.aliases = ["ww"];
    this.description = "WoolWars stats of specified user.";
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

      const response = await hypixel.getPlayer(uuid, { raw: true });

      if (response.player === null) {
        // eslint-disable-next-line no-throw-literal
        throw "This player has never joined Hypixel.";
      }

      const woolWars = response?.player?.stats?.WoolGames?.wool_wars?.stats;

      if (woolWars == undefined) {
        // eslint-disable-next-line no-throw-literal
        throw "This player has never played WoolWars.";
      }

      const { wins = 0, games_played = 0, kills = 0, deaths = 0, blocks_broken = 0, wool_placed = 0 } = woolWars;
      const experience = response.player?.stats?.WoolGames?.progression?.experience ?? 0;
      const level = getWoolWarsStar(experience);

      this.send(
        `/${channel} [${Math.floor(level)}✫] ${username}: W: ${formatNumber(wins ?? 0)} | WLR: ${(
          wins / games_played
        ).toFixed(2)} | KDR: ${(kills / deaths).toFixed(2)} | BB: ${formatNumber(blocks_broken)} | WP: ${formatNumber(
          wool_placed
        )} | WPP: ${(wool_placed / games_played).toFixed(2)} | WPG: ${(wool_placed / blocks_broken).toFixed(2)}`
      );
    } catch (error) {
      this.send(`/${channel} [ERROR] ${error}`);
    }
  }
}

function getWoolWarsStar(exp) {
  const minimalExp = [0, 1e3, 3e3, 6e3, 1e4, 15e3];
  const baseLevel = minimalExp.length;
  const baseExp = minimalExp[minimalExp.length - 1];
  if (exp >= baseExp) {
    return (exp - baseExp) / 5e3 + baseLevel;
  }

  const lvl = minimalExp.findIndex((x) => exp < x);
  return lvl + exp / minimalExp[lvl];
}

module.exports = WoolwarsCommand;
