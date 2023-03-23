const helperFunctions = require("./helperFunctions.js");
const config = require("../../config.json");

class minecraftCommand {
  constructor(minecraft) {
    this.minecraft = minecraft;
  }

  getArgs(message) {
    const args = message.split(" ");

    args.shift();

    return args;
  }

  send(message, n = 1) {
    if (this.minecraft.bot.player === undefined) return;
    
    const listener = async (msg) => {
      if (msg.toString().includes("You cannot say the same message twice!") === true && msg.toString().includes(":") === false) {
        bot.removeListener("message", listener);

        if (n === 5) {
          return bot.chat("/gc Command failed to send message after 5 attempts.");
        }

        return this.send(`${message} - ${helperFunctions.generateID(config.minecraft.bot.messageRepeatBypassLength)}`, n + 1);
      }
    };

    bot.on("message", listener);
    bot.chat(message);

    setTimeout(() => {
      bot.removeListener("message", listener);
    }, 1500);
  }

  onCommand(player, message) {
    throw new Error("Command onCommand method is not implemented yet!");
  }
}

module.exports = minecraftCommand;
