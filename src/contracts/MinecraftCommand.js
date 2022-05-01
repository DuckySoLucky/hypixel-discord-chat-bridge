class MinecraftCommand {
  constructor(minecraft) {
    this.minecraft = minecraft
  }

  getArgs(message) {
    let args = message.split(' ')

    args.shift()

    return args
  }

  send(message) {
    if (this.minecraft.bot.player !== undefined) {
      this.minecraft.bot.chat(message)
    }
  }

  onCommand(player, message) {
    throw new Error('Command onCommand method is not implemented yet!')
  }
}

module.exports = MinecraftCommand
