const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { uploadImage } = require("../../contracts/API/imgurAPI.js");
const { renderLore } = require("../../contracts/renderItem.js");
const { decodeData } = require("../../../API/utils/nbt.js");

class RenderCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "render";
    this.aliases = ["inv", "i", "inventory", "i"];
    this.description = "Renders item of specified user.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false
      },
      {
        name: "slot",
        description: "Slot number of item to render (1-36)",
        required: false
      }
    ];
  }

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    // CREDITS: by @Altpapier (https://github.com/Altpapier/hypixel-discord-guild-bridge/blob/master/ingameCommands/render.js)
    try {
      let itemNumber = 0;
      const arg = this.getArgs(message);
      if (!arg[0]) {
        return this.send("Wrong Usage: !render [name] [slot]");
      }
      if (!isNaN(Number(arg[0]))) {
        itemNumber = parseInt(arg[0]);
        player = arg[1] || player;
      } else {
        player = arg[0];
        if (!isNaN(Number(arg[1]))) {
          itemNumber = parseInt(arg[1]);
        } else {
          return this.send("Wrong Usage: !render [name] [slot]");
        }
      }

      const { profile, username } = await getLatestProfile(player);
      if (profile.inventory?.inv_contents?.data === undefined) {
        throw `${username} has Inventory API off.`;
      }

      const inventoryData = (await decodeData(Buffer.from(profile.inventory?.inv_contents?.data, "base64"))).i;
      const item = inventoryData[itemNumber - 1];
      if (item === undefined) {
        return this.send(`Player does not have an item at slot ${itemNumber}.`);
      }

      const renderedItem = await renderLore(item.tag.display.Name, item.tag.display.Lore);
      if (renderedItem === null) {
        return this.send(`Item at slot ${itemNumber} is not renderable.`);
      }

      await uploadImage(renderedItem);

      this.send(`${username}'s item at slot ${itemNumber} can be found in Discord Channel.`);
    } catch (error) {
      console.error(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = RenderCommand;
