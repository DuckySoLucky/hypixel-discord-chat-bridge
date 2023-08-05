const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { uploadImage } = require("../../contracts/API/imgurAPI.js");
const axios = require("axios");

class waifucommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "waifu";
    this.aliases = ["w", "women"];
    this.description = "Random picture of a waifu";
    this.options = [];
  }

  async onCommand(username, message) {
    try {
      const { data } = await axios.get(`https://api.waifu.im/search`);

      if (data === undefined) {
        // eslint-disable-next-line no-throw-literal
        throw "An error occured while fetching the image. Please try again later.";
      }
      if (data[0].is_nsfw == false) {
              const link = data[0].url;
      const upload = await uploadImage(link);

      this.send(`/gc Waifu: ${upload.data.link}`);
      }
    } catch (error) {
      this.send(`/gc Error: ${error ?? "Something went wrong.."}`);
    }
  }
}

module.exports = waifucommand;
