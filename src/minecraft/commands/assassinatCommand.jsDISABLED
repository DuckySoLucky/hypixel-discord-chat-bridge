const minecraftCommand = require("../../contracts/minecraftCommand.js");

class assassinateCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "assassinate";
    this.aliases = ["assassinateuser", "assassinatemember"];
    this.description = "assassinate a user from the guild.";
    this.options = [
        {
            name: "username",
            description: "Minecraft username",
            required: false,
        },
    ];
  }

  async onCommand(username, message) {
    const args = message.split(' ');
    if (args.length < 2) {
      this.send(`/gc [ERROR] Please specify a username to assassinate.`);
      return;
    }

    const userToassassinate = args[1];
    this.send(`/g kick ${userToassassinate} You got assassinated`);
  }
}

module.exports = assassinateCommand;