const minecraftCommand = require('../../contracts/MinecraftCommand.js')
const { addCommas } = require('../../contracts/helperFunctions.js')
const hypixel = require('../../contracts/API/HypixelRebornAPI.js')
const config = require('../../../config.json')
const axios = require('axios');

class DenickerCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'denick'
        this.aliases = ['unnick']
        this.description = 'Denick username of specified user.'
        this.options = ['nick']
        this.optionsDescription = ['Minecraft Username']
    }

    async onCommand(username, message) {
        try {
            const msg = this.getArgs(message);
            username = this.getArgs(message)[0];
            const mode = msg[1] ? msg[1] : 'bedwars';
            const response = (await axios.get(`${config.api.antiSniperAPI}/denick?key=${config.api.antiSniperKey}&nick=${username}`)).data;
            if (!response.player?.ign) {
                this.send('/gc Sorry, I wasn\'t able to denick this person.')
            } else {
                const player = await hypixel.getPlayer(response.player?.ign);
                if (mode == 'duels') {
                    this.send(`/gc ${player.rank ? `[${player.rank}] ` : ``}${response.player?.ign} is nicked as ${response.player.queried_nick} | [${player.stats.duels.division}] ${username} Wins: ${player.stats.duels.wins} | Current WS: ${player.stats.duels.winstreak} | Best WS: ${player.stats.duels.bestWinstreak} | WLR: ${player.stats.duels.WLRatio}`);
                }
                else if (mode == 'bedwars') {
                    this.send(`/gc ${player.rank ? `[${player.rank}] ` : ``}${response.player?.ign} is nicked as ${response.player.queried_nick} | [${player.stats.bedwars.level}✫] ${player.nickname} FK: ${addCommas(player.stats.bedwars.finalKills)} FKDR: ${player.stats.bedwars.finalKDRatio} Wins: ${player.stats.bedwars.wins} WLR: ${player.stats.bedwars.WLRatio} Beds: ${player.stats.bedwars.beds.broken} BLR: ${player.stats.bedwars.beds.BLRatio} WS: ${player.stats.bedwars.winstreak}`);
                }
                else {
                    this.send(`/gc ${player.rank ? `[${player.rank}] ` : ``}${response.player?.ign} is nicked as ${response.player.queried_nick} | [${player.stats.bedwars.level}✫] ${player.nickname} FK: ${addCommas(player.stats.bedwars.finalKills)} FKDR: ${player.stats.bedwars.finalKDRatio} Wins: ${player.stats.bedwars.wins} WLR: ${player.stats.bedwars.WLRatio} Beds: ${player.stats.bedwars.beds.broken} BLR: ${player.stats.bedwars.beds.BLRatio} WS: ${player.stats.bedwars.winstreak}`);
                }
            }
        } catch (error) {
            this.send('/gc Sorry, I wasn\'t able to denick this person.')
        }
    }
}

module.exports = DenickerCommand
