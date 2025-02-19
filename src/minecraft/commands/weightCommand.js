const minecraftCommand = require("../../contracts/minecraftCommand.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getWeight = require("../../../API/stats/weight.js");
const {  formatNumber } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");

class StatsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "weight";
    this.aliases = ["w"];
    this.description = "Skyblock Weight of specified user.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false
      }
    ];
  }

  async onCommand(player, message) {
    try {
      const args = this.getArgs(message);
      player = args[0] || player;

      const { username, profile, profileData } = await getLatestProfile(player);

      const weight = getWeight(profile, profileData);

      const lilyW = `Lily Weight: ${formatNumber(weight.lily.total)} | Skills: ${formatNumber(
        weight.lily.skills.total
      )} | Slayer: ${formatNumber(weight.lily.slayer.total)} | Dungeons: ${formatNumber(weight.lily.catacombs.total)}`;
      const senitherW = `Senither Weight: ${formatNumber(weight.senither.total)} | Skills: ${formatNumber(
        Object.keys(weight.senither.skills)
          .map((skill) => weight.senither.skills[skill].total)
          .reduce((a, b) => a + b, 0)
      )} | Dungeons: ${formatNumber(weight.senither.dungeons.total)}`;
      this.send(`${username}'s ${senitherW}`);
      await delay(690);
      this.send(`${username}'s ${lilyW}`);
    } catch (error) {
      console.log(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = StatsCommand;
