const MinecraftCommand = require("../../contracts/MinecraftCommand");

class CalculateCommand extends MinecraftCommand {
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
      let str = this.getArgs(message)
        .join(" ")
        .replace(/[^-()\d/*+.]/g, "");
      this.send(`/gc ${!isNaN(eval(str)) ? `${eval(str)}` : ""}`);
    } catch (error) {
      console.log(error);
      this.send("/gc Invalid input!");
    }
  }
}

module.exports = CalculateCommand;
