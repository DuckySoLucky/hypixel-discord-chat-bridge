const minecraftCommand = require("../../contracts/minecraftCommand.js");
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

      const lilyW = `Lily Weight » ${
        Math.round(profile.lily.total * 100) / 100
      } | Skills » ${
        Math.round(profile.lily.skills.total * 100) / 100
      } | Slayer » ${
        Math.round(profile.lily.slayer.total * 100) / 100
      } | Dungeons » ${
        Math.round(profile.lily.catacombs.total * 100) / 100
      }`;
      const senitherW = `Senither Weight » ${
        Math.round(profile.senither.total * 100) / 100
      } | Skills: ${
        Math.round(
          (profile.senither.skills.alchemy.total +
            profile.senither.skills.combat.total +
            profile.senither.skills.enchanting.total +
            profile.senither.skills.farming.total +
            profile.senither.skills.fishing.total +
            profile.senither.skills.foraging.total +
            profile.senither.skills.mining.total +
            profile.senither.skills.taming.total) *
            100
        ) / 100
      } | Slayer: ${
        Math.round(profile.senither.slayer.total * 100) / 100
      } | Dungeons: ${
        Math.round(profile.senither.dungeons.total * 100) / 100
      }`;
      this.send(`/gc ${username}'s ${senitherW}`);
      await delay(690);
      this.send(`/gc ${username}'s ${lilyW}`);
    } catch (error) {
      this.send(`/gc Error: ${error}`)
    }
  }
}

module.exports = StatsCommand;
