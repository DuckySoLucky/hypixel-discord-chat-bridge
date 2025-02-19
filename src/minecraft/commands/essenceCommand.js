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

      const { username, profile, profileData } = await getLatestProfile(player);

      const dungeons = getDungeons(profile);
      if (dungeons == null) {
        throw `${username} has never played dungeons on ${profileData.cute_name}.`;
      }

      this.send(
        `${username}'s Diamond Essence: ${formatNumber(dungeons.essence.diamond, 0)} | Dragon: ${formatNumber(
          dungeons.essence.dragon,
          0
        )} Spider: ${formatNumber(dungeons.essence.spider, 0)} | Wither: ${formatNumber(
          dungeons.essence.wither,
          0
        )} | Undead: ${formatNumber(dungeons.essence.undead, 0)} | Gold: ${formatNumber(
          dungeons.essence.gold,
          0
        )} | Ice: ${formatNumber(dungeons.essence.ice, 0)} | Crimson: ${formatNumber(dungeons.essence.crimson, 0)}`
      );
    } catch (error) {
      console.error(error);

      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = EssenceCommand;
