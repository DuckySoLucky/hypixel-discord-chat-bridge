const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getHotm = require("../../../API/stats/hotm.js");

class ForgeCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "forge";
    this.aliases = [];
    this.description = "Skyblock Forge Info Stats of specified user.";
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

      const { username, profile, profileData } = await getLatestProfile(player);

      const forge = getHotm.getForge(profile);
      if (forge == null) {
        throw `${username} has never gone to Dwarven Mines on ${profileData.cute_name}.`;
      }

      if (forge.length === 0 || forge == null) {
        throw `${username} has no items in their forge.`;
      }

      const forgeItems = forge.map((item) => `${item.slot}: ${item.name} ${item.timeFinishedText}`);
      this.send(`${username}'s Forge: ${forgeItems.join(" | ")}`);
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = ForgeCommand;
