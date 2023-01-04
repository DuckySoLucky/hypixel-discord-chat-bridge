const minecraftCommand = require("../../contracts/minecraftCommand.js");
const {
  getLatestProfile,
} = require("../../../API/functions/getLatestProfile.js");
const getSkills = require("../../../API/stats/skills.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");

class SkillsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "skills";
    this.aliases = ["skill"];
    this.description = "Skills and Skill Average of specified user.";
    this.options = ["name"];
    this.optionsDescription = ["Minecraft Username"];
  }

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;

      const data = await getLatestProfile(username);

      username = formatUsername(username, data.profileData.cute_name);

      const profile = getSkills(data.profile);

      this.send(
        `/gc Skill Average » ${
          (
            Object.keys(profile)
              .filter((skill) => !["runecrafting", "social"].includes(skill))
              .map((skill) => profile[skill].level)
              .reduce((a, b) => a + b, 0) /
            (Object.keys(profile).length - 2)
          ).toFixed(2) || 0
        } | Farming - ${profile.farming.levelWithProgress.toFixed(2) || 0} | Mining - ${
          profile.mining.levelWithProgress.toFixed(2) || 0
        } | Combat - ${profile.combat.levelWithProgress.toFixed(2) || 0} | Enchanting - ${
          profile.enchanting.levelWithProgress.toFixed(2) || 0
        } | Fishing - ${profile.fishing.levelWithProgress.toFixed(2) || 0} | Foraging - ${
          profile.foraging.levelWithProgress.toFixed(2) || 0
        } | Alchemy - ${profile.alchemy.levelWithProgress.toFixed(2) || 0} | Taming - ${
          profile.taming.levelWithProgress.toFixed(2) || 0
        } | Carpentry - ${profile.carpentry.levelWithProgress.toFixed(2) || 0}`
      );
    } catch (error) {
      this.send(`Error: ${error}}`);
    }
  }
}

module.exports = SkillsCommand;
