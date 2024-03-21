const minecraftCommand = require("../../contracts/minecraftCommand.js");
const axios = require("axios");
const config = require("../../../config.json"); // Assuming the config file is in the root directory

class NarwhalCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "narwhal";
    this.aliases = ["narwhals", "narwhalpic", "narwhalimage","shedinja", "shedinjaCrits"];
    this.description = "Random image of a narwhal.";
    this.options = [];
  }

  async onCommand(username, message) {
    try {
      const { data, status } = await axios.get(`https://api.imgur.com/3/gallery/search?q=narwhal`, {
        headers: {
          'Authorization': `Client-ID ${config.minecraft.API.imgurAPIkey}`
        }
      });

      if (status !== 200) {
        throw "An error occurred while fetching the image. Please try again later.";
      }

      if (data === undefined || data.data.length === 0) {
        throw "No narwhal images found.";
      }

      // Get a random image from the results
      const image = data.data[Math.floor(Math.random() * data.data.length)];

      this.send(`/gc Narwhal Image: ${image.link}`);
    } catch (error) {
      this.send(`/gc [ERROR] ${error ?? "Something went wrong.."}`);
    }
  }
}

module.exports = NarwhalCommand;