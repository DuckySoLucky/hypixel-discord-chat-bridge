const minecraftCommand = require("../../contracts/minecraftCommand.js");

class CalculateCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "math";
    this.aliases = ["calc", "calculate"];
    this.description = "Calculate.";
    this.options = ["calculation"];
    this.optionsDescription = ["Any kind of math equation"];
  }

  onCommand(username, message) {
    try {
      const calculation = this.getArgs(message).join(" ").replace(/[^-()\d/*+.]/g, "");

      this.send(`/gc ${calculation.split("").join(" ")} = ${eval(calculation) === Infinity ? "Something went wrong.." : `${eval(calculation)} (${Math.round(eval(calculation))})` }`);

    } catch (error) {
      this.send(`/gc Error: ${error}`);
    }
  }
}

module.exports = CalculateCommand;
