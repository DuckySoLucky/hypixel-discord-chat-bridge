const { formatUsername, formatNumber } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getCrimson = require("../../../API/stats/crimson.js");

class TrophyFishCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "trophyfish";
    this.aliases = ["tf", "trophyfishing", "trophy"];
    this.description = "Dojo Stats of specified user.";
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
      // CREDITS: by @Kathund (https://github.com/Kathund)
      username = this.getArgs(message)[0] || username;

      const data = await getLatestProfile(username);
      username = formatUsername(username, data.profileData?.game_mode);
      const profile = getCrimson(data.profile);

      if (profile == null) {
        // eslint-disable-next-line no-throw-literal
        throw `${username} has never gone to Crimson Isle on ${data.profileData.cute_name}.`;
      }

      this.send(
        `/gc ${username}'s Trophy Fishing rank: ${profile.trophyFishing.rank} | Total Caught: ${formatNumber(
          profile.trophyFishing.caught.total,
        )} | Total Bronze: ${formatNumber(profile.trophyFishing.caught.bronze)} / 18 | Total Silver: ${formatNumber(
          profile.trophyFishing.caught.silver,
        )} / 18 | Total Gold: ${formatNumber(profile.trophyFishing.caught.gold)} | Total Diamond: ${formatNumber(
          profile.trophyFishing.caught.diamond,
        )} / 18`,
      );
    } catch (error) {
      console.error(error);
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}

module.exports = TrophyFishCommand;
