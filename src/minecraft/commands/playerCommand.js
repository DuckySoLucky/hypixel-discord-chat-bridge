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

class PlayerCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'player'
    this.aliases = ['']
    this.description = 'Look up a player'
  }


  onCommand(username, message) {
    const player = message.split(' ')[1]
    hypixel.getPlayer(player).then((data) => {
      var ap = Formatter(((data.achievementPoints).toFixed(0)), 2)
      var karma = Formatter(((data.karma).toFixed(0)), 2)
      this.send(`/gc Info for [${player.rank}] ${player} - Karma: ${karma} Network Level: ${data.level} Achievement Points: ${ap} Guild: ${data.guild} Online Status: ${data.isOnline}`)
    }).catch((error) => {
      this.send(`/gc ${player} is not a valid player!`)
      console.log(error)
    })
  }
}

module.exports = PlayerCommand