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

  async onCommand(username, message, officer) {
    try {
      // CREDITS: by @Kathund (https://github.com/Kathund)
      const { data } = await axios.get(`https://api.hypixel.net/v2/resources/skyblock/election`);

      if (data === undefined || data.success === false) {
        // eslint-disable-next-line no-throw-literal
        throw "Request to Hypixel API failed. Please try again!";
      }

      if (data.current.candidates.length === 0) {
        this.send(
          `[MAYOR] ${data.mayor.name} is the current mayor of Skyblock! Perks: ${data.mayor.perks
            .map((perk) => perk.name)
            .join(", ")}`,
          officer,
        );
      } else {
        const currentLeader = data.current.candidates.sort((a, b) => b.votes - a.votes)[0];
        this.send(
          `[MAYOR] ${data.mayor.name} is the current mayor of Skyblock! Perks: ${data.mayor.perks
            .map((perk) => perk.name)
            .join(", ")} | Current Election: ${currentLeader.name}`,
          officer,
        );
      }
    } catch (error) {
      this.send(`[ERROR] ${error}`, officer);
    }
  }
}

module.exports = MayorCommand;
