const { formatNumber } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");

class CalculateCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "calculate";
    this.aliases = ["calc", "math"];
    this.description = "Calculate.";
    this.options = [
      {
        name: "calculation",
        description: "Any kind of math equation",
        required: true
      }
    ];
  }

  onCommand(username, message) {
    try {
      const calculation = message.replace(/[^-()\d/*+.]/g, "");
      if (calculation.trim() === "9+10") {
        return this.send("9 + 10 = 21");
      }

      const answer = eval(calculation);

      if (answer === Infinity) {
        return this.send("Something went wrong.. Somehow you broke it (the answer was infinity)");
      }

      return this.send(
        answer > 1000000
          ? `${calculation} = ${formatNumber(answer)} (${answer.toLocaleString()})`
          : `${calculation} = ${formatNumber(answer)}`
      );
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = CalculateCommand;
