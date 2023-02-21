const {
  addCommas,
  addNotation,
} = require("../../contracts/helperFunctions.js");
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
        required: true,
      },
    ];
  }

  onCommand(username, message) {
    try {
      const calculation = this.getArgs(message)
        .join(" ")
        .replace(/[^-()\d/*+.]/g, "");
      const answer = eval(calculation);

      if (answer === Infinity) {
        return this.send(`/gc Something went wrong..`);
      }

      if (answer < 100000) {
        return this.send(`/gc ${calculation} = ${addCommas(answer)}`);
      }

      this.send(
        `/gc ${calculation} = ${addNotation("oneLetters", answer)} (${addCommas(
          answer
        )})`
      );
    } catch (error) {
      this.send(`/gc Error: ${error}`);
    }
  }
}

module.exports = CalculateCommand;
