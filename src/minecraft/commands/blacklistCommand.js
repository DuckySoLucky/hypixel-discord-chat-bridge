const minecraftCommand = require("../../contracts/minecraftCommand.js");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

class BlacklistCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);
        this.name = "blacklist";
        this.aliases = ["bl"];
        this.description = "Adds or removes a player from the blacklist.";
        this.usage = "!blacklist <add|remove> <player>";
    }

    async onCommand(username, command) {
        const args = this.getArgs(command);
        const action = args[0];
        const playerName = args[1];
    
        // Get the UUID of the player
        const uuidResponse = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${playerName}`);
        const uuid = uuidResponse.data.id;
    
        // Load the blacklist
        const blacklistPath = path.resolve(__dirname, '../../../blacklist.json');
        let blacklist = {};
    
        // Check if the blacklist file exists
        if (fs.existsSync(blacklistPath)) {
            // If it exists, load it
            blacklist = JSON.parse(fs.readFileSync(blacklistPath, 'utf8'));
        }
    
        if (action === "add") {
            // Add the player to the blacklist
            blacklist[playerName] = { "UUID": uuid };
            fs.writeFileSync(blacklistPath, JSON.stringify(blacklist, null, 4));
            await this.send(`/oc ${playerName} has been added to the blacklist.`);
        } else if (action === "remove") {
            // Remove the player from the blacklist
            delete blacklist[playerName];
            fs.writeFileSync(blacklistPath, JSON.stringify(blacklist, null, 4));
            await this.send(`/oc ${playerName} has been removed from the blacklist.`);
        } else {
            throw new Error("Invalid action. Use 'add' or 'remove'.");
        }
    }
}

module.exports = BlacklistCommand;