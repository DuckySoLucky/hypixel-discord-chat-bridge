const minecraftCommand = require("../../contracts/minecraftCommand.js");

class RandomNumberCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "number";
    this.description = "Get a random number between two given numbers.";
    this.options = [];
  }

  async onCommand(username, message) {
    try {
      const args = message.split(" ").filter(arg => arg.trim() !== "");
      if (args.length !== 3) {
        throw "Invalid number of arguments. Please provide two numbers.";
      }

      const number1 = parseInt(args[1]);
      const number2 = parseInt(args[2]);

      if (isNaN(number1) || isNaN(number2)) {
        throw "Invalid numbers provided.";
      }

      const randomNumber = Math.floor(Math.random() * (Math.max(number1, number2) - Math.min(number1, number2) + 1)) + Math.min(number1, number2);

      this.send(`/gc Number is :: ${randomNumber}`);
    } catch (error) {
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}

module.exports = RandomNumberCommand;
