const minecraftCommand = require("../../contracts/minecraftCommand.js");
const config = require("../../../config.json");
// eslint-disable-next-line
const { ImgurClient } = require("imgur");
const axios = require("axios");

class KittyCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "kitty";
    this.aliases = ["cat", "cutecat"];
    this.description = "Random image of cute cat.";
    this.options = [];
    this.optionsDescription = [];
  }

  async onCommand(username, message) {
    try {
      const link = (
        await axios.get(`https://api.thecatapi.com/v1/images/search`)
      ).data[0].url;
      const client = new ImgurClient({ clientId: config.api.imgurAPIkey });
      const upload = await client.upload({ image: link, type: "stream" });
      this.send(`/gc Cute Cat » ${upload.data.link}`);
    } catch (error) {
      console.log(error);
      this.send("/gc Something went wrong..");
    }
  }
}

module.exports = KittyCommand;
