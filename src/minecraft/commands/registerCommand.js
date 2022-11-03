const minecraftCommand = require('../../contracts/MinecraftCommand.js')
const fetch = (...args) => import('node-fetch').then(({
    default: fetch
}) => fetch(...args)).catch(err => console.log(err));

class RegisterCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'register'
        this.aliases = ['']
        this.description = 'Will register you in the database for daily/weekly/monthly commands'
    }

    async onCommand(username, message) {
        try {
            const player = message.split(' ')[1]
            // Pixelic-API Docs
            // https://app.swaggerhub.com/apis-docs/Pixelicc/Pixelic-API/0.0.2#/
            fetch(`https://api.ashcon.app/mojang/v2/user/${player}`).then((res) => {
                res.json().then((a) => {
                    const UUID = a.uuid
                    fetch(`https://api.pixelic.de/v1/player/register?uuid=${UUID}`, { method: 'POST' }).then((res) => {
                        if (res.status == 201) {
                            this.send(`/gc Successfully registered ${player} in the database!`)
                        }
                        else if (res.status == 400) {
                            this.send(`/gc ${player} is already registered in the database!`)
                        }
                        else {
                            this.send(`/gc An error occured while registering ${player} in the database! Try again in 5 mins`)
                        }
                    })
                })
            }).catch((err) => {
                this.send(`Player ${player} does not exist!`)
            })
        } catch (error) {
            console.log(error)
            this.send('/gc Something went wrong..')
        }
    }
}

module.exports = RegisterCommand
