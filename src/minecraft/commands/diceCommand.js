const minecraftCommand = require("../../contracts/minecraftCommand.js");

class DiceRollCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);

        this.name = "diceroll";
        this.aliases = ["dr" , "dice"];
        this.description = "Roll a dice.";
        this.options = [];
    }

    onCommand() {
        // Roll a dice
        const result = Math.floor(Math.random() * 6) + 1;

        // Send the result to the chat
        this.send(`/gc You rolled: ${result}`);
    }
}

module.exports = DiceRollCommand;