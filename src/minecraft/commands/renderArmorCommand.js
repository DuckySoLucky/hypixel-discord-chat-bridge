const { decodeData, formatUsername } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { uploadImage } = require("../../contracts/API/imgurAPI.js");
const { renderLore } = require("../../contracts/renderItem.js");

class ArmorCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "armor";
    this.aliases = [];
    this.description = "Renders armor of specified user.";
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

      const profile = await getLatestProfile(username);

      username = formatUsername(username, profile.profileData?.game_mode);

      if (profile.profile.inv_armor?.data === undefined) {
        return this.send(`/gc This player has an Inventory API off.`);
      }

      const { i: inventoryData } = await decodeData(Buffer.from(profile.profile.inv_armor.data, "base64"));

      if (
        inventoryData === undefined ||
        inventoryData.filter((x) => JSON.stringify(x) === JSON.stringify({})).length === 4
      ) {
        return this.send(`/gc ${username} has no armor equipped.`);
      }

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

      this.send(`/gc ${username}'s Armor: ${response}`);
    } catch (error) {
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}

module.exports = ArmorCommand;
