const { formatNumber } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getDungeons = require("../../../API/stats/dungeons.js");

class EssenceCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "essence";
    this.aliases = [];
    this.description = "Skyblock Dungeons Stats of specified user.";
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

      const { username, profile } = await getLatestProfile(player);

      const essence = {
        diamond: profile.currencies?.essence?.DIAMOND?.current || 0,
        dragon: profile.currencies?.essence?.DRAGON?.current || 0,
        spider: profile.currencies?.essence?.SPIDER?.current || 0,
        wither: profile.currencies?.essence?.WITHER?.current || 0,
        undead: profile.currencies?.essence?.UNDEAD?.current || 0,
        gold: profile.currencies?.essence?.GOLD?.current || 0,
        ice: profile.currencies?.essence?.ICE?.current || 0,
        crimson: profile.currencies?.essence?.CRIMSON?.current || 0
      };
      this.send(
        `${username}'s Diamond Essence: ${formatNumber(essence.diamond, 0)} | Dragon: ${formatNumber(
          essence.dragon,
          0
        )} Spider: ${formatNumber(essence.spider, 0)} | Wither: ${formatNumber(essence.wither, 0)} | Undead: ${formatNumber(
          essence.undead,
          0
        )} | Gold: ${formatNumber(essence.gold, 0)} | Ice: ${formatNumber(essence.ice, 0)} | Crimson: ${formatNumber(
          essence.crimson,
          0
        )}`
      );
    } catch (error) {
      console.error(error);

      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = EssenceCommand;
