const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const getGifts = require("../../../API/stats/gifts.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");

class GiftsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "gifts";
    this.aliases = ["gift"];
    this.description = "Gifts given and received by a specified user.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false,
      },
    ];
  }

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;

      const data = await getLatestProfile(username);
      
      username = formatUsername(username, data.profileData?.game_mode);
      
      const gifts = getGifts(data.profile, true);
      
      const giftsGiven = gifts.given || 0;
      const giftsReceived = gifts.received || 0;

      this.send(`/gc ${username}'s Gifts: Given ${giftsGiven} Received: ${giftsReceived}`);
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = GiftsCommand;
