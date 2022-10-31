const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/API/HypixelRebornAPI')

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

class watchdogCommand extends MinecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'watchdog'
        this.aliases = ['wd']
        this.description = "Description of the command."
    }

    async onCommand(username, message) {
        try {
            hypixel.getWatchdogStats().then((data) => {
                var staffTotal = data.byStaffTotal
                var watchdogTotal = data.byWatchdogTotal
                var staffTotal = staffTotal.toFixed(0);
                var watchdogTotal = watchdogTotal.toFixed(0);
                var staffTotal = Formatter(staffTotal, 2)
                var watchdogTotal = Formatter(watchdogTotal, 2)
                this.send(`/gc Watchdog Stats: ${watchdogTotal} Staff Stats: ${staffTotal} - Today Watchdog Stats: ${data.byWatchdogLastMinute} Today Staff Stats: ${data.byStaffRollingDay}`)
            }).catch((error) => {
                this.send(`/gc ${player} does not exist!`)
                console.log(error)
            })
        } catch (error) {
            console.log(error)
            this.send('/gc Something went wrong..')
        }
    }
}



module.exports = watchdogCommand;