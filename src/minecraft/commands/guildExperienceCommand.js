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
      const [player, guild] = await Promise.all([
        getUUID(username),
        hypixel.getGuild("id", config.minecraft.guildID),
      ]);

      for (const member of guild.members) {
        if (guild.members.indexOf(member) == guild.members.length - 1) {
          return this.send(`/gc ${username} is not in the Guild.`);
        }

        if (member.uuid != player) continue;

        return this.send(
          `/gc ${
            username == arg[0] ? `${arg[0]}'s` : `Your`
          } Weekly Guild Experience » ${addCommas(member.weeklyExperience)}.`
        );
      }
    } catch (error) {
      console.log(error);
      this.send(
        "There is no player with the given UUID or name or player has never joined Hypixel."
      );
    }
  }
}

module.exports = GuildExperienceCommand;
