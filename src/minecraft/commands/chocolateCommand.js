const { formatNumber } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getChocolateFactory = require("../../../API/stats/chocolateFactory.js");
const { titleCase } = require("../../../API/constants/functions.js");

class ChocolateCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);
2
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

  async onCommand(player, message) {
    try {
      const args = this.getArgs(message);
      player = args[0] || player;

      const { username, profile, profileData } = await getLatestProfile(player);

      const chocolateFactory = getChocolateFactory(profile);

      if (chocolateFactory == null) {
        throw `${username} has never interacted with the Chocolate Factory on ${profileData.cute_name}.`;
      }

      const employes = Object.entries(chocolateFactory.employees)
        .map(([employee, amount]) => `${titleCase(employee)}: ${amount}`)
        .join(", ");

      this.send(
        `${username}'s Chocolate Prestige: ${chocolateFactory.level} | Chocolate: ${formatNumber(
          chocolateFactory.chocolate.current
        )} | Total Chocolate: ${formatNumber(chocolateFactory.chocolate.total)} | Employees: ${employes}`
      );
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = ChocolateCommand;
