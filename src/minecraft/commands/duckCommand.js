const minecraftCommand = require("../../contracts/minecraftCommand.js");
const axios = require("axios");

class DuckCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "duck";
    this.aliases = ["ducky", "ducks", "duckysougly", "duckysolucky"];
    this.description = "Random image of a ducks.";
    this.options = [];
  }

  async onCommand(username, message) {
    // CREDITS: by @Kathund (https://github.com/Kathund)
    try {
      const { data, status } = await axios.get("https://imgs.kath.lol/ducky");
      if (status !== 200) {
        // eslint-disable-next-line no-throw-literal
        throw "An error occured while fetching the image. Please try again later.";
      }

      if (data === undefined) {
        // eslint-disable-next-line no-throw-literal
        throw "An error occured while fetching the image. Please try again later.";
      }

      imgurUrl = data.url;
      this.send("Funny Duck: Check Discord Bridge for image.");
    } catch (error) {
      this.send(`[ERROR] ${error ?? "Something went wrong.."}`);
    }
  }
}

module.exports = DuckCommand;
