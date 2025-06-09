const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { uploadImage } = require("../../contracts/API/imgurAPI.js");
// @ts-ignore
const { get } = require("axios");

class PicketCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "picket";
    this.aliases = ["soupybunny", "bestrabbit"];
    this.description = "Random image of picket.";
    this.options = [];
  }

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    // CREDITS: by @Kathund (https://github.com/Kathund)
    try {
      const { data, status } = await get("https://imgs.kath.lol/picket");
      if (status !== 200) {
        throw "An error occured while fetching the image. Please try again later.";
      }

      if (data?.url === undefined) {
        throw "An error occured while fetching the image. Please try again later.";
      }

      await uploadImage(data.url, true);

      this.send("Picket image uploaded to Discord channel.");
    } catch (error) {
      this.send(`[ERROR] ${error ?? "Something went wrong.."}`);
    }
  }
}

module.exports = PicketCommand;
