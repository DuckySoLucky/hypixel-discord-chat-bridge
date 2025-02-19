const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const getSkills = require("../../../API/stats/skills.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");
const {
  getSkillLevelCaps,
  getSkillAverage,
  getSocialSkillExperience,
  getLevelByXp
} = require("../../../API/constants/skills.js");
const { profile } = require("winston");
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

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;

      const data = await getLatestProfile(username);

      username = formatUsername(username, data.profileData.cute_name);

      const skillAverage = getSkillAverage(data.profile);
      const skills = getSkills(data.profile, data.profileData);

      const formattedSkills = [];
      for (const [skill, data] of Object.entries(skills)) {
        formattedSkills.push(`${capitalize(skill)}: ${helperFunctions.toFixed(data.levelWithProgress, 2)}`);
      }

      this.send(`${username}'s Skill Average: ${skillAverage ?? 0} (${formattedSkills.join(", ")})`);
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = SkillsCommand;
