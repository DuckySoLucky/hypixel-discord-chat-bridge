const MinecraftCommand = require('../../contracts/MinecraftCommand')

class exampleCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'example'
    this.aliases = ['Other', 'aliases']
    this.description = "Description of the command."
  }

  async onCommand(username, message) {
    try {
        this.send(`/gc Example command! - The username of the person running this is ${username} - the message is ${message}`)
    } catch (error) {
      console.log(error)
      this.send('/gc Something went wrong..')
    }
  }
}



module.exports = exampleCommand;