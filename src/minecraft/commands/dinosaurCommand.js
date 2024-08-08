const minecraftCommand = require("../../contracts/minecraftCommand.js");
const axios = require("axios");

class DinosaurCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "dinosaur";
    this.aliases = ["dino"];
    this.description = "Random image of a dinosaur.";
    this.options = [];
  }

  async onCommand(username, message, officer) {
    // CREDITS: by @Kathund (https://github.com/Kathund)
    try {
      const { data, status } = await axios.get("https://imgs.kath.lol/dinosaur");
      if (status !== 200) {
        // eslint-disable-next-line no-throw-literal
        throw "An error occured while fetching the image. Please try again later.";
      }

      if (data === undefined) {
        // eslint-disable-next-line no-throw-literal
        throw "An error occured while fetching the image. Please try again later.";
      }

      this.send(`Funny dino: ${data.url}`, officer);
    } catch (error) {
      this.send(`[ERROR] ${error}`, officer);
    }
  }
}

module.exports = DinosaurCommand;
