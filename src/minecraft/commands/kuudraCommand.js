const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { formatNumber } = require("../../contracts/helperFunctions.js");
const { getKuudra } = require("../../../API/stats/crimson.js");

class KuudraCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
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

      const kuudraData = getKuudra(profile);
      if (kuudraData == null) {
        throw `${username} has never gone to Crimson Isle on ${profileData.cute_name}.`;
      }

      this.send(
        `${username}'s Basic: ${formatNumber(kuudraData.basic)} | Hot: ${formatNumber(
          kuudraData.hot
        )} | Burning: ${formatNumber(kuudraData.burning)} | Fiery: ${formatNumber(kuudraData.fiery)} | Infernal: ${formatNumber(kuudraData.infernal)}`
      );
    } catch (error) {
      console.error(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = KuudraCommand;
