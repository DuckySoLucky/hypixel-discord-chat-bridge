const { uploadImage } = require("../../contracts/API/imgurAPI.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
// @ts-ignore
const { get } = require("axios");

class DinosaurCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "dinosaur";
    this.aliases = ["dino"];
    this.description = "Random image of a dinosaur.";
    this.options = [];
  }

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    // CREDITS: by @Kathund (https://github.com/Kathund)
    try {
      const { data, status } = await get("https://imgs.kath.lol/dinosaur");
      if (status !== 200) {
        throw "An error occured while fetching the image. Please try again later.";
      }

      if (data?.url === undefined) {
        throw "An error occured while fetching the image. Please try again later.";
      }

      const buffer = await get(data.url, { responseType: "arraybuffer" });
      await uploadImage(buffer.data);

      this.send("Dinosaur image uploaded to Discord channel.");
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = DinosaurCommand;
