const { decodeData, formatUsername } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { uploadImage } = require("../../contracts/API/imgurAPI.js");
const { renderLore } = require("../../contracts/renderItem.js");
const { errorMessage } = require("../../Logger.js");

class RenderCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "render";
    this.aliases = ["inv", "i", "inventory", "i"];
    this.description = "Renders item of specified user.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false,
      },
      {
        name: "slot",
        description: "Slot number of item to render (1-36)",
        required: false,
      },
    ];
  }

  async onCommand(username, message) {
    try {
      let itemNumber = 0;
      const arg = this.getArgs(message);
      if (!arg[0]) {
        this.send("/gc Wrong Usage: !render [name] [slot] | !render [slot]");
      }
      if (!isNaN(Number(arg[0]))) {
        itemNumber = arg[0];
        username = arg[1] || username;
      } else {
        username = arg[0];
        if (!isNaN(Number(arg[1]))) {
          itemNumber = arg[1];
        } else {
          this.send("/gc Wrong Usage: !render [name] [slot] | !render [slot]");
          return;
        }
      }

      const profile = await getLatestProfile(username);

      username = formatUsername(username, profile.profileData?.game_mode);

      if (profile.profile.inventory?.inv_contents?.data === undefined) {
        // eslint-disable-next-line no-throw-literal
        throw `${username} has Inventory API off.`;
      }

      const { i: inventoryData } = await decodeData(
        Buffer.from(profile.profile.inventory?.inv_contents?.data, "base64"),
      );

      if (
        inventoryData[itemNumber - 1] === undefined ||
        Object.keys(inventoryData[itemNumber - 1] || {}).length === 0
      ) {
        return this.send(`/gc Player does not have an item at slot ${itemNumber}.`);
      }

      const Name = inventoryData[itemNumber - 1]?.tag?.display?.Name;
      const Lore = inventoryData[itemNumber - 1]?.tag?.display?.Lore;

      const renderedItem = await renderLore(Name, Lore);

      const upload = await uploadImage(renderedItem);

      imgurUrl = upload.data.link;
      this.send(`/gc ${username}'s item at slot ${itemNumber}: Check Discord Bridge for image.`);
    } catch (error) {
      errorMessage(error);
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}

module.exports = RenderCommand;
