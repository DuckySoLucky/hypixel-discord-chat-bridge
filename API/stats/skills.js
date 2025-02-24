const { getSkillLevelCaps, getSocialSkillExperience, getLevelByXp } = require("../constants/skills.js");

/**
 * Returns the skill levels for a player's profile data.
 * @param {import("../../types/profiles.js").Member} profile
 * @param {import("../../types/profiles.js").Profile} profileData
 * @returns {import("./skills.types.js").Skills | null}
 */
function getSkills(profile, profileData) {
  if (profile.player_data?.experience === undefined) {
    return null;
  }

  const skillLevelCaps = getSkillLevelCaps(profile, null);
  const totalSocialXp = getSocialSkillExperience(profileData);

  /** @type {import("./skills.types.js").Skills} */
  const skills = {};
  for (const skill in profile.player_data?.experience || {}) {
    if (skill === "SKILL_DUNGEONEERING") {
      continue;
    }

    // @ts-ignore
    const xp = skill === "SKILL_SOCIAL" ? totalSocialXp : profile.player_data?.experience[skill];
    const type = skill.split("_").at(1)?.toLowerCase();

    // @ts-ignore
    skills[type] = getLevelByXp(xp, { type: type, cap: skillLevelCaps[type] });
  }

  return skills;
}

module.exports = {
  getSkills
};
