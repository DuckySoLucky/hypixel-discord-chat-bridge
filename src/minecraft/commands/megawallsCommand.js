const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const { getUUID } = require("../../contracts/API/PlayerDBAPI.js");

class EightBallCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "megawalls";
    this.aliases = ["mw"];
    this.description = "View the Megawalls stats of a player";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false,
      },
    ];
  }

  async onCommand(username, message, channel = "gc") {
    try {
      username = this.getArgs(message)[0] || username;

      let uuid = await getUUID(username);
      const {
        stats: { megawalls },
      } = await hypixel.getPlayer(uuid);

      const { selectedClass = "None", finalKills, finalKDRatio, wins, WLRatio, kills, KDRatio, assists } = megawalls;

      this.send(
        `/${channel} ${username}'s Megawalls: Class: ${
          selectedClass ?? "None"
        } | FK: ${finalKills} | FKDR: ${finalKDRatio} | W: ${wins} | WLR: ${WLRatio} | K: ${kills} | KDR: ${KDRatio} | A: ${assists}`
      );
    } catch (error) {
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

module.exports = EightBallCommand;
