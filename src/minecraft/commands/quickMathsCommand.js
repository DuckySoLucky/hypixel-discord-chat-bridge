const minecraftCommand = require("../../contracts/minecraftCommand.js");
const config = require("../../../config.json");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getAnswer = (message, answer) => {
  let message_parts = message.split(" ");

  if (message_parts[message_parts.length - 1] == answer) {
    return true;
  }

  return false;
};

class QuickMathsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "quickmaths";
    this.aliases = ["qm"];
    this.description = "Solve the equation in less than 10 seconds! Test your math skills!";
    this.options = [];
  }

  async onCommand(username, message, channel = "gc") {
    try {
      const userUsername = username;
      const operands = [Math.floor(Math.random() * 25), Math.floor(Math.random() * 25)];
      const operators = ["+", "-", "*", "/"];
      const operator = operators[Math.floor(Math.random() * operators.length)];

      const equation = `${operands[0]} ${operator} ${operands[1]}`;
      const answer = Math.round(eval(operands.join(operator)) * 10) / 10;
      const headStart = 250;

      this.send(`/${channel} ${username} What is ${equation}? (You have ${headStart}ms headstart)`);
      await delay(headStart);

      const startTime = Date.now();
      let answered = false;

      const listener = (username, message) => {
        if (!getAnswer(message, answer.toString())) {
          return;
        }

        answered = true;
        this.send(`/${channel} Correct! It took you ${(Date.now() - startTime).toLocaleString()}ms`);
        bot.removeListener("chat", listener);
      };

      bot.on("chat", listener);

      setTimeout(() => {
        bot.removeListener("chat", listener);

        if (!answered) {
          this.send(`/${channel} Time's up! The answer was ${answer}`);
        }
      }, 10000);
    } catch (error) {
      this.send(`/${channel} ${username} [ERROR] ${error || "Something went wrong.."}`);
    }
  }
}

module.exports = QuickMathsCommand;
