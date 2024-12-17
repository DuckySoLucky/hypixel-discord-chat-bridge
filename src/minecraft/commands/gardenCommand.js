const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getGarden = require("../../../API/stats/garden.js");

class GardenCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "garden";
    this.aliases = [];
    this.description = "Skyblock Garden Stats of specified user.";
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
      // CREDITS: by @Kathund (https://github.com/Kathund)
      username = this.getArgs(message)[0] || username;

      const data = await getLatestProfile(username, { garden: true });
      username = formatUsername(username, data.profileData?.game_mode);
      const garden = getGarden(data.garden);

      this.send(
        `${username}'s garden ${garden.level.level} | Crop Milestones: Wheat: ${garden.cropMilesstone.wheat.level} | Carrot: ${garden.cropMilesstone.carrot.level} | Cane: ${garden.cropMilesstone.sugarCane.level} | Potato: ${garden.cropMilesstone.potato.level} | Wart: ${garden.cropMilesstone.netherWart.level} | Pumpkin: ${garden.cropMilesstone.pumpkin.level} | Melon: ${garden.cropMilesstone.melon.level} | Mushroom: ${garden.cropMilesstone.mushroom.level} | Cocoa: ${garden.cropMilesstone.cocoaBeans.level} | Cactus: ${garden.cropMilesstone.cactus.level}`,
      );
    } catch (error) {
      console.log(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = GardenCommand;
