const { formatNumber, formatError } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");

class PlayerCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "player";
    this.aliases = [];
    this.description = "Get Hypixel Player Stats";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false
      }
    ];
  }

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    try {
      // CREDITS: by @Kathund (https://github.com/Kathund)
      player = this.getArgs(message)[0] || player;
      const { achievementPoints, nickname, rank, karma, level, guild } = await hypixel.getPlayer(player, {
        guild: true
      });

      const guildName = guild ? guild.name : "None";

      this.send(
        `${rank !== "Default" ? `[${rank}] ` : ""}${nickname}'s level: ${level} | Karma: ${formatNumber(karma, 0)} | Achievement Points: ${formatNumber(achievementPoints, 0)} Guild: ${guildName}`
      );
    } catch (error) {
      console.error(error);
      this.send(formatError(error));
    }
  }
}

module.exports = PlayerCommand;
