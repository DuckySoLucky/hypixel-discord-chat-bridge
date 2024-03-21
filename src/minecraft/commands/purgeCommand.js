const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { fetchPlayerAPI, fetchGuildAPI } = require("../../../API/functions/GuildAPI");
const { getUUID } = require("../../contracts/API/PlayerDBAPI.js");
const fs = require("fs");
const whitelist = require("../../../whitelist.json");
const blacklist = require("../../../blacklist.json");

class PurgeCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);

        this.name = "purge";
        this.aliases = [];
        this.description = "Test purge of members based on last login time.";
        this.options = [
            {
                name: "time",
                description: "Time duration (e.g., '6w' for 6 weeks, '1m' for 1 month)",
                required: true,
            },
            {
                name: "reason",
                description: "Reason for the purge",
                required: true,
            },
        ];
    }

    async onCommand(username, message) {
        // Parse the arguments
        const args = this.getArgs(message);
        const timeArg = args[0] || '1m';  // Default to '1m' if no time argument is provided
        const reason = args[1] || 'No reason provided';  // Default to 'No reason provided' if no reason is provided

        const timeUnit = timeArg.slice(-1);
        let time;
        switch (timeUnit) {
            case 'w':
                time = parseInt(timeArg) * 7 * 24 * 60 * 60 * 1000;  // Convert weeks to milliseconds
                break;
            case 'm':
                time = parseInt(timeArg) * 30 * 24 * 60 * 60 * 1000;  // Convert months to milliseconds
                break;
            default:
                console.log('Invalid time unit. Please use "w" for weeks or "m" for months.');
                return;
        }

        // Fetch UUID for the command issuer
        const issuerUUID = await getUUID(username);

        if (!issuerUUID) {
            this.send (`/oc UUID not found for player ${username}.`);
        }

        // Fetch guild data
        const guildData = await fetchGuildAPI();

        // Get the guild member data for the command issuer
        const issuerMemberData = guildData.members.find(member => member.uuid === issuerUUID);

        if (!issuerMemberData) {
            this.send (`/oc Player ${username} not found in the guild data.`);
        }

        // Check if the player has the rank "Guild Master"
        if (issuerMemberData.rank !== "Guild Master") {
            await this.send(`/oc Player ${username} does not have the required rank to run this command.`);
            return;
        }

        // Fetch player data for each member
        const membersData = await Promise.all(guildData.members.map(async (member) => {
            const playerData = await fetchPlayerAPI(member.uuid);
            return {
                memberData: {
                    uuid: member.uuid,
                    rank: member.rank,
                    joined: member.joined,
                    expHistory: member.expHistory
                },
                playerData: {
                    id: playerData._id,
                    uuid: playerData.uuid,
                    displayname: playerData.displayname,
                    firstLogin: playerData.firstLogin,
                    lastLogin: playerData.lastLogin
                }
            };
        }));

        // Write the fetched data to a file
        const output = {
            guild: {
                id: guildData._id,
                name: guildData.name,
                members: membersData
            }
        };
        fs.writeFileSync('./apiOutput.json', JSON.stringify(output, null, 2));

        // Read the data from the file
        const fileData = JSON.parse(fs.readFileSync('./apiOutput.json', 'utf8'));
        const membersFromFile = fileData.guild.members;

        // Iterate over guild members and check last login time
        for (const member of membersFromFile) {
            const lastLogin = member.playerData.lastLogin;

            // If the player is on the whitelist, skip them
            if (Object.values(whitelist).find(player => player.UUID === member.playerData.uuid)) {
                console.log(`Player ${member.playerData.displayname} is on the whitelist and won't be kicked.`);
                continue;
            }

            // If the player is on the blacklist, kick them
            if (Object.values(blacklist).find(player => player.UUID === member.playerData.uuid)) {
                console.log(`Player ${member.playerData.displayname} would be kicked for being on the blacklist`);
                await this.send(`/g kick ${member.playerData.displayname} Blacklist `);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Add a delay between messages
                continue;
            }

            // Check if the player has been offline for too long
            if ((Date.now() - lastLogin) > time) {
                const offlineTime = Date.now() - lastLogin;
                const offlineDays = Math.floor(offlineTime / (1000 * 60 * 60 * 24));
                console.log(`Player ${member.playerData.displayname} would be kicked for being offline for ${offlineDays} days`);
                await this.send(`/g kick ${member.playerData.displayname} ${reason} `);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Add a delay between messages
            }
        }
    }
} 

module.exports = PurgeCommand;