// eslint-disable-next-line
const { ImgurClient } = require("imgur");
const {
  getLatestProfile,
} = require("../../../API/functions/getLatestProfile.js");
const config = require("../../../config.json");
const imgurClient = new ImgurClient({ clientId: config.api.imgurAPIkey });
const { decodeData, formatUsername } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { renderLore } = require("../../contracts/renderItem.js");

class EquipmentCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "equipment";
    this.aliases = [];
    this.description = "Renders equipment of specified user.";
    this.options = ["name"];
    this.optionsDescription = ["Minecraft Username"];
  }

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;

      const profile = await getLatestProfile(username);

      username = formatUsername(username, profile.profileData?.game_mode)

      if (!profile.profile.equippment_contents?.data) {
        return this.send(`/gc This player has an Inventory API off.`);
      }

      let response = "";
      const inventoryData = (await decodeData(Buffer.from(profile.profile.equippment_contents.data, "base64"))).i;
      for (const piece of Object.values(inventoryData)) {
        if (!piece?.tag?.display?.Name) continue;

        const renderedItem = await renderLore(
          piece?.tag?.display?.Name,
          piece?.tag?.display?.Lore
        );

        const upload = await imgurClient.upload({ image: renderedItem, type: "stream" });

        response += response.split(" | ").length == 4 ? upload.data.link : `${upload.data.link} | `;
      }

      response == "" ? this.send(`/gc ${username} has no equipment equiped.`) : this.send(`/gc ${username}'s Equipment » ${response}`);

    } catch (error) {
      this.send(`/gc Error: ${error}`)
    }
  }
}

module.exports = EquipmentCommand;
