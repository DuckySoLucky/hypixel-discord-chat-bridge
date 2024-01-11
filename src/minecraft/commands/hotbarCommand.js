// eslint-disable-next-line
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const config = require("../../../config.json");
const { decodeData, formatUsername } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");

class RenderCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "hotbar";
    this.aliases = ["hb"];
    this.description = "Shows hotbar of specified user.";
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
      const arg = this.getArgs(message);
      let required_ign = arg[0] || username;

      const profile = await getLatestProfile(required_ign);

      required_ign = formatUsername(required_ign, profile.profileData?.game_mode);

      if (!profile.profile.inv_contents?.data) {
        return this.send(`/${channel} This player has an Inventory API off.`);
      }

      const inventoryData = (await decodeData(Buffer.from(profile.profile.inv_contents.data, "base64"))).i;

      let inventory = `${required_ign}'s inventory:`;
      let inventory2 = ``;

      for (let x = 0; x < 8; x++) {
        let current_item = "";
        if (!inventoryData[x] || !Object.keys(inventoryData[x] || {}).length) {
          current_item = ` [${x + 1}] Empty`;
        } else {
          let proper_name = (inventoryData[x]?.tag?.display?.Name).replace(/§./g, "");
          current_item += ` [${x + 1}] ${proper_name}`;
        }

        if (x > 2) {
          inventory2 += current_item;
          continue;
        }
        inventory += current_item;
      }

      this.send(`/${channel} ${inventory}`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      this.send(`/${channel} ${inventory2}`);
    } catch (error) {
      this.send(`/${channel} Error: ${error}`);
    }
  }
}

module.exports = RenderCommand;
