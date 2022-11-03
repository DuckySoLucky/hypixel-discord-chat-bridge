
const MinecraftCommand = require('../../contracts/MinecraftCommand')
const config = require('../../../config.json')
const fetch = (...args) => import('node-fetch').then(({
    default: fetch
}) => fetch(...args)).catch(err => console.log(err));

class findNickCommand extends MinecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'findnick'
        this.aliases = ['fnick', 'whonick']
        this.description = 'find a nick of a player'
    }


    onCommand(username, message) {
        const player = message.split(' ')[1]
        fetch(`https://api.antisniper.net/findnick?key=${config.api.antiSniperKey}&name=${player}`).then((res) => {
            res.json().then((data) => {
                this.send(`/gc ${data.player.ign} is nicked as ${data.player.nick}`)
            }).catch(err => {
                console.log(err)
                this.send(`/gc ${player} is not nicked or not in the database`)
            })
        })
    }
}

module.exports = findNickCommand


