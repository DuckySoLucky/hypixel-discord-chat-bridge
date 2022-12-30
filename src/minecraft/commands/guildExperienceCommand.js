const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const config = require("../../../config.json");
const { addCommas } = require("../../contracts/helperFunctions.js");
const { getUUID } = require("../../contracts/API/PlayerDBAPI.js");

class GuildExperienceCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "guildexp";
    this.aliases = ["gexp"];
    this.description = "Guilds experience of specified user.";
    this.options = ["name"];
  }

  async onCommand(username, message) {
    const arg = this.getArgs(message);
    if (arg[0]) username = arg[0];

    try {
      const [uuid, guild] = await Promise.all([
        getUUID(username),
        hypixel.getGuild("id", config.minecraft.guildID),
      ]);

      const player = guild.members.find((member) => member.uuid == uuid)

      // eslint-disable-next-line no-throw-literal
      if (!player) throw "Player is not in the Guild.";

      this.send(`/gc ${username == arg[0] ? `${arg[0]}'s` : `Your`} Weekly Guild Experience » ${addCommas(player.weeklyExperience)}.`);


    } catch (error) {
      this.send(`/gc ${error.toString().replace("[hypixel-api-reborn] ", "")}`);
    }
  }
}

module.exports = GuildExperienceCommand;
