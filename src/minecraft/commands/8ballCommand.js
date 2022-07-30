process.on('uncaughtException', function (err) {console.log(err.stack)})
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

  onCommand(username, message) {
    let args = this.getArgs(message)
    let temp = this;
    axios({
      method: 'get',
      url: `https://8ball.delegator.com/magic/JSON/${args}`
    }).then(function (response) {
      temp.send(`/gc ${response.data.magic.answer}`)
    }).catch(()=>{this.send(`/gc ${username} an error occured.`)})
  }
}

module.exports = eightBallCommand