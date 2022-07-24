const MinecraftCommand = require('../../contracts/MinecraftCommand')
process.on('uncaughtException', function (err) {console.log(err.stack)});

class CalculateCommand extends MinecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'math'
        this.aliases = ["calc", "calculate"]
        this.description = 'Calculate.'
        this.options = ['calculation']
        this.optionsDescription = ['Any kind of math equation']
    }

    onCommand(username, message) { 
        try {
          let str = this.getArgs(message).join(' ').replace(/[^-()\d/*+.]/g, '');
          let result = eval(str);
          if(isNaN(result)) this.send('/gc Invalid input!');
          else this.send(`/gc ${result}`);
        } catch {
          this.send('/gc Invalid input!');
        }
    }
}

module.exports = CalculateCommand;