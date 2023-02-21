const minecraftCommand = require("../../contracts/minecraftCommand.js");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getAnswer = (message) => message.split(": ")[1];

class QuickMathsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "quickmaths";
    this.aliases = ["qm"];
    this.description = "Solve the equation in less than 10 seconds! Test your math skills!";
    this.options = [];
  }

  async onCommand(username, message) {
    try {
      const userUsername = username;
      const operands = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
      const operators = ["+", "-", "*"];
      const operator = operators[Math.floor(Math.random() * operators.length)];

      const equation = `${operands[0]} ${operator} ${operands[1]}`;
      const answer = eval(operands.join(operator));
      const headStart = 250;
      
      this.send(`/gc ${username} What is ${equation}? (You have ${headStart}ms headstart)`);
      await delay(headStart);

      const startTime = Date.now();
      let answered = false;

      const listener = (username, message) => {
        if (username === bot.username || getAnswer(message) !== answer.toString()) {
          return;
        }

        answered = true;
        this.send(`/gc ${userUsername} Correct! It took you ${(Date.now() - startTime).toLocaleString()}ms`);
        bot.removeListener("chat", listener);
      };

      bot.on("chat", listener);

      setTimeout(() => {
        bot.removeListener("chat", listener);

        if (!answered) {
          this.send(`/gc ${userUsername} Time's up! The answer was ${answer}`);
        }
      }, 10000);

    } catch (error) {
      this.send(`/gc ${username} Error: ${error || "Something went wrong.."}`);
    }
  }
}

module.exports = QuickMathsCommand;