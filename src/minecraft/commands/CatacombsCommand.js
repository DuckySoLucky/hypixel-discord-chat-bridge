const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getDungeons = require("../../../API/stats/dungeons.js");
const { numberWithCommas } = require("../../contracts/helperFunctions.js");
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
      const arg = this.getArgs(message);
      if (arg[0]) username = arg[0];
      const data = await getLatestProfile(username);
      username = data.profileData?.game_mode ? `♲ ${username}` : username;
      const dungeons = getDungeons(data.player, data.profile);
      this.send(
        `/gc ${username}'s Catacombs: ${
          dungeons.catacombs.skill.level
        } ᐧᐧᐧᐧ Class Average: ${
          (dungeons.classes.healer.level +
            dungeons.classes.mage.level +
            dungeons.classes.berserk.level +
            dungeons.classes.archer.level +
            dungeons.classes.tank.level) /
          5
        } ᐧᐧᐧᐧ Secrets Found: ${numberWithCommas(dungeons.secrets_found || 0)} ᐧᐧᐧᐧ Classes:  H-${
          dungeons.classes.healer.level
        }  M-${dungeons.classes.mage.level}  B-${
          dungeons.classes.berserk.level
        }  A-${dungeons.classes.archer.level}  T-${dungeons.classes.tank.level}`
      );
    } catch (error) {
      this.send(
        "/gc There is no player with the given UUID or name or the player has no Skyblock profiles"
      );
    }
  }
}

module.exports = CatacombsCommand;
