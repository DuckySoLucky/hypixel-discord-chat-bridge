const minecraftCommand = require("../../contracts/minecraftCommand.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
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
      // CREDITS: by @Kathund (https://github.com/Kathund)
      const { data } = await axios.get(`https://api.hypixel.net/v2/resources/skyblock/election`);

      if (data === undefined || data.success === false) {
        // eslint-disable-next-line no-throw-literal
        throw "Request to Hypixel API failed. Please try again!";
      }

      this.send(
        `[MAYOR] ${data.mayor.name} is the current mayor of Skyblock! Perks: ${data.mayor.perks
          .map((perk) => perk.name)
          .join(", ")}, Minister Perk: ${data.mayor.minister.perk.name}`
      );
      await delay(500);
      if (data.mayor.election.candidates.length > 0) {
        const currentLeader = data.mayor.election.candidates.sort((a, b) => (b.votes || 0) - (a.votes || 0))[0];
        if (!currentLeader) return;
        const totalVotes = data.mayor.election.candidates.reduce(
          (total, candidate) => total + (candidate.votes || 0),
          0
        );
        const percentage = ((currentLeader.votes || 0) / totalVotes) * 100;
        this.send(`[MAYOR] Current Election: ${currentLeader.name} has ${percentage.toFixed(2)}% of the votes.`);
      }
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = MayorCommand;
