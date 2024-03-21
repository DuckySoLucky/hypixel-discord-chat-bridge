const axios = require('axios');
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");
const config = require("../../../config.json");

class CheckStatusCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);

        this.name = "status";
        this.aliases = ["checkstatus", "online"];
        this.description = "Check the status of a player.";
        this.options = [
            {
                name: "username",
                description: "Minecraft username",
                required: true,
            },
        ];
    } 

    async onCommand(username, message) {
        try {
            username = this.getArgs(message)[0] || username;

            // Get the UUID of the player
            const uuidResponse = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`);
            const uuid = uuidResponse.data.id;

            // Get the API key from the config
            const apiKey = config.minecraft.API.hypixelAPIkey;

            // Get the status of the player
            const statusResponse = await axios.get(`https://api.hypixel.net/v2/status?key=${apiKey}&uuid=${uuid}`);
            const status = statusResponse.data.session;

            const locationNames = {
                "dynamic": "Private Island",
                "hub": "Hub",
                "combat_1": "Spiders Den",
                "foraging_1": "The Park",
                "mining_1": "Gold Mines",
                "farming_1": "Farming Islands",
                "dungeon_hub": "Dungeon Hub",
                "combat_3": "End",
                "crimson_hub": "Crimson Isle",
                "mining_2": "Deep Caverns",
                "mining_3": "Dwarven Mines",
                "crystal_hollows": "Crystal Hollows",
                "rift": "Rift",
                "garden": "Garden",
                "dungeon": "Dungeon",
                "kuudra": "Kuudra",
                "winter": "Jerry's Workshop",
                "dark_auction": "Dark Auction"
            };
            const location = locationNames[status.mode] || status.mode;

            // Send the status to the guild chat
            if (status.online) {
                this.send(`/gc ${username} is currently online, playing ${status.gameType} - ${location} .`);
            } else {
                this.send(`/gc ${username} is currently offline.`);
            }
        } catch (error) {
            this.send(`/gc [ERROR] ${error}`);
        }
    }
}

module.exports = CheckStatusCommand;