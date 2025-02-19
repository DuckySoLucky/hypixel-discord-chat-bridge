const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
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
        required: false
      }
    ];
  }

  async onCommand(player, message) {
    try {
      // CREDITS: by @Kathund (https://github.com/Kathund)
      const args = this.getArgs(message);
      player = args[0] || player;

      const { username, garden } = await getLatestProfile(player, { garden: true });

      const gardenData = getGarden(garden);
      this.send(
        `${username}'s Garden ${gardenData.level.level} | Crop Milestones: Wheat: ${gardenData.cropMilesstone.wheat.level} | Carrot: ${gardenData.cropMilesstone.carrot.level} | Cane: ${gardenData.cropMilesstone.sugarCane.level} | Potato: ${gardenData.cropMilesstone.potato.level} | Wart: ${gardenData.cropMilesstone.netherWart.level} | Pumpkin: ${gardenData.cropMilesstone.pumpkin.level} | Melon: ${gardenData.cropMilesstone.melon.level} | Mushroom: ${gardenData.cropMilesstone.mushroom.level} | Cocoa: ${gardenData.cropMilesstone.cocoaBeans.level} | Cactus: ${gardenData.cropMilesstone.cactus.level}`
      );
    } catch (error) {
      console.log(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = GardenCommand;
