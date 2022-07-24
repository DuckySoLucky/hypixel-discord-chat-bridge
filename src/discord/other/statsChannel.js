const config = require('../../../config.json');
const hypixel = require('../../contracts/API/HypixelRebornAPI');

function statsChannel(client) {
    setInterval(() => {
        hypixel.getGuild("id", config.minecraft.guildID).then(guild => {
            client.channels.cache.get(config.channels.guildMember).setName(`Guild Members: ${guild.members.length}/125`);
            client.channels.cache.get(config.channels.guildLevel).setName(`Guild Level: ${guild.level}`);
        }).catch(console.error);
    }, 10000);
}

module.exports = { statsChannel };