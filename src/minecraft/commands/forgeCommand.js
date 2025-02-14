const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getHotm = require("../../../API/stats/hotm.js");

class ForgeCommand extends minecraftCommand {
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

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;

      const data = await getLatestProfile(username);
      username = formatUsername(username, data.profileData?.game_mode);

      const hotm = getHotm(data.profile);

      if (hotm == null) {
        // eslint-disable-next-line no-throw-literal
        throw `${username} has never gone to Dwarven Mines on ${data.profileData.cute_name}.`;
      }

      if (hotm.forge.length === 0 || hotm.forge == null) {
        // eslint-disable-next-line no-throw-literal
        throw `${username} has no items in their forge.`;
      }

      const forgeItems = hotm.forge.map((item) => {
        return `${item.slot}: ${item.name} ${item.timeFinishedText}`;
      });
      this.send(`${username}'s Forge: ${forgeItems.join(" | ")}`);
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = ForgeCommand;
