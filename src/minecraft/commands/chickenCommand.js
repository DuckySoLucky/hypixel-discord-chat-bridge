const minecraftCommand = require("../../contracts/minecraftCommand.js");
const axios = require("axios");

class ChickenCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "chicken";
    this.aliases = ["chickens", "lockjaw"];
    this.description = "Random image of a chickens.";
    this.options = [];
  }

  async onCommand(username, message) {
    // CREDITS: by @Kathund (https://github.com/Kathund)
    try {
      const { data, status } = await axios.get("https://imgs.kath.lol/chicken");
      if (status !== 200) {
        // eslint-disable-next-line no-throw-literal
        throw "An error occured while fetching the image. Please try again later.";
      }

      if (data === undefined) {
        // eslint-disable-next-line no-throw-literal
        throw "An error occured while fetching the image. Please try again later.";
      }

      this.send(`/gc Funny Chicken: ${data.url}`);
    } catch (error) {
      this.send(`/gc [ERROR] ${error ?? "Something went wrong.."}`);
    }
  }
}

module.exports = ChickenCommand;
