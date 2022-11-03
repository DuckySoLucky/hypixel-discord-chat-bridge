const calcSkill = require("../constants/skills.js");

module.exports = function getSkills(player, profile) {
  const skillExperience = {
    farming: profile?.experience_skill_farming || 0,
    mining: profile?.experience_skill_mining || 0,
    combat: profile?.experience_skill_combat || 0,
    foraging: profile?.experience_skill_foraging || 0,
    fishing: profile?.experience_skill_fishing || 0,
    enchanting: profile?.experience_skill_enchanting || 0,
    alchemy: profile?.experience_skill_alchemy || 0,
    carpentry: profile?.experience_skill_carpentry || 0,
    runecrafting: profile?.experience_skill_runecrafting || 0,
    social: profile?.experience_skill_social2 || 0,
    taming: profile?.experience_skill_taming || 0,
  };

  return {
    farming: calcSkill("farming", skillExperience["farming"]),
    mining: calcSkill("mining", skillExperience["mining"]),
    combat: calcSkill("combat", skillExperience["combat"]),
    foraging: calcSkill("foraging", skillExperience["foraging"]),
    fishing: calcSkill("fishing", skillExperience["fishing"]),
    enchanting: calcSkill("enchanting", skillExperience["enchanting"]),
    alchemy: calcSkill("alchemy", skillExperience["alchemy"]),
    carpentry: calcSkill("carpentry", skillExperience["carpentry"]),
    runecrafting: calcSkill("runecrafting", skillExperience["runecrafting"]),
    social: calcSkill("social", skillExperience["social"]),
    taming: calcSkill("taming", skillExperience["taming"]),
  };
};
