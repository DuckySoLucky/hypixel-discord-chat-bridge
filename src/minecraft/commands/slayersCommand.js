const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const { formatNumber, titleCase } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getSlayer } = require("../../../API/stats/slayer.js");

class SlayersCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "slayer";
    this.aliases = ["slayers"];
    this.description = "Slayer of specified user.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false
      },
      {
        name: "slayer",
        description: "Slayer type",
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
      const slayer = ["zombie", "rev", "spider", "tara", "wolf", "sven", "eman", "enderman", "blaze", "demonlord", "vamp", "vampire"];

      const slayerType = slayer.includes(args[1]) ? args[1] : null;
      player = args[0] || player;

      const { username, profile } = await getLatestProfile(player);

      const slayerData = getSlayer(profile);
      if (slayerData === null) {
        return this.send(`${username} has no slayer data.`);
      }

      if (slayerType) {
        this.send(`${username}'s ${titleCase(slayerType)} - ${slayerData[slayerType].level} Levels | Experience: ${formatNumber(slayerData[slayerType].xp)}`);
      } else {
        const slayer = Object.keys(profile).reduce(
          (acc, slayer) => `${acc} | ${titleCase(slayer)}: ${slayerData[slayer].level} (${formatNumber(slayerData[slayer].xp)})`,
          ""
        );
        this.send(`${username}'s Slayer: ${slayer.slice(3)}`);
      }
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = SlayersCommand;
