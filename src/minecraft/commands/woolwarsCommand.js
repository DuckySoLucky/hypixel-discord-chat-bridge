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
      const msg = this.getArgs(message);
      if (msg[0]) username = msg[0];

      const uuid = await getUUID(username);
      const woolWars = (
        await axios.get(
          `https://api.hypixel.net/player?key=${config.api.hypixelAPIkey}&uuid=${uuid}`
        )
      ).data.player.stats.WoolGames;
      const level = getWoolWarsStar(woolWars.progression.experience);

      this.send(
        `/gc [${toFixed(level, 0)}✫] ${username} » W: ${
          woolWars.wool_wars.stats.wins
        } | WLR: ${toFixed(
          woolWars.wool_wars.stats.wins / woolWars.wool_wars.stats.games_played,
          2
        )} | KDR: ${toFixed(
          woolWars.wool_wars.stats.kills / woolWars.wool_wars.stats.deaths,
          2
        )} | BB: ${woolWars.wool_wars.stats.blocks_broken} | WP: ${
          woolWars.wool_wars.stats.wool_placed
        }`
      );
    } catch (error) {
      this.send(
        "There is no player with the given UUID or name or player has never joined Hypixel."
      );
    }
  }
}

module.exports = WoolwarsCommand;
