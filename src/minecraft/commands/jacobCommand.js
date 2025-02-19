const { formatNumber } = require("../../contracts/helperFunctions.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getJacob = require("../../../API/stats/jacob.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");

class JacobCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "jacob";
    this.aliases = ["jacobs", "jacobcontest", "contest"];
    this.description = "Jacob's Contest Stats of specified user.";
    this.options = [];
  }

  async onCommand(player, message) {
    try {
      // CREDITS: by @Kathund (https://github.com/Kathund)
      const args = this.getArgs(message);
      player = args[0] || player;

      const { username, profile } = await getLatestProfile(player);

      const jacobData = getJacob(profile);

      this.send(
        `${username}'s Gold Medals: ${jacobData.medals.gold} | Silver: ${jacobData.medals.silver} | Bronze: ${jacobData.medals.bronze} | Double Drops ${jacobData.perks.doubleDrops} / 15 | Level Cap: ${jacobData.perks.levelCap} / 10`
      );

      await delay(1000);
      this.send(
        `Best NW: ${formatNumber(jacobData.personalBests.netherWart, 0)} | Cocoa: ${formatNumber(
          jacobData.personalBests.cocoBeans,
          0
        )} | Mushroom: ${formatNumber(jacobData.personalBests.mushroom, 0)} | Wheat: ${formatNumber(
          jacobData.personalBests.wheat,
          0
        )} | Potato: ${formatNumber(jacobData.personalBests.potato, 0)} | Pumpkin: ${formatNumber(
          jacobData.personalBests.pumpkin,
          0
        )} | Best Carrot: ${formatNumber(jacobData.personalBests.carrot, 0)} | Cactus: ${formatNumber(
          jacobData.personalBests.cactus,
          0
        )} | Melon: ${formatNumber(jacobData.personalBests.melon, 0)} | Cane: ${formatNumber(
          jacobData.personalBests.sugarCane,
          0
        )}`
      );
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = JacobCommand;
