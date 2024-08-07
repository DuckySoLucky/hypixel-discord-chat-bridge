const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getWeight = require("../../../API/stats/weight.js");
const { formatUsername, formatNumber } = require("../../contracts/helperFunctions.js");

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
        required: false,
      },
    ];
  }

  async onCommand(username, message, officer) {
    try {
      username = this.getArgs(message)[0] || username;
      const data = await getLatestProfile(username);

      username = formatUsername(data.profileData?.displayname || username);

      const profile = getWeight(data.profile, data.uuid);

      const lilyW = `Lily Weight: ${formatNumber(profile.lily.total)} | Skills: ${formatNumber(
        profile.lily.skills.total,
      )} | Slayer: ${formatNumber(profile.lily.slayer.total)} | Dungeons: ${formatNumber(
        profile.lily.catacombs.total,
      )}`;
      const senitherW = `Senither Weight: ${formatNumber(profile.senither.total)} | Skills: ${formatNumber(
        Object.keys(profile.senither.skills)
          .map((skill) => profile.senither.skills[skill].total)
          .reduce((a, b) => a + b, 0),
      )} | Dungeons: ${formatNumber(profile.senither.dungeons.total)}`;
      this.send(`${username}'s ${senitherW}`, officer);
      await delay(690);
      this.send(`${username}'s ${lilyW}`, officer);
    } catch (error) {
      this.send(`[ERROR] ${error}`, officer);
    }
  }
}

module.exports = StatsCommand;
