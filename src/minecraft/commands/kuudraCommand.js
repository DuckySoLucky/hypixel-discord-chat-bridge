const { formatNumber } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getCrimson = require("../../../API/stats/crimson.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");

class KuudraCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "kuudra";
    this.aliases = [];
    this.description = "Kuudra Stats of specified user.";
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

      const crimsonIsle = getCrimson(profile);

      if (crimsonIsle == null) {
        throw `${username} has never gone to Crimson Isle on ${profileData.cute_name}.`;
      }

      this.send(
        `${username}'s Basic: ${formatNumber(crimsonIsle.kuudra.basic)} | Hot: ${formatNumber(
          crimsonIsle.kuudra.hot
        )} | Burning: ${formatNumber(crimsonIsle.kuudra.burning)} | Fiery: ${formatNumber(
          crimsonIsle.kuudra.fiery
        )} | Infernal: ${formatNumber(crimsonIsle.kuudra.infernal)}`
      );
    } catch (error) {
      console.error(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = KuudraCommand;
