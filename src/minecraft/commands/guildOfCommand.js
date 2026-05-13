const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const { formatNumber, formatError } = require("../../contracts/helperFunctions.js");

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
      const playerName = this.getArgs(message)[0] ? this.getArgs(message)[0] : player;

      if (playerName.match(/^[a-zA-Z0-9_]{3,16}$/) === null) {
        this.send(`Invalid player name: ${playerName}`);
        return;
      }

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
