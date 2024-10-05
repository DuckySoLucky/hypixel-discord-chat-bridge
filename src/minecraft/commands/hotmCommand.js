const { formatNumber, formatUsername } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getHotm = require("../../../API/stats/hotm.js");

class HotmCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "hotm";
    this.aliases = ["mining"];
    this.description = "Skyblock Hotm Stats of specified user.";
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

      const data = await getLatestProfile(username);

      username = formatUsername(username, data.profileData?.game_mode);

      const hotm = getHotm(data.playerRes, data.profile);

      if (hotm == null) {
        // eslint-disable-next-line no-throw-literal
        throw `${username} has never gone to Dwarven Mines on ${data.profileData.cute_name}.`;
      }

      const level = (hotm.level.levelWithProgress || 0).toFixed(2);

      this.send(
        `/gc ${username}'s Hotm: ${level} | Gemstone Powder: ${formatNumber(
          hotm.powder.gemstone.total,
        )} | Mithril Powder: ${formatNumber(hotm.powder.mithril.total)} | Glacite Powder: ${formatNumber(
          hotm.powder.glacite.total,
        )} | Selected Ability: ${hotm.ability} | Commissions Milestone: ${
          hotm.commissions.milestone
        } (${hotm.commissions.total.toLocaleString()})`,
      );
    } catch (error) {
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}

module.exports = HotmCommand;
