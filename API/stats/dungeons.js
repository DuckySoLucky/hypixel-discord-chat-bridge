const { getLevelByXp } = require("../constants/skills.js");
const { titleCase } = require("../constants/functions.js");

module.exports = (profile) => {
  try {
    const dungeons = profile?.dungeons;
    if (dungeons === undefined) {
      return null;
    }

    const playerClasses = dungeons?.player_classes ?? {};
    const experience = dungeons?.dungeon_types?.catacombs?.experience ?? 0;
    const classes = {
      healer: getLevelByXp(playerClasses.healer.experience, { type: "dungeoneering" }),
      mage: getLevelByXp(playerClasses.mage.experience, { type: "dungeoneering" }),
      berserk: getLevelByXp(playerClasses.berserk.experience, { type: "dungeoneering" }),
      archer: getLevelByXp(playerClasses.archer.experience, { type: "dungeoneering" }),
      tank: getLevelByXp(playerClasses.tank.experience, { type: "dungeoneering" })
    };

    return {
      selectedClass: titleCase(dungeons?.selected_dungeon_class ?? "none"),
      secretsFound: dungeons?.secrets ?? 0,
      dungeons: getLevelByXp(experience, { type: "dungeoneering" }),
      classAverage: Object.entries(classes).reduce((acc, [key, value]) => acc + value.levelWithProgress, 0) / 5,
      classes
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
