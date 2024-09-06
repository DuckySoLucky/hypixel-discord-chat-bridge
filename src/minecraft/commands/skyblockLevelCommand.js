const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");

class CatacombsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "level";
    this.aliases = ["lvl"];
    this.description = "Skyblock Level of specified user.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false,
      },
    ];
  }

  async onCommand(username, message, officer) {
    try {
      username = this.getArgs(message)[0] || username;

      const data = await getLatestProfile(username);

      username = formatUsername(username, data.profileData?.game_mode);

      const experience = data.profile.leveling?.experience ?? 0;
      this.send(`${username}'s Skyblock Level: ${experience ? experience / 100 : 0}`, officer);
    } catch (error) {
      console.log(error);

      this.send(`[ERROR] ${error}`, officer);
    }
  }
}

module.exports = CatacombsCommand;
