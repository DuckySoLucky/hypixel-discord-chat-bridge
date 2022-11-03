const minecraftCommand = require("../../contracts/MinecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const { capitalize } = require("../../contracts/helperFunctions.js");

class GuildInformationCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "guild";
    this.aliases = ["g"];
    this.description = "View information of a guild";
  }

  async onCommand(username, message) {
    try {
      const args = this.getArgs(message);
      const guildName = args.map((arg) => capitalize(arg)).join(" ");
      const guild = await hypixel.getGuild("name", guildName).catch((err) => {
        return this.send("/gc This guild does not exist.");
      });

      this.send(`/gc Guild ${guildName} | Tag: ${guild.tag} | Members: ${guild.members.length} | Level: ${guild.level} | Weekly GEXP: ${guild.totalWeeklyGexp}`);
    } catch (error) {
      console.log(error);
      this.send("/gc Something went wrong..");
    }
  }
}

module.exports = GuildInformationCommand;