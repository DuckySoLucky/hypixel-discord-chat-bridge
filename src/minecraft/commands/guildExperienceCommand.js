const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const { getUUID } = require("../../contracts/API/mowojangAPI.js");
const { formatError } = require("../../contracts/helperFunctions.js");

class GuildExperienceCommand extends minecraftCommand {
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

  async onCommand(username, message) {
    username = this.getArgs(message)[0] || username;

    try {
      const [uuid, guild] = await Promise.all([getUUID(username), hypixel.getGuild("player", username)]);

      const player = guild.members.find((member) => member.uuid == uuid);

      if (player === undefined) {
        throw "Player is not in the Guild.";
      }

      this.send(`${username}'s Weekly Guild Experience: ${player.weeklyExperience.toLocaleString()}.`);
    } catch (error) {
      this.send(formatError(error));
    }
  }
}

module.exports = GuildExperienceCommand;
