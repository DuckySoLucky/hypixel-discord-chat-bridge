const { formatNumber, formatUsername } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getTalismans = require("../../../API/stats/talismans.js");
const getDungeons = require("../../../API/stats/dungeons.js");
const getSlayer = require("../../../API/stats/slayer.js");
const getHotm = require("../../../API/stats/hotm.js");
const { getNetworth } = require("skyhelper-networth");
const { getSkillAverage } = require("../../../API/constants/skills.js");

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
        required: false
      }
    ];
  }

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;

      const data = await getLatestProfile(username);
      username = formatUsername(username, data.profileData.game_mode);

      const [skillAverage, slayer, networth, dungeons, talismans, hotm] = await Promise.all([
        getSkillAverage(data.profile, null),
        getSlayer(data.profile),
        getNetworth(data.profile, data.profileData?.banking?.balance || 0, {
          onlyNetworth: true,
          v2Endpoint: true,
          cache: true
        }),
        getDungeons(data.profile),
        getTalismans(data.profile),
        getHotm(data.profile)
      ]);

      const slayerText = Object.keys(slayer)
        .map((key) => `${slayer[key].level}${key[0].toUpperCase()}`)
        .join(", ");

      const catacombsLevel = dungeons.dungeons.level;
      const classAverage = formatNumber(dungeons.classAverage);
      const networthValue = formatNumber(networth.networth);
      const hotmLevel = hotm.level.level;
      const magicalPower = talismans.magicalPower;

      this.send(
        `${username}'s Level: ${
          data.profile.leveling?.experience ? data.profile.leveling.experience / 100 : 0
        } | Skill Avg: ${skillAverage} | Slayer: ${slayerText} | Cata: ${catacombsLevel} | Class Avg: ${classAverage} | NW: ${networthValue} | MP: ${magicalPower} | Hotm: ${hotmLevel}`
      );
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = SkyblockCommand;
