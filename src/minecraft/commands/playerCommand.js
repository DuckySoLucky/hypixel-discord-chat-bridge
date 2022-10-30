const player = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/API/HypixelRebornAPI')
const { addCommas } = require('../../contracts/helperFunctions')

function Formatter(num, digits) {
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "m" },
        { value: 1e9, symbol: "b" },
        { value: 1e12, symbol: "t" }
    ];
    const rx = /.0+$|(.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function (item) {
        return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

class exampleCommand extends player {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'player'
        this.aliases = ['p']
        this.description = "Look up a player."
    }

    async onCommand(username, message) {
        try {
            const player = message.split(' ')[1]
            hypixel.getPlayer(player).then((data) => {
                var karma = data.karma
                var ap = data.achievementPoints
                var karma = karma.toFixed(0);
                var ap = ap.toFixed(0);
                var karma = Formatter(karma, 2)
                var ap = Formatter(ap, 2)
                this.send(`/gc Info for ${player} - Rank: ${data.rank} Karma: ${karma} Network Level: ${data.level} Achievement Points: ${ap}`)
            })
        } catch (error) {
            console.log(error)
            this.send('/gc Something went wrong..')
        }
    }
}



module.exports = exampleCommand;