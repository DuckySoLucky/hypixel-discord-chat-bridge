const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const getSkills = require("../../../API/stats/skills.js");
const getDungeons = require("../../../API/stats/dungeons.js");
const getWeight = require("../../../API/stats/weight.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");
const { fetchPlayerRank } = require("../../../API/functions/GuildAPI");

class RankupCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);

        this.name = "rankup";
        this.aliases = ["rankupp"];
        this.description = "Overview + Automatic Rank Up.";
        this.options = [
            {
                name: "username",
                description: "Minecraft username",
                required: false,
            },
        ];
    } 

    async onCommand(username, message) {
        try {
            username = this.getArgs(message)[0] || username;
            const data = await getLatestProfile(username);

            username = formatUsername(data.profileData?.displayname || username);

            const profile = getWeight(data.profile, data.uuid);
            const dungeons = getDungeons(data.playerRes, data.profile);
            const skills = getSkills(data.profile);

            const skillAverage = (
                Object.keys(skills)
                    .filter((skill) => !["runecrafting", "social"].includes(skill))
                    .map((skill) => skills[skill].levelWithProgress || 0)
                    .reduce((a, b) => a + b, 0) /
                (Object.keys(skills).length - 2)
            ).toFixed(2);

            const senitherW = (profile.senither.total).toFixed(1);
            const catacombsLevel = dungeons && 'catacombs' in dungeons && dungeons.catacombs && dungeons.catacombs.skill ? parseFloat(dungeons.catacombs.skill.levelWithProgress).toFixed(1) : 0;            // Fetch the player's current rank
            const currentRank = await fetchPlayerRank(username);
        
            // Define the ranks in order of highest to lowest
            const ranks = ["Shadow Council","Shadow Adviser", "Shadow Sentry"];
        
            // Check rank requirements and execute rank-up command if met
            if (currentRank == ranks[0]) {
                this.send(`/gc ${username} is already a Council Member u monkey`);     
                console.log(`Player ${username} is already a Council Member`)
            } else if (skillAverage >= 42 && catacombsLevel >= 36 && senitherW >= 7000) {
                if (currentRank !== ranks[1]) {
                    this.send(`/g setrank ${username} Shadow Adviser`);
                    console.log(`Ranked up Player ${username} to Shadow Adviser`)
                } else {
                    this.send(`/gc ${username} is already at the highest rank possible. For further rankup, contact Guild-Leadership.`);
                    console.log(`Player ${username} is already a Shadow Adviser`)
                }
            } else if (skillAverage >= 28 && catacombsLevel >= 24 && senitherW >= 2000) {
                if (currentRank !== ranks[2]) {
                    this.send(`/g setrank ${username} Shadow Sentry`);
                    console.log(`Ranked up Player ${username} to Shadow Sentry`)
                } else {
                    this.send(`/gc ${username} already has the highest rank they meet requirements for.`);
                    console.log(`Player ${username} is already a Shadow Sentry`)
                    await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay
                    this.send(`/gc Next Rank | Skill Average : ${skillAverage}/42 | Catacombs : ${catacombsLevel}/36 | Weight : ${senitherW}/7000 .`);
                    console.log(`/gc Next Rank | Skill Average : ${skillAverage}/42 | Catacombs : ${catacombsLevel}/36 | Weight : ${senitherW}/7000 .`)
                }
            } else {
                this.send(`/gc ${username} does not meet the requirements for a rank-up.`);
                console.log(`Player ${username} does not meet the requirements for a rank-up.`)
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay
                this.send(`/gc Next Rank | Skill Average : ${skillAverage}/28 | Catacombs : ${catacombsLevel}/24 | Weight : ${senitherW}/2000 .`);
                console.log(`/gc Next Rank | Skill Average : ${skillAverage}/28 | Catacombs : ${catacombsLevel}/24 | Weight : ${senitherW}/2000 .`)             
                }
        } catch (error) {
            this.send(`/gc [ERROR] ${error}`);
        }
    }
}

module.exports = RankupCommand;
