const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const config = require("../../../config.json");
const axios = require("axios");

class DenickerCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "winstreak";
    this.aliases = ["ws"];
    this.description = "Estimated winstreaks of the specified user.";
    this.options = ["name"];
    this.optionsDescription = ["Minecraft Username"];
  }

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;

      const [player, response] = await Promise.all([
        hypixel.getPlayer(username),
        axios.get(
          `${config.api.antiSniperAPI}/winstreak?key=${config.api.antiSniperKey}&name=${username}`
        ),
      ]);

      this.send(
        `/gc [${player.stats.bedwars.level}✫] ${player.nickname}: Accurrate » ${
          response.data.player.accurate ? "Yes" : "No"
        } | Overall » ${response.data.player.data.overall_winstreak} | Solo » ${
          response.data.player.data.eight_one_winstreak
        } | Doubles » ${
          response.data.player.data.eight_two_winstreak
        } | Trios » ${
          response.data.player.data.four_three_winstreak
        } | Fours » ${response.data.player.data.four_four_winstreak} | 4v4  » ${
          response.data.player.data.two_four_winstreak
        }`
      );
    } catch (error) {
      if (error.player == null) {
        this.send("/gc Error: This player does not exist in AntiSniper database.");
      } else {
        this.send(`/gc Error: ${error?.response?.data?.error}`);
      }
    }
  }
}

module.exports = DenickerCommand;
