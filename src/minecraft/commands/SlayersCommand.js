const minecraftCommand = require("../../contracts/minecraftCommand.js");
const {
  getLatestProfile,
} = require("../../../API/functions/getLatestProfile.js");
const getSlayer = require("../../../API/stats/slayer.js");
const { addCommas, formatUsername } = require("../../contracts/helperFunctions.js");
const { capitalize } = require("lodash");

class SlayersCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "slayer";
    this.aliases = ["slayers"];
    this.description = "Slayer of specified user.";
    this.options = ["name", "type"];
    this.optionsDescription = ["Minecraft Username", "Type of Slayer"];
  }

  async onCommand(username, message) {
    try {
      const args = this.getArgs(message);
      const slayer = ["zombie", "rev", "spider", "tara", "wolf", "sven", "eman", "enderman", "blaze", "demonlord"];

      const slayerType = slayer.includes(args[1]) ? args[1] : null;
      username = args[0] || username;

      const data = await getLatestProfile(username);
    
      username = formatUsername(username, data.profileData.cute_name);

      const profile = getSlayer(data.profile);

      if (slayerType) {
        this.send(`/gc ${username}'s ${capitalize(slayerType)} - ${profile[slayerType].level} Levels | Experience: ${addCommas(profile[slayerType].xp)}`);
      } else {
        const slayer = Object.keys(profile).reduce((acc, slayer) => `${acc} | ${capitalize(slayer)}: Level: ${profile[slayer].level} | Experience: ${addCommas(profile[slayer].xp)}`, "");
        this.send(`/gc ${username}'s Slayer - ${slayer}`);
      }
      
    } catch (error) {
      this.send(`/gc Error: ${error}`);
    }
  }
}

module.exports = SlayersCommand;
