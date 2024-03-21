const minecraftCommand = require("../../contracts/minecraftCommand.js");

class RankUpCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "ranks";
    this.aliases = ["ranks"];
    this.description = "Rank up command.";
    this.options = [];
    this.messages = [
      "To to see if you meet the reqs run /guild-requirements in Bot-Commands Channel in our Guild Discord",
      "Requirements are as Follows :",
      "Shadow Novice : Simply Exist + Have API ON !",
      "Shadow Sentry : SA 28 / C24 / 2k Senither Weight",
      "Shadow Adviser : SA 42 / C36 / 7k Senither Weight",
      "If you meet any of the requirements open a ticket in discord or let a Council member know",
    ];
  }

  async onCommand(username, message) {
    try {
      for (let i = 0; i < this.messages.length; i++) {
        const selectedMessage = this.messages[i].replace("{username}", username);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay
        this.send(`/gc ${selectedMessage}`);
      }
    } catch (error) {
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}

module.exports = RankUpCommand;
