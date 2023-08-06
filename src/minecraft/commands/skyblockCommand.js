const { formatNumber, formatUsername } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getTalismans = require("../../../API/stats/talismans.js");
const getDungeons = require("../../../API/stats/dungeons.js");
const getSkills = require("../../../API/stats/skills.js");
const getSlayer = require("../../../API/stats/slayer.js");
const getWeight = require("../../../API/stats/weight.js");
const { getNetworth } = require("skyhelper-networth");

class SkyblockCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "skyblock";
    this.aliases = ["stats", "sb"];
    this.description = "Skyblock Stats of specified user.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false,
      },
    ];
  }

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;

      const data = await getLatestProfile(username);
      username = formatUsername(username, data.profileData.game_mode);

      const [skills, slayer, networth, weight, dungeons, talismans] = await Promise.all([
        getSkills(data.profile),
        getSlayer(data.profile),
        getNetworth(data.profile, data.profileData?.banking?.balance || 0, {
          cache: true,
          onlyNetworth: true,
        }),
        getWeight(data.profile),
        getDungeons(data.player, data.profile),
        getTalismans(data.profile),
      ]);

      const senitherWeight = Math.floor(weight?.senither?.total || 0).toLocaleString();
      const lilyWeight = Math.floor(weight?.lily?.total || 0).toLocaleString();
      const skillAverage = (
        Object.keys(skills)
          .filter((skill) => !["runecrafting", "social"].includes(skill))
          .map((skill) => skills[skill].level)
          .reduce((a, b) => a + b, 0) /
        (Object.keys(skills).length - 2)
      ).toFixed(1);
      const slayerXp = Object.value(slayer)
        .map((slayerData) => slayerData.xp)
        .reduce((a, b) => a + b, 0)
        .toLocaleString();
      const catacombsLevel = dungeons.catacombs.skill.level;
      const classAverage =
        Object.values(dungeons.classes)
          .map((value) => value.level)
          .reduce((a, b) => a + b, 0) / Object.keys(dungeons.classes).length;
      const networthValue = formatNumber(networth.networth);
      const talismanCount = talismans.total;
      const recombobulatedCount = talismans.recombed;
      const enrichmentCount = talismans.enriched;

      this.send(
        `/gc ${username}'s Level: ${
          data.profile.leveling?.experience ? data.profile.leveling.experience / 100 : 0
        } | Senither Weight: ${senitherWeight} | Lily Weight: ${lilyWeight} | Skill Average: ${skillAverage} | Slayer: ${slayerXp} | Catacombs: ${catacombsLevel} | Class Average: ${classAverage} | Networth: ${networthValue} | Accessories: ${talismanCount} | Recombobulated: ${recombobulatedCount} | Enriched: ${enrichmentCount}`
      );
    } catch (error) {
      console.log(error);
      this.send("/gc There is no player with the given UUID or name or the player has no Skyblock profiles");
    }
  }
}

module.exports = SkyblockCommand;
