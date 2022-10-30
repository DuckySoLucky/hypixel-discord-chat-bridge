
const MinecraftCommand = require('../../contracts/MinecraftCommand')
const config = require('../../../config.json')
const fetch = (...args) => import('node-fetch').then(({
    default: fetch
}) => fetch(...args)).catch(err => console.log(err));

function Formatter(num, digits) {
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "m" },
        { value: 1e9, symbol: "b" },
        { value: 1e12, symbol: "t" },
        { value: 1e15, symbol: "q" },
        { value: 1e18, symbol: "qi" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function (item) {
        return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

class dailyCommand extends MinecraftCommand {
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

module.exports = dailyCommand
