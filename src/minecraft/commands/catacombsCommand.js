const { formatNumber } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getDungeons = require("../../../API/stats/dungeons.js");
const { toFixed } = require("../../../API/constants/functions.js");

class CatacombsCommand extends minecraftCommand {
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

  async onCommand(player, message) {
    try {
      const args = this.getArgs(message);
      player = args[0] || player;

      const { username, profile, profileData } = await getLatestProfile(player);

      const dungeons = getDungeons(profile);
      if (dungeons == null) {
        throw `${username} has never played dungeons on ${profileData.cute_name}.`;
      }

      const classes = Object.entries(dungeons.classes)
        .map(([key, value]) => `${toFixed(value.levelWithProgress, 2)}${key.at(0).toUpperCase()}`)
        .join(", ");

      this.send(
        `${username}'s Catacombs: ${toFixed(dungeons.dungeons.levelWithProgress, 2)} | Selected Class: ${
          dungeons.selectedClass
        } | Class Average: ${toFixed(dungeons.classAverage, 2)} | Secrets Found: ${formatNumber(dungeons.secretsFound)} | Classes: ${classes}`
      );
    } catch (error) {
      console.error(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = CatacombsCommand;
