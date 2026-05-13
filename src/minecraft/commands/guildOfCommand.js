const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const { formatNumber, formatError, titleCase } = require("../../contracts/helperFunctions.js");

// CREDITS: by @MattyHD0 (https://github.com/MattyHD0)

class GuildInformationCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "guildof";
    this.aliases = ["gof", "guildofplayer", "gop"];
    this.description = "View the player's guild";
    this.options = [
      {
        name: "player",
        description: "Player name",
        required: true
      }
    ];
  }

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    try {
      const playerName = this.getArgs(message)
        .map((arg) => titleCase(arg))
        .join(" ");

      const guild = await hypixel.getGuild("player", playerName, { noCaching: false });
      if (!guild) {
        return this.send(`Guild of ${playerName} not found.`);
      }

      this.send(
        `Guild of ${playerName} is ${guild.name} | Tag: [${guild.tag}] | Members: ${guild.members.length} | Level: ${guild.level} | Weekly GEXP: ${formatNumber(guild.totalWeeklyGexp)}`
      );
    } catch (error) {
      this.send(formatError(error));
    }
  }
}

module.exports = GuildInformationCommand;
