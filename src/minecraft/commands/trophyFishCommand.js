const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const { formatNumber } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getTrophyFish } = require("../../../API/stats/crimson.js");

class TrophyFishCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "trophyfish";
    this.aliases = ["tf", "trophyfishing", "trophy"];
    this.description = "Dojo Stats of specified user.";
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
      // CREDITS: by @Kathund (https://github.com/Kathund)
      const args = this.getArgs(message);
      player = args[0] || player;

      const { username, profile, profileData } = await getLatestProfile(player);

      const trophyfish = getTrophyFish(profile);
      if (trophyfish == null) {
        throw `${username} has never gone to Crimson Isle on ${profileData.cute_name}.`;
      }

      this.send(
        `${username}'s Trophy Fishing rank: ${trophyfish.rank} | Caught: ${formatNumber(
          trophyfish.caught.total
        )} | Bronze: ${formatNumber(trophyfish.caught.bronze)} / 18 | Silver: ${formatNumber(
          trophyfish.caught.silver
        )} / 18 | Gold: ${formatNumber(trophyfish.caught.gold)} | Diamond: ${formatNumber(trophyfish.caught.diamond)} / 18`
      );
    } catch (error) {
      console.error(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = TrophyFishCommand;
