class DiscordCommand {
  constructor(discord) {
    this.discord = discord;
  }

  getArgs(message) {
    let args = message.content.split(" ");

    args.shift();

    return args;
  }

  sendMinecraftMessage(message) {
    if (this.discord.app.minecraft.bot.player !== undefined) {
      this.discord.app.minecraft.bot.chat(message);
    }
  }

  onCommand(message) {
    throw new Error("Command onCommand method is not implemented yet!");
  }
}

module.exports = DiscordCommand;
