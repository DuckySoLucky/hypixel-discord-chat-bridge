const MinecraftCommand = require('../../contracts/MinecraftCommand')
const config = require('../../../config.json')
const fetch = (...args) => import('node-fetch').then(({
    default: fetch
}) => fetch(...args)).catch(err => console.log(err));

class dailyCommand extends MinecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'daily'
        this.aliases = ['']
        this.description = 'Shows ur daily stats'
    }

    async onCommand(username, message) {
        try {
            const player = message.split(' ')[1]
            const mode = message.split(' ')[2]
            // Pixelic-API Docs
            // https://app.swaggerhub.com/apis-docs/Pixelicc/Pixelic-API/0.0.2#/
            fetch(`https://api.ashcon.app/mojang/v2/user/${player}`).then((res) => {
                res.json().then((uuid) => {
                    const UUID = (uuid.uuid) // Swapped Mojang API to Ashcon API (Its a lot faster and u wont get ratelimited anymore)
                    fetch(`https://api.pixelic.de/v1/player/daily?uuid=${UUID}`).then((res) => {
                        res.json().then((Daily) => { // For Weekly/Monthly just replace ".../daily?uuid=..." with ".../weekly?uuid=..." or ".../monthly?uuid=..." the rest of the code will still say daily but thats the easiest way and u are fricking lazy
                            fetch(`https://api.hypixel.net/player?uuid=${UUID}&key=${config.api.hypixelAPIkey}`).then((res) => {
                                res.json().then((player) => {

                                    const Player = player.player
                                    const PlayerName = message.split(' ')[1]

                                    if (mode == 'solo') {
                                        var Bedwars_solo_wins = Player.stats.Bedwars.eight_one_wins_bedwars === undefined ? 0 : Player.stats.Bedwars.eight_one_wins_bedwars - Daily.Bedwars.solo.wins
                                        var Bedwars_solo_losses = Player.stats.Bedwars.eight_one_losses_bedwars === undefined ? 0 : Player.stats.Bedwars.eight_one_losses_bedwars - Daily.Bedwars.solo.losses
                                        var Bedwars_solo_finalKills = Player.stats.Bedwars.eight_one_final_kills_bedwars === undefined ? 0 : Player.stats.Bedwars.eight_one_final_kills_bedwars - Daily.Bedwars.solo.finalKills
                                        var Bedwars_solo_finalDeaths = Player.stats.Bedwars.eight_one_final_deaths_bedwars === undefined ? 0 : Player.stats.Bedwars.eight_one_final_deaths_bedwars - Daily.Bedwars.solo.finalDeaths
                                        var Bedwars_solo_bedsBroken = Player.stats.Bedwars.eight_one_beds_broken_bedwars === undefined ? 0 : Player.stats.Bedwars.eight_one_beds_broken_bedwars - Daily.Bedwars.solo.bedsBroken
                                        var Bedwars_solo_bedsLost = Player.stats.Bedwars.eight_one_beds_lost_bedwars === undefined ? 0 : Player.stats.Bedwars.eight_one_beds_lost_bedwars - Daily.Bedwars.solo.bedsLost
                                        if (Bedwars_solo_wins == '0') {
                                            var Bedwars_solo_wlr_1 = '0'
                                        }
                                        else if (Bedwars_solo_losses == '0') {
                                            var Bedwars_solo_wlr_2 = Bedwars_solo_wins
                                        }
                                        else {
                                            var Bedwars_solo_wlr_3 = (Bedwars_solo_wins / Bedwars_solo_losses).toFixed(2)
                                        }
                                        var Bedwars_solo_wlr = Bedwars_solo_wlr_1 || Bedwars_solo_wlr_2 || Bedwars_solo_wlr_3
                                        if (Bedwars_solo_finalKills == '0') {
                                            var Bedwars_solo_fkdr = '0'
                                        }
                                        else if (Bedwars_solo_finalDeaths == '0') {
                                            var Bedwars_solo_fkdr = Bedwars_solo_finalKills
                                        }
                                        else {
                                            var Bedwars_solo_fkdr = (Bedwars_solo_finalKills / Bedwars_solo_finalDeaths).toFixed(2)
                                        }
                                        if (Bedwars_solo_bedsBroken == '0') {
                                            var Bedwars_solo_bblr = '0'
                                        }
                                        else if (Bedwars_solo_bedsLost == '0') {
                                            var Bedwars_solo_bblr = Bedwars_solo_bedsBroken
                                        }
                                        else {
                                            var Bedwars_solo_bblr = (Bedwars_solo_bedsBroken / Bedwars_solo_bedsLost).toFixed(2)
                                        }
                                        this.send(`/gc Daily stats for ${PlayerName} in ${mode}: Wins: ${Bedwars_solo_wins} WLR: ${Bedwars_solo_wlr} FKDR: ${Bedwars_solo_fkdr} BLR: ${Bedwars_solo_bblr} Finals: ${Bedwars_solo_finalKills} Beds: ${Bedwars_solo_bedsBroken}`)
                                    }
                                    else if (mode == 'doubles') {
                                        var Bedwars_doubles_wins = Player.stats.Bedwars.eight_two_wins_bedwars === undefined ? 0 : Player.stats.Bedwars.eight_two_wins_bedwars - Daily.Bedwars.doubles.wins
                                        var Bedwars_doubles_losses = Player.stats.Bedwars.eight_two_losses_bedwars === undefined ? 0 : Player.stats.Bedwars.eight_two_losses_bedwars - Daily.Bedwars.doubles.losses
                                        var Bedwars_doubles_kills = Player.stats.Bedwars.eight_two_kills_bedwars === undefined ? 0 : Player.stats.Bedwars.eight_two_kills_bedwars - Daily.Bedwars.doubles.kills
                                        var Bedwars_doubles_deaths = Player.stats.Bedwars.eight_two_deaths_bedwars === undefined ? 0 : Player.stats.Bedwars.eight_two_deaths_bedwars - Daily.Bedwars.doubles.deaths
                                        var Bedwars_doubles_finalKills = Player.stats.Bedwars.eight_two_final_kills_bedwars === undefined ? 0 : Player.stats.Bedwars.eight_two_final_kills_bedwars - Daily.Bedwars.doubles.finalKills
                                        var Bedwars_doubles_finalDeaths = Player.stats.Bedwars.eight_two_final_deaths_bedwars === undefined ? 0 : Player.stats.Bedwars.eight_two_final_deaths_bedwars - Daily.Bedwars.doubles.finalDeaths
                                        var Bedwars_doubles_bedsBroken = Player.stats.Bedwars.eight_two_beds_broken_bedwars === undefined ? 0 : Player.stats.Bedwars.eight_two_beds_broken_bedwars - Daily.Bedwars.doubles.bedsBroken
                                        var Bedwars_doubles_bedsLost = Player.stats.Bedwars.eight_two_beds_lost_bedwars === undefined ? 0 : Player.stats.Bedwars.eight_two_beds_lost_bedwars - Daily.Bedwars.doubles.bedsLost
                                        if (Bedwars_doubles_wins == '0') {
                                            var Bedwars_doubles_wlr = '0'
                                        }
                                        else if (Bedwars_doubles_losses == '0') {
                                            var Bedwars_doubles_wlr = Bedwars_doubles_wins
                                        }
                                        else {
                                            var Bedwars_doubles_wlr = (Bedwars_doubles_wins / Bedwars_doubles_losses).toFixed(2)
                                        }
                                        if (Bedwars_doubles_kills == '0') {
                                            var Bedwars_doubles_kdr = '0'
                                        }
                                        else if (Bedwars_doubles_deaths == '0') {
                                            var Bedwars_doubles_kdr = Bedwars_doubles_kills
                                        }
                                        else {
                                            var Bedwars_doubles_kdr = (Bedwars_doubles_kills / Bedwars_doubles_deaths).toFixed(2)
                                        }
                                        if (Bedwars_doubles_finalKills == '0') {
                                            var Bedwars_doubles_fkdr = '0'
                                        }
                                        else if (Bedwars_doubles_finalDeaths == '0') {
                                            var Bedwars_doubles_fkdr = Bedwars_doubles_finalKills
                                        }
                                        else {
                                            var Bedwars_doubles_fkdr = (Bedwars_doubles_finalKills / Bedwars_doubles_finalDeaths).toFixed(2)
                                        }
                                        if (Bedwars_doubles_bedsBroken == '0') {
                                            var Bedwars_doubles_bblr = '0'
                                        }
                                        else if (Bedwars_doubles_bedsLost == '0') {
                                            var Bedwars_doubles_bblr = Bedwars_doubles_bedsBroken
                                        }
                                        else {
                                            var Bedwars_doubles_bblr = (Bedwars_doubles_bedsBroken / Bedwars_doubles_bedsLost).toFixed(2)
                                        }
                                        this.send(`/gc Daily stats for ${PlayerName} in ${mode}: Wins: ${Bedwars_doubles_wins}  WLR: ${Bedwars_doubles_wlr} FKDR: ${Bedwars_doubles_fkdr} BLR: ${Bedwars_doubles_bblr} Finals: ${Bedwars_doubles_finalKills} Beds: ${Bedwars_doubles_bedsBroken}`)
                                    }
                                    else if (mode == 'threes') {
                                        var Bedwars_threes_wins = Player.stats.Bedwars.four_three_wins_bedwars === undefined ? 0 : Player.stats.Bedwars.four_three_wins_bedwars - Daily.Bedwars.threes.wins
                                        var Bedwars_threes_losses = Player.stats.Bedwars.four_three_losses_bedwars === undefined ? 0 : Player.stats.Bedwars.four_three_losses_bedwars - Daily.Bedwars.threes.losses
                                        var Bedwars_threes_kills = Player.stats.Bedwars.four_three_kills_bedwars === undefined ? 0 : Player.stats.Bedwars.four_three_kills_bedwars - Daily.Bedwars.threes.kills
                                        var Bedwars_threes_deaths = Player.stats.Bedwars.four_three_deaths_bedwars === undefined ? 0 : Player.stats.Bedwars.four_three_deaths_bedwars - Daily.Bedwars.threes.deaths
                                        var Bedwars_threes_finalKills = Player.stats.Bedwars.four_three_final_kills_bedwars === undefined ? 0 : Player.stats.Bedwars.four_three_final_kills_bedwars - Daily.Bedwars.threes.finalKills
                                        var Bedwars_threes_finalDeaths = Player.stats.Bedwars.four_three_final_deaths_bedwars === undefined ? 0 : Player.stats.Bedwars.four_three_final_deaths_bedwars - Daily.Bedwars.threes.finalDeaths
                                        var Bedwars_threes_bedsBroken = Player.stats.Bedwars.four_three_beds_broken_bedwars === undefined ? 0 : Player.stats.Bedwars.four_three_beds_broken_bedwars - Daily.Bedwars.threes.bedsBroken
                                        var Bedwars_threes_bedsLost = Player.stats.Bedwars.four_three_beds_lost_bedwars === undefined ? 0 : Player.stats.Bedwars.four_three_beds_lost_bedwars - Daily.Bedwars.threes.bedsLost
                                        if (Bedwars_threes_wins == '0') {
                                            var Bedwars_threes_wlr = '0'
                                        }
                                        else if (Bedwars_threes_losses == '0') {
                                            var Bedwars_threes_wlr = Bedwars_threes_wins
                                        }
                                        else {
                                            var Bedwars_threes_wlr = (Bedwars_threes_wins / Bedwars_threes_losses).toFixed(2)
                                        }
                                        if (Bedwars_threes_kills == '0') {
                                            var Bedwars_threes_kdr = '0'
                                        }
                                        else if (Bedwars_threes_deaths == '0') {
                                            var Bedwars_threes_kdr = Bedwars_threes_kills
                                        }
                                        else {
                                            var Bedwars_threes_kdr = (Bedwars_threes_kills / Bedwars_threes_deaths).toFixed(2)
                                        }
                                        if (Bedwars_threes_finalKills == '0') {
                                            var Bedwars_threes_fkdr = '0'
                                        }
                                        else if (Bedwars_threes_finalDeaths == '0') {
                                            var Bedwars_threes_fkdr = Bedwars_threes_finalKills
                                        }
                                        else {
                                            var Bedwars_threes_fkdr = (Bedwars_threes_finalKills / Bedwars_threes_finalDeaths).toFixed(2)
                                        }
                                        if (Bedwars_threes_bedsBroken == '0') {
                                            var Bedwars_threes_bblr = '0'
                                        }
                                        else if (Bedwars_threes_bedsLost == '0') {
                                            var Bedwars_threes_bblr = Bedwars_threes_bedsBroken
                                        }
                                        else {
                                            var Bedwars_threes_bblr = (Bedwars_threes_bedsBroken / Bedwars_threes_bedsLost).toFixed(2)
                                        }
                                        this.send(`/gc Daily stats for ${PlayerName} in ${mode}: Wins: ${Bedwars_threes_wins} WLR: ${Bedwars_threes_wlr} FKDR: ${Bedwars_threes_fkdr} BLR: ${Bedwars_threes_bblr} Finals: ${Bedwars_threes_finalKills} Beds: ${Bedwars_threes_bedsBroken}`)
                                    }
                                    else if (mode == 'fours') {
                                        var Bedwars_fours_wins = Player.stats.Bedwars.four_four_wins_bedwars === undefined ? 0 : Player.stats.Bedwars.four_four_wins_bedwars - Daily.Bedwars.fours.wins
                                        var Bedwars_fours_losses = Player.stats.Bedwars.four_four_losses_bedwars === undefined ? 0 : Player.stats.Bedwars.four_four_losses_bedwars - Daily.Bedwars.fours.losses
                                        var Bedwars_fours_kills = Player.stats.Bedwars.four_four_kills_bedwars === undefined ? 0 : Player.stats.Bedwars.four_four_kills_bedwars - Daily.Bedwars.fours.kills
                                        var Bedwars_fours_deaths = Player.stats.Bedwars.four_four_deaths_bedwars === undefined ? 0 : Player.stats.Bedwars.four_four_deaths_bedwars - Daily.Bedwars.fours.deaths
                                        var Bedwars_fours_finalKills = Player.stats.Bedwars.four_four_final_kills_bedwars === undefined ? 0 : Player.stats.Bedwars.four_four_final_kills_bedwars - Daily.Bedwars.fours.finalKills
                                        var Bedwars_fours_finalDeaths = Player.stats.Bedwars.four_four_final_deaths_bedwars === undefined ? 0 : Player.stats.Bedwars.four_four_final_deaths_bedwars - Daily.Bedwars.fours.finalDeaths
                                        var Bedwars_fours_bedsBroken = Player.stats.Bedwars.four_four_beds_broken_bedwars === undefined ? 0 : Player.stats.Bedwars.four_four_beds_broken_bedwars - Daily.Bedwars.fours.bedsBroken
                                        var Bedwars_fours_bedsLost = Player.stats.Bedwars.four_four_beds_lost_bedwars === undefined ? 0 : Player.stats.Bedwars.four_four_beds_lost_bedwars - Daily.Bedwars.fours.bedsLost
                                        if (Bedwars_fours_wins == '0') {
                                            var Bedwars_fours_wlr = '0'
                                        }
                                        else if (Bedwars_fours_losses == '0') {
                                            var Bedwars_fours_wlr = Bedwars_fours_wins
                                        }
                                        else {
                                            var Bedwars_fours_wlr = (Bedwars_fours_wins / Bedwars_fours_losses).toFixed(2)
                                        }
                                        if (Bedwars_fours_kills == '0') {
                                            var Bedwars_fours_kdr = '0'
                                        }
                                        else if (Bedwars_fours_deaths == '0') {
                                            var Bedwars_fours_kdr = Bedwars_fours_kills
                                        }
                                        else {
                                            var Bedwars_ours_kdr = (Bedwars_fours_kills / Bedwars_fours_deaths).toFixed(2)
                                        }
                                        if (Bedwars_fours_finalKills == '0') {
                                            var Bedwars_fours_fkdr = '0'
                                        }
                                        else if (Bedwars_fours_finalDeaths == '0') {
                                            var Bedwars_fours_fkdr = Bedwars_fours_finalKills
                                        }
                                        else {
                                            var Bedwars_fours_fkdr = (Bedwars_fours_finalKills / Bedwars_fours_finalDeaths).toFixed(2)
                                        }
                                        if (Bedwars_fours_bedsBroken == '0') {
                                            var Bedwars_fours_bblr = '0'
                                        }
                                        else if (Bedwars_fours_bedsLost == '0') {
                                            var Bedwars_fours_bblr = Bedwars_fours_bedsBroken
                                        }
                                        else {
                                            var Bedwars_fours_bblr = (Bedwars_fours_bedsBroken / Bedwars_fours_bedsLost).toFixed(2)
                                        }
                                        this.send(`/gc Daily stats for ${PlayerName} in ${mode}: Wins: ${Bedwars_fours_wins} WLR: ${Bedwars_fours_wins} FKDR: ${Bedwars_fours_fkdr} BLR: ${Bedwars_fours_bblr} Finals: ${Bedwars_fours_finalKills} Beds: ${Bedwars_fours_bedsBroken}`)
                                    }
                                    else if (mode == '4v4') {
                                        var Bedwars_four_two_wins = Player.stats.Bedwars.two_four_wins_bedwars === undefined ? 0 : Player.stats.Bedwars.two_four_wins_bedwars - Daily.Bedwars.four_two.wins
                                        var Bedwars_four_two_losses = Player.stats.Bedwars.two_four_losses_bedwars === undefined ? 0 : Player.stats.Bedwars.two_four_losses_bedwars - Daily.Bedwars.four_two.losses
                                        var Bedwars_four_two_kills = Player.stats.Bedwars.two_four_kills_bedwars === undefined ? 0 : Player.stats.Bedwars.two_four_kills_bedwars - Daily.Bedwars.four_two.kills
                                        var Bedwars_four_two_deaths = Player.stats.Bedwars.two_four_deaths_bedwars === undefined ? 0 : Player.stats.Bedwars.two_four_deaths_bedwars - Daily.Bedwars.four_two.deaths
                                        var Bedwars_four_two_finalKills = Player.stats.Bedwars.two_four_final_kills_bedwars === undefined ? 0 : Player.stats.Bedwars.two_four_final_kills_bedwars - Daily.Bedwars.four_two.finalKills
                                        var Bedwars_four_two_finalDeaths = Player.stats.Bedwars.two_four_final_deaths_bedwars === undefined ? 0 : Player.stats.Bedwars.two_four_final_deaths_bedwars - Daily.Bedwars.four_two.finalDeaths
                                        var Bedwars_four_two_bedsBroken = Player.stats.Bedwars.two_four_beds_broken_bedwars === undefined ? 0 : Player.stats.Bedwars.two_four_beds_broken_bedwars - Daily.Bedwars.four_two.bedsBroken
                                        var Bedwars_four_two_bedsLost = Player.stats.Bedwars.two_four_beds_lost_bedwars === undefined ? 0 : Player.stats.Bedwars.two_four_beds_lost_bedwars - Daily.Bedwars.four_two.bedsLost
                                        if (Bedwars_four_two_wins == '0') {
                                            var Bedwars_four_two_wlr = '0'
                                        }
                                        else if (Bedwars_four_two_losses == '0') {
                                            var Bedwars_four_two_wlr = Bedwars_four_two_wins
                                        }
                                        else {
                                            var Bedwars_four_two_wlr = (Bedwars_four_two_wins / Bedwars_four_two_losses).toFixed(2)
                                        }
                                        if (Bedwars_four_two_kills == '0') {
                                            var Bedwars_four_two_kdr = '0'
                                        }
                                        else if (Bedwars_four_two_deaths == '0') {
                                            var Bedwars_four_two_kdr = Bedwars_four_two_kills
                                        }
                                        else {
                                            var Bedwars_four_two_kdr = (Bedwars_four_two_kills / Bedwars_four_two_deaths).toFixed(2)
                                        }
                                        if (Bedwars_four_two_finalKills == '0') {
                                            var Bedwars_four_two_fkdr = '0'
                                        }
                                        else if (Bedwars_four_two_finalDeaths == '0') {
                                            var Bedwars_four_two_fkdr = Bedwars_four_two_finalKills
                                        }
                                        else {
                                            var Bedwars_four_two_fkdr = (Bedwars_four_two_finalKills / Bedwars_four_two_finalDeaths).toFixed(2)
                                        }
                                        if (Bedwars_four_two_bedsBroken == '0') {
                                            var Bedwars_four_two_bblr = '0'
                                        }
                                        else if (Bedwars_four_two_bedsLost == '0') {
                                            var Bedwars_four_two_bblr = Bedwars_four_two_bedsBroken
                                        }
                                        else {
                                            var Bedwars_four_two_bblr = (Bedwars_four_two_bedsBroken / Bedwars_four_two_bedsLost).toFixed(2)
                                        }
                                        this.send(`/gc Daily stats for ${PlayerName} in ${mode}: Wins: ${Bedwars_four_two_wins} WRL: ${Bedwars_four_two_wlr} FKDR: ${Bedwars_four_two_fkdr} BLR: ${Bedwars_four_two_bblr} Finals: ${Bedwars_four_two_finalKills} Beds: ${Bedwars_four_two_bedsBroken}`)
                                    }
                                    else if (mode == 'overall' || mode == undefined) {
                                        var bedwars_wins = Player.stats.Bedwars.wins_bedwars === undefined ? 0 : Player.stats.Bedwars.wins_bedwars - Daily.Bedwars.overall.wins
                                        var bedwars_losses = Player.stats.Bedwars.losses_bedwars === undefined ? 0 : Player.stats.Bedwars.losses_bedwars - Daily.Bedwars.overall.losses
                                        var bedwars_kills = Player.stats.Bedwars.kills_bedwars === undefined ? 0 : Player.stats.Bedwars.kills_bedwars - Daily.Bedwars.overall.kills
                                        var bedwars_deaths = Player.stats.Bedwars.deaths_bedwars === undefined ? 0 : Player.stats.Bedwars.deaths_bedwars - Daily.Bedwars.overall.deaths
                                        var bedwars_finalKills = Player.stats.Bedwars.final_kills_bedwars === undefined ? 0 : Player.stats.Bedwars.final_kills_bedwars - Daily.Bedwars.overall.finalKills
                                        var bedwars_finalDeaths = Player.stats.Bedwars.final_deaths_bedwars === undefined ? 0 : Player.stats.Bedwars.final_deaths_bedwars - Daily.Bedwars.overall.finalDeaths
                                        var bedwars_bedsBroken = Player.stats.Bedwars.beds_broken_bedwars === undefined ? 0 : Player.stats.Bedwars.beds_broken_bedwars - Daily.Bedwars.overall.bedsBroken
                                        var bedwars_bedsLost = Player.stats.Bedwars.beds_lost_bedwars === undefined ? 0 : Player.stats.Bedwars.beds_lost_bedwars - Daily.Bedwars.overall.bedsLost
                                        if (bedwars_wins == '0') {
                                            var bedwars_wlr = '0'
                                        }
                                        else if (bedwars_losses == '0') {
                                            var bedwars_wlr = bedwars_wins
                                        }
                                        else {
                                            var bedwars_wlr = (bedwars_wins / bedwars_losses).toFixed(2)
                                        }
                                        if (bedwars_kills == '0') {
                                            var bedwars_kdr = '0'
                                        }
                                        else if (bedwars_deaths == '0') {
                                            var bedwars_kdr = bedwars_kills
                                        }
                                        else {
                                            var bedwars_kdr = (bedwars_kills / bedwars_deaths).toFixed(2)
                                        }
                                        if (bedwars_finalKills == '0') {
                                            var bedwars_fkdr = '0'
                                        }
                                        else if (bedwars_finalDeaths == '0') {
                                            var bedwars_fkdr = bedwars_finalKills
                                        }
                                        else {
                                            var bedwars_fkdr = (bedwars_finalKills / bedwars_finalDeaths).toFixed(2)
                                        }
                                        if (bedwars_bedsBroken == '0') {
                                            var bedwars_bblr = '0'
                                        }
                                        else if (bedwars_bedsLost == '0') {
                                            var bedwars_bblr = bedwars_bedsBroken
                                        }
                                        else {
                                            var bedwars_bblr = (bedwars_bedsBroken / bedwars_bedsLost).toFixed(2)
                                        }
                                        this.send(`/gc Daily stats for ${PlayerName}: Wins: ${bedwars_wins} WLR: ${bedwars_wlr} FKDR: ${bedwars_fkdr} BLR: ${bedwars_bblr} Finals: ${bedwars_finalKills} Beds: ${bedwars_bedsBroken}`)
                                    }

                                }).catch(err => {
                                    console.log(err) //Hypixel API Error
                                })

                            }).catch(err => {
                                console.log(err) //Currently will never throw an error but in the future this will throw an error as the auto register from checking stats will be deprecated
                            })

                        })

                    })
                }).catch(err => {
                    console.log(err) //Mojang API Error
                })

            })


        } catch (error) {
            console.log(error)
            this.send('/gc Something went wrong..')
        }
    }
}

module.exports = dailyCommand


