const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { formatNumber } = require("../../contracts/helperFunctions.js");
const { getDungeons } = require("../../../API/stats/dungeons.js");

class CatacombsCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "catacombs";
    this.aliases = ["cata", "dungeons"];
    this.description = "Skyblock Dungeons Stats of specified user.";
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

      const dungeons = getDungeons(profile);
      if (dungeons === null) {
        throw `${username} has never played dungeons on ${profileData.cute_name}.`;
      }

      const classes = Object.entries(dungeons.classes)
        .map(([key, value]) => `${formatNumber(value.levelWithProgress)}${key.at(0)?.toUpperCase()}`)
        .join(", ");

      this.send(
        `${username}'s Catacombs: ${formatNumber(dungeons.dungeons.levelWithProgress)} | Selected Class: ${
          dungeons.selectedClass
        } | Class Average: ${formatNumber(dungeons.classAverage)} | Secrets Found: ${formatNumber(dungeons.secretsFound)} | Classes: ${classes}`
      );
    } catch (error) {
      console.error(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = CatacombsCommand;
