const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getFetchur } = require("../../../API/functions/getFetchur.js");

class FetchurCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "fetchur";
    this.aliases = [];
    this.description = "Information about an item for Fetchur.";
    this.options = [];
  }

  async onCommand(username, message, channel = "gc") {
    try {
      const { text, description } = getFetchur();

      this.send(`/${channel} Fetchur Requests: ${text} | Description: ${description}`);
    } catch (error) {
      this.send(`/${channel} [ERROR] ${error || "Something went wrong.."}`);
    }
  }
}

module.exports = FetchurCommand;
