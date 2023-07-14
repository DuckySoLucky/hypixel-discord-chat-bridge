const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");

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

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;

      const response = await hypixel.getPlayer(username, { raw: true });

      if (response.player === null) {
        // eslint-disable-next-line no-throw-literal
        throw "This player has never joined Hypixel.";
      }

      const woolWars = response?.player?.stats?.WoolGames?.wool_wars?.stats;

      if (woolWars == undefined) {
        // eslint-disable-next-line no-throw-literal
        throw "This player has never played WoolWars.";
      }

      const experience = response.player?.stats?.WoolGames?.progression?.experience ?? 0;
      const level = getWoolWarsStar(experience);

      this.send(
        `/gc [${Math.floor(level)}✫] ${username}: W: ${woolWars.wins} | WLR: ${(
          woolWars.wins / woolWars.games_played
        ).toFixed(2)} | KDR: ${(woolWars.kills / woolWars.deaths).toFixed(2)} | BB: ${woolWars.blocks_broken} | WP: ${
          woolWars.wool_placed
        } | WPP: ${(woolWars.wool_placed / woolWars.games_played).toFixed(2)} | WPG: ${(
          woolWars.wool_placed / woolWars.blocks_broken
        ).toFixed(2)}
          `
      );
    } catch (error) {
      this.send(`/gc Error: ${error}`);
    }
  }
}

function getWoolWarsStar(exp) {
  const minimalExp = [0, 1e3, 3e3, 6e3, 1e4, 15e3];
  const baseLevel = minimalExp.length;
  const baseExp = minimalExp[minimalExp.length - 1];
  if (exp >= baseExp) return (exp - baseExp) / 5e3 + baseLevel;
  const lvl = minimalExp.findIndex((x) => exp < x);
  return lvl + exp / minimalExp[lvl];
}

module.exports = WoolwarsCommand;
