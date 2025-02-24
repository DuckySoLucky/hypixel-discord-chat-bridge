const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { formatError } = require("../../contracts/helperFunctions.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const { getUUID } = require("../../contracts/API/mowojangAPI.js");

class GuildExperienceCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "guildexp";
    this.aliases = ["gexp"];
    this.description = "Guilds experience of specified user.";
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
    player = this.getArgs(message)[0] || player;

    try {
      const [uuid, guild] = await Promise.all([getUUID(player), hypixel.getGuild("player", player, { noCaching: false })]);

      /** @type {import('hypixel-api-reborn').Guild['members']} */
      const guildMembers = guild.members;

      const member = guildMembers.find((member) => member.uuid == uuid);

      if (member === undefined) {
        throw "Player is not in the Guild.";
      }

      this.send(`${player}'s Weekly Guild Experience: ${member.weeklyExperience.toLocaleString()}.`);
    } catch (error) {
      this.send(formatError(error));
    }
  }
}

module.exports = GuildExperienceCommand;
