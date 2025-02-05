const { decodeData, formatUsername } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const { uploadImage } = require("../../contracts/API/imgurAPI.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { renderLore } = require("../../contracts/renderItem.js");

class EquipmentCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "equipment";
    this.aliases = [];
    this.description = "Renders equipment of specified user.";
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

      const profile = await getLatestProfile(username);

      username = formatUsername(username, profile.profileData?.game_mode);

      if (profile.profile.inventory?.equipment_contents?.data === undefined) {
        return this.send(`/gc This player has an Inventory API off.`);
      }

      const { i: inventoryData } = await decodeData(
        Buffer.from(profile.profile.inventory?.equipment_contents?.data, "base64")
      );

      let response = "";
      for (const piece of Object.values(inventoryData)) {
        if (piece?.tag?.display?.Name === undefined || piece?.tag?.display?.Lore === undefined) {
          continue;
        }

        const Name = piece?.tag?.display?.Name;
        const Lore = piece?.tag?.display?.Lore;

        const renderedItem = await renderLore(Name, Lore);

        const upload = await uploadImage(renderedItem);

        const link = upload.data.link;

        response += response.split(" | ").length == 4 ? link : `${link} | `;
      }

      imgurUrl = response;
      this.send(`/gc ${username}'s Equipment: Check Discord Bridge for image.`);
    } catch (error) {
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}

module.exports = EquipmentCommand;
