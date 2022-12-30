const minecraftCommand = require("../../contracts/minecraftCommand.js");
const {
  getLatestProfile,
} = require("../../../API/functions/getLatestProfile.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");

class FairySoulsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "fairysouls";
    this.aliases = ["fs"];
    this.description = "Fairy Souls of specified user.";
    this.options = ["name"];
    this.optionsDescription = ["Minecraft Username"];
  }

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;

      const data = await getLatestProfile(username);
      username = formatUsername(username, data.profileData.game_mode);
      
      const total = data.profileData.game_mode === "island" ? 5 : 238;

      this.send(`/gc ${username}'s Fairy Souls: ${data.profile.fairy_souls_collected}/${total} | Progress: ${(data.profile.fairy_souls_collected / total * 100).toFixed(2)}%`);
    
    } catch (error) {
      this.send(`/gc Error: ${error}`);

    }
  }
}

module.exports = FairySoulsCommand;
