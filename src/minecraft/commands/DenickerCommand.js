const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const config = require("../../../config.json");
const axios = require("axios");

class DenickerCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "denick";
    this.aliases = [];
    this.description = "Denick username of specified user.";
    this.options = ["nick"];
    this.optionsDescription = ["Minecraft Username"];
  }

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0];
      const { data } = await axios.get(`${config.api.antiSniperAPI}/denick?key=${config.api.antiSniperKey}&nick=${username}`);

      if (data.player?.ign == null) {
        return this.send("/gc Sorry, I wasn't able to denick this person.");
      }

      const player = await hypixel.getPlayer(data.player?.ign);

      this.send(`/gc ${player.rank ? `[${player.rank}] ` : ``}${data.player?.ign} is nicked as ${data.player.queried_nick}`);
    } catch (error) {
      this.send(`/gc Error: ${error?.response?.data?.error || error}`);
    }
  }
}

module.exports = DenickerCommand;
