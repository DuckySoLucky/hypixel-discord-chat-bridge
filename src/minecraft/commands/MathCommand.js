const MinecraftCommand = require('../../contracts/MinecraftCommand')

class CalculateCommand extends MinecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'math'
        this.aliases = ["calc", "calculate"]
        this.description = 'Calculate.'
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