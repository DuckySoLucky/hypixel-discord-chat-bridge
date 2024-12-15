const { formatUsername, formatNumber } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getCrimson = require("../../../API/stats/crimson.js");

class CrimsonIsleCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "crimsonisle";
    this.aliases = ["crimson", "nether", "isle"];
    this.description = "Crimson Isle Stats of specified user.";
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
        `${username}'s faction: ${profile.faction} | Barb Rep: ${formatNumber(
          profile.reputation.barbarian,
        )} | Mage Rep: ${formatNumber(profile.reputation.mage)}`,
      );
    } catch (error) {
      console.log(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = CrimsonIsleCommand;
