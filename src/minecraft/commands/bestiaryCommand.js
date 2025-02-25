const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { formatNumber } = require("../../contracts/helperFunctions.js");
const { getBestiary } = require("../../../API/stats/bestiary.js");

class BestiaryCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "bestiary";
    this.aliases = ["be"];
    this.description = "Bestiary of specified user.";
    this.options = [
      {
        name: "username",
        description: "Mincraft Username",
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
      player = args[0] ?? player;

      const { username, profile } = await getLatestProfile(player);

      const bestiary = getBestiary(profile);
      if (bestiary === null) {
        return this.send("This player has not yet joined SkyBlock since the bestiary update.");
      }

      const progress = formatNumber((bestiary.level / bestiary.maxLevel) * 100, 2);
      this.send(
        `${username}'s Bestiary: ${bestiary.level} / ${bestiary.maxLevel} (${progress}%) | Unlocked Tiers: ${bestiary.familyTiers} / ${bestiary.maxFamilyTiers} | Unlocked Families: ${bestiary.familiesUnlocked} / ${bestiary.totalFamilies} | Families Maxed: ${bestiary.familiesCompleted}`
      );
    } catch (error) {
      console.error(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = BestiaryCommand;
