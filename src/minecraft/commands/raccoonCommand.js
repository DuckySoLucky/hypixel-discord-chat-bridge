const minecraftCommand = require("../../contracts/minecraftCommand.js");
const axios = require("axios");

class RaccoonCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "raccoon";
    this.aliases = ["raccn", "soupy", "soupyraccn"];
    this.description = "Random image of a raccoon.";
    this.options = [];
  }

  async onCommand(username, message) {
    // CREDITS: by @Kathund (https://github.com/Kathund)
    try {
      const { data, status } = await axios.get("https://imgs.kath.lol/raccoon");
      if (status !== 200) {
        throw "An error occured while fetching the image. Please try again later.";
      }

      if (data === undefined) {
        throw "An error occured while fetching the image. Please try again later.";
      }

      imgurUrl = data.url;
      this.send("Funny Raccoon: Check Discord Bridge for image.");
    } catch (error) {
      this.send(`[ERROR] ${error ?? "Something went wrong.."}`);
    }
  }
}

module.exports = RaccoonCommand;
