const { formatNumber } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getEssence = require("../../../API/stats/essence.js");
const { titleCase } = require("../../../API/constants/functions.js");

class EssenceCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "essence";
    this.aliases = [];
    this.description = "Skyblock Dungeons Stats of specified user.";
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

      const essence = getEssence(profile);
      if (essence == null) {
        throw `${username} has never unlocked essence on ${profileData.cute_name}.`;
      }

      const essenceString = Object.entries(essence)
        .map(([key, value]) => `${titleCase(key)}: ${formatNumber(value)}`)
        .join(", ");

      this.send(`${username}'s Essence: ${essenceString}`);
    } catch (error) {
      console.error(error);

      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = EssenceCommand;
