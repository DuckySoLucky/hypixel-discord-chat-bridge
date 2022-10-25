const MinecraftCommand = require('../../contracts/MinecraftCommand')
const axios = require('axios')

class eightBallCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = '8ball'
    this.aliases = ['8b']
    this.description = "Ask an 8ball a question."
    this.options = ['question']
    this.optionsDescription = ['Any kind of question']
  }

  async onCommand(username, message) {
    try {
      this.send(axios.get(`https://8ball.delegator.com/magic/JSON/${message}`)).data.magic.answer
    } catch (error) {
      console.log(error)
      this.send('/gc Something went wrong..')
    }
  }
}

module.exports = eightBallCommand