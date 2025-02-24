const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { uploadImage } = require("../../contracts/API/imgurAPI.js");
const { renderLore } = require("../../contracts/renderItem.js");
const { decodeData } = require("../../../API/utils/nbt.js");

class EquipmentCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
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

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    // CREDITS: by @Altpapier (https://github.com/Altpapier/hypixel-discord-guild-bridge/blob/master/ingameCommands/render.js)
    try {
      const args = this.getArgs(message);
      player = args[0] || player;

      const { username, profile } = await getLatestProfile(player);
      if (profile.inventory?.equipment_contents?.data === undefined) {
        return this.send(`This player has an Inventory API off.`);
      }

      const inventoryData = (await decodeData(Buffer.from(profile.inventory?.equipment_contents?.data, "base64"))).i;
      for (const piece of Object.values(inventoryData)) {
        if (piece?.tag?.display?.Name === undefined || piece?.tag?.display?.Lore === undefined) {
          continue;
        }

        const Name = piece?.tag?.display?.Name;
        const Lore = piece?.tag?.display?.Lore;

        const renderedItem = await renderLore(Name, Lore);
        if (renderedItem === null) {
          return this.send("An error occured while rendering the item.");
        }

        await uploadImage(renderedItem);
      }

      this.send(`${username}'s equipment has been rendered, check Discord for the images.`);
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = EquipmentCommand;
