
const minecraftCommand = require("../../contracts/minecraftCommand.js");

class CoinFlipCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);

        this.name = "coinflip";
        this.aliases = ["cf"];
        this.description = "Flip a coin.";
        this.options = [];
    }

    onCommand() {
        // Flip a coin
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';

        // Send the result to the chat
        this.send(`/gc Coin flip result: ${result}`);
    }
}

module.exports = CoinFlipCommand;