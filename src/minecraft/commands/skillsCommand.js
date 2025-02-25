const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const { formatNumber, titleCase } = require("../../contracts/helperFunctions.js");
const { getSkillAverage } = require("../../../API/constants/skills.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getSkills } = require("../../../API/stats/skills.js");

class SkillsCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
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

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    try {
      const args = this.getArgs(message);
      player = args[0] || player;

      const { username, profile, profileData } = await getLatestProfile(player);

      const skillAverage = getSkillAverage(profile, null, {});
      const skills = getSkills(profile, profileData);
      if (!skills) {
        return this.send(`${username} has no skills.`);
      }

      const formattedSkills = [];
      for (const [skill, data] of Object.entries(skills)) {
        formattedSkills.push(`${titleCase(skill)}: ${formatNumber(data.levelWithProgress, 2)}`);
      }

      this.send(`${username}'s Skill Average: ${skillAverage ?? 0} (${formattedSkills.join(", ")})`);
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = SkillsCommand;
