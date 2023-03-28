const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const hypixel = require('../../contracts/API/HypixelRebornAPI.js');
const { writeAt } = require('../../contracts/helperFunctions.js');

setInterval(async () => {
    try {
        var guild = await hypixel.getGuild('player', bot.username);
        var members = guild.members;
        var guildMembers = [];
        for (const member in members) {
            guildMembers.push(members[member].uuid)
        }
        var f = guildMembers.entries();
        for (let x of f) {
            var i = guildMembers[x]
            await delay(500)
            await writeAt('data/guildList.json', i, i)
            x = x + 1
        }
    } catch (error) {
        console.log(error)
    }
}, 900000); // 15 min