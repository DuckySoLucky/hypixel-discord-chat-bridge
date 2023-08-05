
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const config = require("../../../config.json");
const axios = require("axios");

class clown extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "clown";
    this.aliases = ["bonzo", "bonzomask", "bozo", "bozomask"];
    this.description = "Bonzo Mask.";
    this.options = [];
  }

  async onCommand(username, message) {
    try {
        return this.send("/gc https://i.imgur.com/dH4Vq3H.png");

    } catch (error) {
      this.send(`/gc Error: ${error?.response?.data?.error || error}`);
    }
  }
}

module.exports = clown;
