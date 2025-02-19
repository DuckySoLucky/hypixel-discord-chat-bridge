const { getSkillLevelCaps, getSocialSkillExperience, getLevelByXp } = require("../constants/skills.js");

module.exports = function getSkills(profile, profileData) {
  const skillLevelCaps = getSkillLevelCaps(profile);
  const totalSocialXp = getSocialSkillExperience(profileData);

  const skills = {};
  for (const skill in profile.player_data?.experience || {}) {
    if (skill === "SKILL_DUNGEONEERING") {
      continue;
    }

    const xp = skill === "SKILL_SOCIAL" ? totalSocialXp : profile.player_data?.experience[skill];
    const type = skill.split("_").at(1).toLowerCase();

    skills[type] = getLevelByXp(xp, { type: type, cap: skillLevelCaps[type] });
  }

  return skills;
};
