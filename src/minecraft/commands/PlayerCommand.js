const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { formatNumber } = require("../../contracts/helperFunctions.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");

class PlayerCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "player";
    this.aliases = [];
    this.description = "Get Hypixel Player Stats";
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
      const { achievementPoints, nickname, rank, karma, level, guild } = await hypixel.getPlayer(username, {
        guild: true,
      });
      const guildName = guild ? guild.name : "None";

      this.send(
        `/gc ${rank !== "Default" ? `[${rank}] ` : ""}${nickname}'s level: ${level} | Karma: ${formatNumber(karma, 0)} Achievement Points: ${formatNumber(achievementPoints, 0)} Guild: ${guildName} `,
      );
    } catch (error) {
      console.log(error);

      this.send(`/gc [ERROR] ${error}`);
    }
  }
}

module.exports = PlayerCommand;
