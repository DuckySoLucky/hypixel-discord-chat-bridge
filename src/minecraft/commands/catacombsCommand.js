const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getDungeons = require("../../../API/stats/dungeons.js");
const { formatNumber, formatUsername } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");

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
        required: false,
      },
    ];
  }

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;

      const data = await getLatestProfile(username);

      username = formatUsername(username, data.profileData?.game_mode);

      const dungeons = getDungeons(data.player, data.profile);

      if (dungeons == null) {
        // eslint-disable-next-line no-throw-literal
        throw `${username} has never played dungeons on ${data.profileData.cute_name}.`;
      }

      const completions = Object.values(dungeons.catacombs)
        .flatMap((floors) => Object.values(floors))
        .reduce((total, floor) => total + (floor.completions || 0), 0);

      const level = dungeons.catacombs.skill.levelWithProgress.toFixed(1);
      const classAvrg =
        Object.values(dungeons.classes).reduce((total, { levelWithProgress }) => total + levelWithProgress, 0) /
        Object.keys(dungeons.classes).length;

      this.send(
        `/gc ${username}'s Catacombs: ${level} | Class Average: ${classAvrg.toFixed(1)} (${
          dungeons.classes.healer.level
        }H, ${dungeons.classes.mage.level}M, ${dungeons.classes.berserk.level}B, ${dungeons.classes.archer.level}A, ${
          dungeons.classes.tank.level
        }T) | Secrets: ${formatNumber(dungeons.secrets_found ?? 0, 1)} (${(
          dungeons.secrets_found / completions
        ).toFixed(1)} S/R)`
      );
    } catch (error) {
      console.log(error);

      this.send(`/gc Error: ${error}`);
    }
  }
}

module.exports = CatacombsCommand;
