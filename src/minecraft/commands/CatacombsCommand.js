const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getDungeons = require("../../../API/stats/dungeons.js");
const { numberWithCommas, formatUsername } = require("../../contracts/helperFunctions.js");
const {
  getLatestProfile,
} = require("../../../API/functions/getLatestProfile.js");

class CatacombsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "catacombs";
    this.aliases = ["cata", "dungeons"];
    this.description = "Skyblock Dungeons Stats of specified user.";
    this.options = ["name"];
    this.optionsDescription = ["Minecraft Username"];
  }

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;

      const data = await getLatestProfile(username);

      username = formatUsername(username, data.profileData?.game_mode);

      const dungeons = getDungeons(data.player, data.profile);

      if (dungeons == null) {
        // eslint-disable-next-line no-throw-literal
        throw `${username} has never played dungeons on ${data.profileData.cute_name}.`
      }

      const completions = Object.values(dungeons.catacombs.MASTER_MODE_FLOORS).map(
        (floor) => floor.completions
      ).reduce((a, b) => a + b, 0) + Object.values(dungeons.catacombs.floors).map(
        (floor) => floor.completions
      ).reduce((a, b) => a + b, 0);

      this.send(
        `/gc ${username}'s Catacombs: ${
          dungeons.catacombs.skill.level > 50 ? dungeons.catacombs.skill.levelWithProgress.toFixed(2) : dungeons.catacombs.skill.level
        } | Class Average: ${
          (Object.keys(dungeons.classes).map((className) => dungeons.classes[className].level).reduce((a, b) => a + b, 0) / Object.keys(dungeons.classes).length)
        } | Secrets Found: ${numberWithCommas(
          dungeons.secrets_found || 0
        )} (${
          (dungeons.secrets_found / completions).toFixed(2)
        } SPR) | Classes: H - ${dungeons.classes.healer.level} M - ${
          dungeons.classes.mage.level
        } B - ${dungeons.classes.berserk.level} A - ${
          dungeons.classes.archer.level
        } T - ${dungeons.classes.tank.level}`
      );
    } catch (error) {
      console.log(error)

      this.send(
        `/gc Error: ${error}`
      );
    }
  }
}

module.exports = CatacombsCommand;
