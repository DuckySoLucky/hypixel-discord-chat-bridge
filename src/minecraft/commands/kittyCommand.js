const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { uploadImage } = require("../../contracts/API/imgurAPI.js");
// @ts-ignore
const { get } = require("axios");

class KittyCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "kitty";
    this.aliases = ["cat", "cutecat"];
    this.description = "Random image of cute cat.";
    this.options = [];
  }

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    try {
      const { data } = await get(`https://api.thecatapi.com/v1/images/search`);
      if (data === undefined) {
        throw "An error occured while fetching the image. Please try again later.";
      }

      if (data[0].url === undefined) {
        throw "An error occured while fetching the image. Please try again later.";
      }

      const buffer = await get(data[0].url, { responseType: "arraybuffer" });
      await uploadImage(buffer.data);

      this.send("Cat image uploaded to Discord channel.");
    } catch (error) {
      this.send(`[ERROR] ${error ?? "Something went wrong.."}`);
    }
  }
}

module.exports = KittyCommand;
