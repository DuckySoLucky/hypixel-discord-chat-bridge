const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { uploadImage } = require("../../contracts/API/imgurAPI.js");
// @ts-ignore
const { get } = require("axios");

class DuckCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "duck";
    this.aliases = ["ducky", "ducks", "duckysougly", "duckysolucky"];
    this.description = "Random image of a ducks.";
    this.options = [];
  }

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    // CREDITS: by @Kathund (https://github.com/Kathund)
    try {
      const { data, status } = await get("https://imgs.kath.lol/ducky");
      if (status !== 200) {
        throw "An error occured while fetching the image. Please try again later.";
      }

      if (data?.url === undefined) {
        throw "An error occured while fetching the image. Please try again later.";
      }

      await uploadImage(data.url, true);

      this.send("Duck image uploaded to Discord channel.");
    } catch (error) {
      this.send(`[ERROR] ${error ?? "Something went wrong.."}`);
    }
  }
}

module.exports = DuckCommand;
