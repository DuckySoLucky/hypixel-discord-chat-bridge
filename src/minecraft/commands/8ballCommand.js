const minecraftCommand = require('../../contracts/MinecraftCommand.js')
const fetch = (...args) => import('node-fetch').then(({
  default: fetch
}) => fetch(...args)).catch(err => console.log(err));

class EightBallCommand extends minecraftCommand {
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
      fetch(`https://8ball.delegator.com/magic/JSON/${message}`).then(res => {
        res.json().then((data) => {
          this.send(`/gc the magic 8ball says ${data.magic.answer}`)
        })
      })
    } catch (error) {
      console.log(error)
      this.send('/gc Something went wrong..')
    }
  }
}

module.exports = EightBallCommand