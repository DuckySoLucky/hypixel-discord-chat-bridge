const minecraftCommand = require("../../contracts/minecraftCommand.js");
const axios = require("axios");

class EightBallCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "8ball";
    this.aliases = ["8b"];
    this.description = "Ask an 8ball a question.";
    this.options = ["question"];
    this.optionsDescription = ["Any kind of question"];
  }


  async onCommand(username, message) {
    try {
      const { data } = await axios.get(`https://www.eightballapi.com/api`)

      this.send(`/gc ${data.reading}`);
      
    } catch (error) {
      this.send(`/gc Error: ${error?.response?.data?.error}`);
    }
  }
}

module.exports = EightBallCommand;
