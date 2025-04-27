const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getAccessories } = require("../../../API/stats/accessories.js");
const { getSkillAverage } = require("../../../API/constants/skills.js");
const { formatNumber } = require("../../contracts/helperFunctions.js");
const { ProfileNetworthCalculator } = require("skyhelper-networth");
const { getDungeons } = require("../../../API/stats/dungeons.js");
const { getSlayer } = require("../../../API/stats/slayer.js");
const { getHotm } = require("../../../API/stats/hotm.js");

class SkyblockCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
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

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    try {
      const args = this.getArgs(message);
      player = args[0] || player;

      const { username, profile, museum, profileData } = await getLatestProfile(player, { museum: true });
      const bankingBalance = profileData.banking?.balance ?? 0;

      const networthManager = new ProfileNetworthCalculator(profile, museum, bankingBalance);
      const [skillAverage, slayer, networth, dungeons, talismans, hotm] = await Promise.all([
        getSkillAverage(profile, null),
        getSlayer(profile),
        networthManager.getNetworth({ onlyNetworth: true }),
        getDungeons(profile),
        getAccessories(profile),
        getHotm(profile)
      ]);

      const slayerText = Object.keys(slayer ?? {})
        // @ts-ignore
        .map((key) => `${slayer[key].level}${key[0].toUpperCase()}`)
        .join(", ");

      const catacombsLevel = dungeons?.dungeons?.level;
      const classAverage = formatNumber(dungeons?.classAverage ?? 0);
      const networthValue = formatNumber(networth.networth ?? 0);
      const hotmLevel = formatNumber(hotm?.level.levelWithProgress);
      const magicalPower = talismans?.magicalPower ?? 0;
      const level = profile.leveling?.experience ? profile.leveling.experience / 100 : 0;

      this.send(
        `${username}'s Level: ${level} | Skill Avg: ${skillAverage} | Slayer: ${slayerText} | Cata: ${catacombsLevel} | Class Avg: ${classAverage} | NW: ${networthValue} | MP: ${magicalPower} | Hotm: ${hotmLevel}`
      );
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = SkyblockCommand;
