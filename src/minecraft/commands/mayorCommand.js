const minecraftCommand = require("../../contracts/minecraftCommand.js");
const axios = require("axios");

class MayorCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "mayor";
    this.aliases = [];
    this.description = "Skyblock Mayor.";
    this.options = [];
  }

  async onCommand(username, message) {
    try {
      const { data } = await axios.get(`https://api.hypixel.net/v2/resources/skyblock/election`);

      if (data === undefined || data.success === false) {
        // eslint-disable-next-line no-throw-literal
        throw "Request to Hypixel API failed. Please try again!";
      }
      this.send(
        `/gc [MAYOR] ${data.mayor.name} is the current mayor of Skyblock! Perks: ${data.mayor.perks.map((perk) => perk.name).join(", ")}`,
      );
    } catch (error) {
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}

module.exports = MayorCommand;
