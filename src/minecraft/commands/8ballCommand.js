const minecraftCommand = require("../../contracts/minecraftCommand.js");
const axios = require("axios");

class EightBallCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "8ball";
    this.aliases = ["8b"];
    this.description = "Ask an 8ball a question.";
    this.options = [
      {
        name: "question",
        description: "The question you want to ask the 8ball",
        required: true,
      },
    ];
  }

  async onCommand(username, message) {
    try {
      if (this.getArgs(message).length === 0) {
        // eslint-disable-next-line no-throw-literal
        throw "You must provide a question.";
      }

      const { data } = await axios.get(`https://www.eightballapi.com/api`);

      this.send(`/gc ${data.reading}`);
    } catch (error) {
      this.send(`/gc Error: ${error}`);
    }
  }
}

module.exports = EightBallCommand;
