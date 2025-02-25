const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { formatNumber } = require("../../contracts/helperFunctions.js");
const { getDojo } = require("../../../API/stats/crimson.js");

class DojoCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "dojo";
    this.aliases = [];
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

      const dojo = getDojo(profile);
      if (dojo == null) {
        throw `${username} has never gone to Crimson Isle on ${profileData.cute_name}.`;
      }

      this.send(
        `${username}'s Belt: ${dojo.belt} | Best Force: ${formatNumber(
          dojo.force.points
        )} | Best Stamina: ${formatNumber(dojo.stamina.points)} | Best Mastery: ${formatNumber(
          dojo.mastery.points
        )} | Best Discipline: ${formatNumber(dojo.discipline.points)} | Best Swiftness: ${formatNumber(
          dojo.swiftness.points
        )} | Best Control: ${formatNumber(dojo.control.points)} | Best Tenacity: ${formatNumber(dojo.tenacity.points)}`
      );
    } catch (error) {
      console.error(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = DojoCommand;
