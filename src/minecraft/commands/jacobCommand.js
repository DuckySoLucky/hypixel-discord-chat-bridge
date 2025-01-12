const { formatUsername, formatNumber } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getJacob = require("../../../API/stats/jacob.js");

class JacobCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "jacob";
    this.aliases = ["jacobs", "jacobcontest", "contest"];
    this.description = "Jacob's Contest Stats of specified user.";
    this.options = [];
  }

  async onCommand(username, message) {
    try {
      // CREDITS: by @Kathund (https://github.com/Kathund)
      username = this.getArgs(message)[0] || username;

      const data = await getLatestProfile(username);
      username = formatUsername(username, data.profileData?.game_mode);
      const profile = getJacob(data.profile);

      this.send(
        `${username}'s Gold Medals: ${profile.medals.gold} | Silver: ${profile.medals.silver} | Bronze: ${profile.medals.bronze} | Double Drops ${profile.perks.doubleDrops} / 15 | Level Cap: ${profile.perks.levelCap} / 10`,
      );

      await delay(250);
      this.send(
        `Best NW: ${formatNumber(profile.personalBests.netherWart, 0)} | Cocoa: ${formatNumber(
          profile.personalBests.cocoBeans,
          0,
        )} | Mushroom: ${formatNumber(profile.personalBests.mushroom, 0)} | Wheat: ${formatNumber(
          profile.personalBests.wheat,
          0,
        )} | Potato: ${formatNumber(profile.personalBests.potato, 0)} | Pumpkin: ${formatNumber(
          profile.personalBests.pumpkin,
          0,
        )} | Best Carrot: ${formatNumber(profile.personalBests.carrot, 0)} | Cactus: ${formatNumber(
          profile.personalBests.cactus,
          0,
        )} | Melon: ${formatNumber(profile.personalBests.melon, 0)} | Cane: ${formatNumber(
          profile.personalBests.sugarCane,
          0,
        )}`,
      );
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = JacobCommand;
