const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const getSkills = require("../../../API/stats/skills.js");
const { getSkillAverage } = require("../../../API/constants/skills.js");
const helperFunctions = require("../../contracts/helperFunctions.js");
const { capitalize } = require("lodash");

class SkillsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "skills";
    this.aliases = ["skill", "sa"];
    this.description = "Skills and Skill Average of specified user.";
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

      const skillAverage = getSkillAverage(profile);
      const skills = getSkills(profile, profileData);

      const formattedSkills = [];
      for (const [skill, data] of Object.entries(skills)) {
        formattedSkills.push(`${capitalize(skill)}: ${helperFunctions.formatNumber(data.levelWithProgress, 2)}`);
      }

      this.send(`${username}'s Skill Average: ${skillAverage ?? 0} (${formattedSkills.join(", ")})`);
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = SkillsCommand;
