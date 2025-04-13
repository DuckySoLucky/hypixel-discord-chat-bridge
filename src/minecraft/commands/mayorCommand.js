const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { delay } = require("../../contracts/helperFunctions.js");
// @ts-ignore
const { get } = require("axios");

class MayorCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "mayor";
    this.aliases = [];
    this.description = "Skyblock Mayor.";
    this.options = [];
  }

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    try {
      // CREDITS: by @Kathund (https://github.com/Kathund)
      const response = await get(`https://api.hypixel.net/v2/resources/skyblock/election`);
      if (response === undefined || response.data === undefined || response.data.success === false) {
        throw "Request to Hypixel API failed. Please try again!";
      }

      /** @type {import("../../../types/election.js").Mayor} */
      const data = response.data;

      this.send(
        `[MAYOR] ${data.mayor.name} is the current mayor of Skyblock! Perks: ${data.mayor.perks
          .map((perk) => perk.name)
          .join(", ")}, Minister Perk: ${data.mayor.minister?.perk?.name ?? "Unknown"}`
          .replaceAll("ez", "e-z")
          .replaceAll("EZ", "E-Z")
      );

      await delay(1000);
      if (data.mayor.election.candidates.length > 0) {
        const currentLeader = data.mayor.election.candidates.sort((a, b) => (b.votes || 0) - (a.votes || 0))[0];
        if (!currentLeader) {
          return this.send(`[MAYOR] No current leader.`);
        }

        const totalVotes = data.mayor.election.candidates.reduce((total, candidate) => total + (candidate.votes || 0), 0);
        const percentage = ((currentLeader.votes || 0) / totalVotes) * 100;
        this.send(`[MAYOR] Current Election: ${currentLeader.name} has ${percentage.toFixed(2)}% of the votes.`);
      }
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = MayorCommand;
