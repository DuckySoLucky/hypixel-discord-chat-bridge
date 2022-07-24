process.on('uncaughtException', function (err) {console.log(err.stack)})
const MinecraftCommand = require('../../contracts/MinecraftCommand')
const { ImgurClient } = require('imgur');
const axios = require('axios')

class kittyCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'kitty'
    this.aliases = ['cat', 'cutecat']
    this.description = "Random image of cute cat."
    this.options = []
    this.optionsDescription = []
  }

  async onCommand(username, message) {
    const response = await axios.get(`https://api.thecatapi.com/v1/images/search`)
    const link = response.data[0].url 
    const client = new ImgurClient({ clientId: '5fd67f62f4f1a59' });
    const upload = await client.upload({image: link, type: 'stream'})
    this.send(`/gc Cute Cat » ${upload.data.link}`)
  }
}



module.exports = kittyCommand;