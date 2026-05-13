const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const { getSocialSkillExperience, getXpTable } = require("../../../API/constants/skills.js");
const { skillTables } = require("../../../API/constants/leveling.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");

// CREDITS: by @MattyHD0 (https://github.com/MattyHD0) for adaptation and 
// CREDITS: https://github.com/aidn3/hypixel-guild-discord-bridge for the original algorithm

class OverflowSkillsCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "overflowskills";
    this.aliases = ['oskills', 'oskill', 'osk', 'overflowskills'];
    this.description = "Overflow Skills and Skill Average of specified user.";
    this.options = [
      {
        name: "player",
        description: "Player username",
        required: false
      }
    ];
  }

  async onCommand(player, message) {
    try {
      const args = this.getArgs(message);
      const givenUsername = args[0] || player;

      const { username, profile, profileData } = await getLatestProfile(givenUsername);

      const totalSocialExperience = getSocialSkillExperience(profileData);

      const farming = this.#getLevel('combat', 'farming', profile.player_data.experience?.SKILL_FARMING ?? 0);
      const mining = this.#getLevel('combat', 'mining', profile.player_data.experience?.SKILL_MINING ?? 0);
      const combat = this.#getLevel('combat', 'combat', profile.player_data.experience?.SKILL_COMBAT ?? 0);
      const foraging = this.#getLevel('combat', 'foraging', profile.player_data.experience?.SKILL_FORAGING ?? 0);
      const fishing = this.#getLevel('combat', 'fishing', profile.player_data.experience?.SKILL_FISHING ?? 0);
      const enchanting = this.#getLevel('combat', 'enchanting', profile.player_data.experience?.SKILL_ENCHANTING ?? 0);
      const alchemy = this.#getLevel('combat', 'alchemy', profile.player_data.experience?.SKILL_ALCHEMY ?? 0);
      const carpentry = this.#getLevel('combat', 'carpentry', profile.player_data.experience?.SKILL_CARPENTRY ?? 0);
      const runecrafting = this.#getLevel('combat', 'runecrafting', profile.player_data.experience?.SKILL_RUNECRAFTING ?? 0);
      const social = this.#getLevel('combat', 'social', totalSocialExperience);
      const taming = this.#getLevel('combat', 'taming', profile.player_data.experience?.SKILL_TAMING ?? 0);

      const totalLevels = farming + mining + combat + foraging + fishing + enchanting + alchemy + carpentry + taming;

      const officialSkillsCount = skillTables.skills.length - 2;
      const average = totalLevels / officialSkillsCount;

      this.send(`${username}'s Overflow Skill Average: ${average.toFixed(2)} (Farming: ${farming.toFixed(2)}, Mining: ${mining.toFixed(2)}, Combat: ${combat.toFixed(2)}, Foraging: ${foraging.toFixed(2)}, Fishing: ${fishing.toFixed(2)}, Enchanting: ${enchanting.toFixed(2)}, Alchemy: ${alchemy.toFixed(2)}, Carpentry: ${carpentry.toFixed(2)}, Runecrafting: ${runecrafting.toFixed(2)}, Social: ${social.toFixed(2)}, Taming: ${taming.toFixed(2)})`);
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
  /*
   * Alternative leveling is required since some skills are capped
   * and need to supplement their levels with another
   * that has the required levels data.
   *
   * It isn't perfect, but it will give a more precise approximation to the uncapped level.
   */

  getTotalExpRequired(level, table) {
    let expRequired = 0;
    for(let i = 0; i <= level; i++) {
      expRequired += table[i] ?? 0;
    }
    return expRequired;
  }

  #getLevel(alternativeName, skillName, experience) {
    const levelingTable = Object.values(getXpTable(skillName.toLowerCase())).map((xp, index, array) =>{
      let expRequired = this.getTotalExpRequired(index, array);
      return index === 0 ? expRequired : expRequired - this.getTotalExpRequired(index - 1, array)
    }
    );
    const alternativeLevelingTable = Object.values(getXpTable(alternativeName.toLowerCase())).map((xp, index, array) => {
      let expRequired = this.getTotalExpRequired(index, array);
      return index === 0 ? expRequired : expRequired - this.getTotalExpRequired(index - 1, array)
    }
    );

    let level = 0;
    let nextLevelExperience = levelingTable[level];
    let skillOverflowSlope = 600_000;

    while (experience >= nextLevelExperience) {
      level++;
      experience -= nextLevelExperience;

      if (level >= levelingTable.length) {
        if (level < alternativeLevelingTable.length) {
          nextLevelExperience = alternativeLevelingTable[level];
        } else {
          nextLevelExperience += skillOverflowSlope;
          if (level % 10 === 0 && level !== 60) skillOverflowSlope *= 2;
        }
      } else {
        nextLevelExperience = levelingTable[level];
      }
    }

    return level + experience / nextLevelExperience;
  }
}

module.exports = OverflowSkillsCommand;