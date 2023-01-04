const minecraftCommand = require("../../contracts/MinecraftCommand.js");
const {
  getLatestProfile,
} = require("../../../API/functions/getLatestProfile.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getWeight = require("../../../API/stats/weight.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");

class StatsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "weight";
    this.aliases = ["w"];
    this.description = "Skyblock Weight of specified user.";
    this.options = ["name"];
    this.optionsDescription = ["Minecraft Username"];
  }

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;
      const data = await getLatestProfile(username);

      username = formatUsername(data.profileData?.displayname || username);

      const profile = await getWeight(data.profile, data.uuid);

      const lilyW = `Lily Weight » ${profile.lily.total.toFixed(
        2
      )} | Skills » ${profile.lily.skills.total.toFixed(
        2
      )} | Slayer » ${profile.lily.slayer.total.toFixed(
        2
      )} | Dungeons » ${profile.lily.catacombs.total.toFixed(2)}`;
      const senitherW = `Senither Weight » ${profile.senither.total.toFixed(
        2
      )} | Skills: ${Object.keys(profile.senither.skills)
        .map((skill) => profile.senither.skills[skill].total)
        .reduce((a, b) => a + b, 0)
        .toFixed(2)
      } | Dungeons: ${profile.senither.dungeons.total.toFixed(2)}`;
      this.send(`/gc ${username}'s ${senitherW}`);
      await delay(690);
      this.send(`/gc ${username}'s ${lilyW}`);
    } catch (error) {
      this.send(`/gc Error: ${error}`);
    }
  }
}

module.exports = StatsCommand;
