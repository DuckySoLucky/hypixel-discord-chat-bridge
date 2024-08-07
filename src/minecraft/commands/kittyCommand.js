const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { uploadImage } = require("../../contracts/API/imgurAPI.js");
const axios = require("axios");

class KittyCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "kitty";
    this.aliases = ["cat", "cutecat"];
    this.description = "Random image of cute cat.";
    this.options = [];
  }

  async onCommand(username, message, officer) {
    try {
      const { data } = await axios.get(`https://api.thecatapi.com/v1/images/search`);

      if (data === undefined) {
        // eslint-disable-next-line no-throw-literal
        throw "An error occured while fetching the image. Please try again later.";
      }

      const link = data[0].url;
      const upload = await uploadImage(link);

      this.send(`Cute Cat: ${upload.data.link}`, officer);
    } catch (error) {
      this.send(`[ERROR] ${error ?? "Something went wrong.."}`, officer);
    }
  }
}

module.exports = KittyCommand;
