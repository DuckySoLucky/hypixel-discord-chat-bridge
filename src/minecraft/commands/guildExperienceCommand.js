const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const { getUUID } = require("../../contracts/API/PlayerDBAPI.js");

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
        required: false,
      },
    ];
  }

  async onCommand(username, message, channel = "gc") {
    username = this.getArgs(message)[0] || username;

    try {
      const uuid = await getUUID(username);
      const guild = await hypixel.getGuild("player", uuid);

      const player = guild.members.find((member) => member.uuid == uuid);

      if (player === undefined) {
        // eslint-disable-next-line no-throw-literal
        throw "Player is not in the Guild.";
      }

      this.send(`/${channel} ${username}'s Weekly Guild Experience: ${player.weeklyExperience.toLocaleString()}.`);
    } catch (error) {
      console.log(error)
      this.send(
        `/${channel} ${error
          .toString()
          .replace("[hypixel-api-reborn] ", "")
          .replace("For help join our Discord Server https://discord.gg/NSEBNMM", "")
          .replace("Error:", "[ERROR]")}`
      );
    }
  }
}

module.exports = GuildExperienceCommand;
