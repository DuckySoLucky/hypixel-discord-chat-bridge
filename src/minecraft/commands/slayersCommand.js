const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const getSlayer = require("../../../API/stats/slayer.js");
const { formatNumber, formatUsername } = require("../../contracts/helperFunctions.js");
const { capitalize } = require("lodash");

class SlayersCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "slayer";
    this.aliases = ["slayers"];
    this.description = "Slayer of specified user.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false,
      },
      {
        name: "slayer",
        description: "Slayer type",
        required: false,
      },
    ];
  }

  async onCommand(username, message) {
    try {
      const args = this.getArgs(message);
      const slayer = [
        "zombie",
        "rev",
        "spider",
        "tara",
        "wolf",
        "sven",
        "eman",
        "enderman",
        "blaze",
        "demonlord",
        "vamp",
        "vampire",
      ];

      const slayerType = slayer.includes(args[1]) ? args[1] : null;
      username = args[0] || username;

      const data = await getLatestProfile(username);

      username = formatUsername(username, data.profileData.cute_name);

      const profile = getSlayer(data.profile);

      if (slayerType) {
        this.send(
          `/gc ${username}'s ${capitalize(slayerType)} - ${
            profile[slayerType].level
          } Levels | Experience: ${formatNumber(profile[slayerType].xp)}`
        );
      } else {
        const slayer = Object.keys(profile).reduce(
          (acc, slayer) =>
            `${acc} | ${capitalize(slayer)}: ${profile[slayer].level} (${formatNumber(profile[slayer].xp)})`,
          ""
        );
        this.send(`/gc ${username}'s Slayer: ${slayer.slice(3)}`);
      }
    } catch (error) {
      this.send(`/gc Error: ${error}`);
    }
  }
}

module.exports = SlayersCommand;
