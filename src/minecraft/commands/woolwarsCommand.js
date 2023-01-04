const minecraftCommand = require("../../contracts/minecraftCommand.js");
const config = require("../../../config.json");
const axios = require("axios");
const { toFixed } = require("../../contracts/helperFunctions.js");
const { getUUID } = require("../../contracts/API/PlayerDBAPI.js");

function getWoolWarsStar(exp) {
  const minimalExp = [0, 1e3, 3e3, 6e3, 1e4, 15e3];
  const baseLevel = minimalExp.length;
  const baseExp = minimalExp[minimalExp.length - 1];
  if (exp >= baseExp) return (exp - baseExp) / 5e3 + baseLevel;
  const lvl = minimalExp.findIndex((x) => exp < x);
  return lvl + exp / minimalExp[lvl];
}

class WoolwarsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "woolwars";
    this.aliases = ["ww"];
    this.description = "WoolWars stats of specified user.";
    this.options = ["name"];
    this.optionsDescription = ["Minecraft Username"];
  }

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;

      const uuid = await getUUID(username);
      const response = (
        await axios.get(
          `https://api.hypixel.net/player?key=${config.api.hypixelAPIkey}&uuid=${uuid}`
        )
      ).data;

      if (response.player === null) {
        // eslint-disable-next-line no-throw-literal
        throw "This player has never joined Hypixel.";
      }

      const woolWars = response?.player?.stats?.WoolGames?.wool_wars;

      if (woolWars == undefined) {
        // eslint-disable-next-line no-throw-literal
        throw "This player has never played WoolWars.";
      }

      const level = getWoolWarsStar(response?.player?.stats?.WoolGames?.progression?.experience) || 0;

      this.send(
        `/gc [${toFixed(level, 0)}✫] ${username} » W: ${
          woolWars.stats.wins
        } | WLR: ${toFixed(
          woolWars.stats.wins / woolWars.stats.games_played,
          2
        )} | KDR: ${toFixed(
          woolWars.stats.kills / woolWars.stats.deaths,
          2
        )} | BB: ${woolWars.stats.blocks_broken} | WP: ${
          woolWars.stats.wool_placed
        }`
      );
    } catch (error) {
      this.send(`/gc Error: ${error}`)
    }
  }
}

module.exports = WoolwarsCommand;
