const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const getSkills = require("../../../API/stats/skills.js");
const getDungeons = require("../../../API/stats/dungeons.js");

class BlameCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);

        this.name = "blame";
        this.aliases = ["blame" , "bully" , "sham"];
        this.description = "Blames the player if their stats are too low.";
        this.options = [
            {
                name: "username",
                description: "Minecraft username",
                required: false,
            },
        ];

        // Thresholds for each stat
        this.thresholds = {
            farming: 50,
            mining: 50,
            combat: 60,
            foraging: 60,
            fishing: 30,
            enchanting: 60,
            alchemy: 40,
            carpentry: 40,
            runecrafting: 20,
            social: 10,
            taming: 50,
            catacombs: 34,
        };

        // Array of possible blame messages
        this.blameMessages = [
            "Your ${stat} is too low! Stop being lazy! Imagine being only ${statLevel} ",
            "You need to work on your ${stat} u monke! ${statLevel} Only ....",
            "Your ${stat} is not up to par! Get to work! its only ${statLevel} ",
            "Do you even ${stat}, bro? Your level is just ${statLevel}!",
            "I've seen snails with higher ${stat} than your ${statLevel}!",
            "Your ${stat} level is ${statLevel}? Are you even trying?",
            "Wow, ${statLevel} in ${stat}? My grandma has higher stats than you!",
            "Your ${stat} level is so low, it's almost cute. Almost. It's ${statLevel}.",
            "Is your ${stat} level only ${statLevel}? You must be new here.",
            "Your ${stat} level is ${statLevel}. Do you need a tutorial?",
        ];
    } 

    // Function to get a random blame message
    getRandomBlameMessage(stat, statLevel) {
        const randomIndex = Math.floor(Math.random() * this.blameMessages.length);
        return this.blameMessages[randomIndex].replace('${stat}', stat).replace('${statLevel}', statLevel);
    }

    async onCommand(username, message) {
        try {
            username = this.getArgs(message)[0] || username;
            console.log(`Username: ${username}`); // Debug: print the username
    
            const data = await getLatestProfile(username);

            username = formatUsername(data.profileData?.displayname || username);
    
            const skills = getSkills(data.profile);
            console.log(`Skills: ${JSON.stringify(skills)}`); // Debug: print the skills

            const dungeons = getDungeons(data.profile);
            console.log(`Dungeons: ${JSON.stringify(dungeons)}`); // Debug: print the dungeons
    
    
            // Collect all stats that are below their thresholds
            let lowStats = [];
            for (let stat in this.thresholds) {
                if (skills[stat] && skills[stat].level < this.thresholds[stat]) {
                    lowStats.push({ stat: stat, level: skills[stat].level });
                }
                else if (dungeons[stat] && dungeons[stat].level < this.thresholds[stat]) {
                    lowStats.push({ stat: stat, level: dungeons[stat].level });
                }
            }
    
            // If there are any low stats, randomly select one and send a blame message for it
            if (lowStats.length > 0) {
                const randomIndex = Math.floor(Math.random() * lowStats.length);
                const { stat, level } = lowStats[randomIndex];
                const blameMessage = this.getRandomBlameMessage(stat, level);
                console.log(`Blame Message: ${blameMessage}`); // Debug: print the blame message
                this.send(`/gc ${username}, ${blameMessage}`);
            }
        } catch (error) {
            console.error(`Error: ${error}`); // Debug: print the error
        }
    }
}

module.exports = BlameCommand;