const minecraftCommand = require("../../contracts/minecraftCommand.js");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

class WhitelistCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);
        this.name = "whitelist";
        this.aliases = ["wl"];
        this.description = "Adds or removes a player from the whitelist.";
        this.usage = "!whitelist <add|remove> <player>";
    }

    async onCommand(username, command) {
        const args = this.getArgs(command);
        const action = args[0];
        const playerName = args[1];
    
        // Get the UUID of the player
        const uuidResponse = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${playerName}`);
        const uuid = uuidResponse.data.id;
    
        // Load the whitelist
        const whitelistPath = path.resolve(__dirname, '../../../whitelist.json');
        let whitelist = {};
    
        // Check if the whitelist file exists
        if (fs.existsSync(whitelistPath)) {
            // If it exists, load it
            whitelist = JSON.parse(fs.readFileSync(whitelistPath, 'utf8'));
        }
    
        if (action === "add") {
            // Add the player to the whitelist
            whitelist[playerName] = { "UUID": uuid };
            fs.writeFileSync(whitelistPath, JSON.stringify(whitelist, null, 4));
            await this.send(`/oc ${playerName} has been added to the whitelist.`);
        } else if (action === "remove") {
            // Remove the player from the whitelist
            delete whitelist[playerName];
            fs.writeFileSync(whitelistPath, JSON.stringify(whitelist, null, 4));
            await this.send(`/oc ${playerName} has been removed from the whitelist.`);
        } else {
            throw new Error("Invalid action. Use 'add' or 'remove'.");
        }
    }
}

module.exports = WhitelistCommand;