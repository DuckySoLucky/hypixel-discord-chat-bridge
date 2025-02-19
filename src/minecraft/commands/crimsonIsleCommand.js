const { formatNumber } = require("../../contracts/helperFunctions.js");
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
        required: false
      }
    ];
  }

  async onCommand(player, message) {
    try {
      // CREDITS: by @Kathund (https://github.com/Kathund)
      const args = this.getArgs(message);
      player = args[0] || player;

      const { username, profile, profileData } = await getLatestProfile(player);

      const crimsonData = getCrimson(profile);
      if (crimsonData == null) {
        throw `${username} has never gone to Crimson Isle on ${profileData.profileData.cute_name}.`;
      }

      this.send(
        `${username}'s faction: ${crimsonData.faction} | Barb Rep: ${formatNumber(
          crimsonData.reputation.barbarian
        )} | Mage Rep: ${formatNumber(crimsonData.reputation.mage)}`
      );
    } catch (error) {
      console.error(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = CrimsonIsleCommand;
