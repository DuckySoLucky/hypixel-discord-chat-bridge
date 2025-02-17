const { formatUsername, addNotation } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getChocolateFactory = require("../../../API/stats/chocolateFactory.js");

class ChocolateCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "chocolatefactory";
    this.aliases = ["cf", "factory", "chocolate"];
    this.description = "Skyblock Chocolate Factory Stats of specified user.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false
      }
    ];
  }

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;

      const data = await getLatestProfile(username);

      username = formatUsername(username, data.profileData?.game_mode);

      const chocolateFactory = getChocolateFactory(data.profile);

      if (chocolateFactory == null) {
        // eslint-disable-next-line no-throw-literal
        throw `${username} has never interacted with the Chocolate Factory on ${data.profileData.cute_name}.`;
      }

      this.send(
        `${username}'s Chocolate Factory: ${chocolateFactory.level} | Chocolate: ${addNotation(
          "oneLetters",
          chocolateFactory.chocolate.current
        )} | Total Chocolate: ${addNotation("oneLetters", chocolateFactory.chocolate.total)} | Employees: Bro: ${
          chocolateFactory.employees.bro
        } | Cousin: ${chocolateFactory.employees.cousin} | Sis: ${chocolateFactory.employees.sis} | Father: ${
          chocolateFactory.employees.father
        } | Grandma: ${chocolateFactory.employees.grandma}`
      );
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = ChocolateCommand;
