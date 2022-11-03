const minecraftCommand = require('../../contracts/MinecraftCommand.js')
const config = require('../../../config.json')
const fetch = (...args) => import('node-fetch').then(({
    default: fetch
}) => fetch(...args)).catch(err => console.log(err));

class WeeklyCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'weekly'
        this.aliases = ['']
        this.description = 'Shows ur weekly stats'
    }

    async onCommand(username, message) {
        try {
            const ign = message.split(' ')[1]
            const mode = message.split(' ')[2]
            // Pixelic-API Docs
            // https://app.swaggerhub.com/apis-docs/Pixelicc/Pixelic-API/0.0.2#/
            fetch(`https://api.ashcon.app/mojang/v2/user/${ign}`).then((res) => {
                res.json().then((uuid) => {
                    const UUID = (uuid.uuid) // Swapped Mojang API to Ashcon API (Its a lot faster and u wont get ratelimited anymore)
                    fetch(`https://api.pixelic.de/v1/player/daily?uuid=${UUID}`).then((res) => {
                        res.json().then((daily) => { // For Weekly/Monthly just replace ".../daily?uuid=..." with ".../weekly?uuid=..." or ".../monthly?uuid=..." the rest of the code will still say daily but thats the easiest way and u are fricking lazy
                            fetch(`https://api.hypixel.net/player?uuid=${UUID}&key=${config.api.hypixelAPIkey}`).then((res) => {
                                res.json().then((playerData) => {

                                    const player = playerData.player
                                    const playerName = message.split(' ')[1]

                                    if (mode == 'solo') {
                                        var bedwarsSoloWins = player.stats.Bedwars.eight_one_wins_bedwars === undefined ? 0 : player.stats.Bedwars.eight_one_wins_bedwars - daily.Bedwars.solo.wins
                                        var bedwarsSoloLosses = player.stats.Bedwars.eight_one_losses_bedwars === undefined ? 0 : player.stats.Bedwars.eight_one_losses_bedwars - daily.Bedwars.solo.losses
                                        var bedwarsSoloFinalKills = player.stats.Bedwars.eight_one_final_kills_bedwars === undefined ? 0 : player.stats.Bedwars.eight_one_final_kills_bedwars - daily.Bedwars.solo.finalKills
                                        var bedwarsSoloFinalDeaths = player.stats.Bedwars.eight_one_final_deaths_bedwars === undefined ? 0 : player.stats.Bedwars.eight_one_final_deaths_bedwars - daily.Bedwars.solo.finalDeaths
                                        var bedwarsSoloBedsBroken = player.stats.Bedwars.eight_one_beds_broken_bedwars === undefined ? 0 : player.stats.Bedwars.eight_one_beds_broken_bedwars - daily.Bedwars.solo.bedsBroken
                                        var bedwarsSoloBedsLost = player.stats.Bedwars.eight_one_beds_lost_bedwars === undefined ? 0 : player.stats.Bedwars.eight_one_beds_lost_bedwars - daily.Bedwars.solo.bedsLost
                                        if (bedwarsSoloWins == '0') {
                                            var bedwarsSoloWLR1 = '0'
                                        }
                                        else if (bedwarsSoloLosses == '0') {
                                            var bedwarsSoloWLR2 = bedwarsSoloWins
                                        }
                                        else {
                                            var bedwarsSoloWLR3 = (bedwarsSoloWins / bedwarsSoloLosses).toFixed(2)
                                        }
                                        if (bedwarsSoloFinalKills == '0') {
                                            var bedwarsSoloFKDR1 = '0'
                                        }
                                        else if (bedwarsSoloFinalDeaths == '0') {
                                            var bedwarsSoloFKDR2 = bedwarsSoloFinalKills
                                        }
                                        else {
                                            var bedwarsSoloFKDR3 = (bedwarsSoloFinalKills / bedwarsSoloFinalDeaths).toFixed(2)
                                        }
                                        if (bedwarsSoloBedsBroken == '0') {
                                            var bedwarsSoloBBLR1 = '0'
                                        }
                                        else if (bedwarsSoloBedsLost == '0') {
                                            var bedwarsSoloBBLR2 = bedwarsSoloBedsBroken
                                        }
                                        else {
                                            var bedwarsSoloBBLR3 = (bedwarsSoloBedsBroken / bedwarsSoloBedsLost).toFixed(2)
                                        }
                                        var bedwarsSoloWLR = bedwarsSoloWLR1 || bedwarsSoloWLR2 || bedwarsSoloWLR3
                                        var bedwarsSoloFKDR = bedwarsSoloFKDR1 || bedwarsSoloFKDR2 || bedwarsSoloFKDR3
                                        var bedwarsSoloBBLR = bedwarsSoloBBLR1 || bedwarsSoloBBLR2 || bedwarsSoloBBLR3

                                        this.send(`/gc Daily stats for ${playerName} in ${mode}: Wins: ${bedwarsSoloWins} WLR: ${bedwarsSoloWLR} FKDR: ${bedwarsSoloFKDR} BLR: ${bedwarsSoloBBLR} Finals: ${bedwarsSoloFinalKills} Beds: ${bedwarsSoloBedsBroken}`)
                                    }
                                    else if (mode == 'doubles') {
                                        var bedwarsDoublesWins = player.stats.Bedwars.eight_two_wins_bedwars === undefined ? 0 : player.stats.Bedwars.eight_two_wins_bedwars - daily.Bedwars.doubles.wins
                                        var bedwarsDoublesLosses = player.stats.Bedwars.eight_two_losses_bedwars === undefined ? 0 : player.stats.Bedwars.eight_two_losses_bedwars - daily.Bedwars.doubles.losses
                                        var bedwarsDoublesFinalKills = player.stats.Bedwars.eight_two_final_kills_bedwars === undefined ? 0 : player.stats.Bedwars.eight_two_final_kills_bedwars - daily.Bedwars.doubles.finalKills
                                        var bedwarsDoublesFinalDeaths = player.stats.Bedwars.eight_two_final_deaths_bedwars === undefined ? 0 : player.stats.Bedwars.eight_two_final_deaths_bedwars - daily.Bedwars.doubles.finalDeaths
                                        var bedwarsDoublesBedsBroken = player.stats.Bedwars.eight_two_beds_broken_bedwars === undefined ? 0 : player.stats.Bedwars.eight_two_beds_broken_bedwars - daily.Bedwars.doubles.bedsBroken
                                        var bedwarsDoublesBedsLost = player.stats.Bedwars.eight_two_beds_lost_bedwars === undefined ? 0 : player.stats.Bedwars.eight_two_beds_lost_bedwars - daily.Bedwars.doubles.bedsLost
                                        if (bedwarsDoublesWins == '0') {
                                            var bedwarsDoublesWLR1 = '0'
                                        }
                                        else if (bedwarsDoublesLosses == '0') {
                                            var bedwarsDoublesWLR2 = bedwarsDoublesWins
                                        }
                                        else {
                                            var bedwarsDoublesWLR3 = (bedwarsDoublesWins / bedwarsDoublesLosses).toFixed(2)
                                        }
                                        if (bedwarsDoublesFinalKills == '0') {
                                            var bedwarsDoublesFKDR1 = '0'
                                        }
                                        else if (bedwarsDoublesFinalDeaths == '0') {
                                            var bedwarsDoublesFKDR2 = bedwarsDoublesFinalKills
                                        }
                                        else {
                                            var bedwarsDoublesFKDR3 = (bedwarsDoublesFinalKills / bedwarsDoublesFinalDeaths).toFixed(2)
                                        }
                                        if (bedwarsDoublesBedsBroken == '0') {
                                            var bedwarsDoublesBBLR1 = '0'
                                        }
                                        else if (bedwarsDoublesBedsLost == '0') {
                                            var bedwarsDoublesBBLR2 = bedwarsDoublesBedsBroken
                                        }
                                        else {
                                            var bedwarsDoublesBBLR3 = (bedwarsDoublesBedsBroken / bedwarsDoublesBedsLost).toFixed(2)
                                        }
                                        var bedwarsDoublesWLR = bedwarsDoublesWLR1 || bedwarsDoublesWLR2 || bedwarsDoublesWLR3
                                        var bedwarsDoublesFKDR = bedwarsDoublesFKDR1 || bedwarsDoublesFKDR2 || bedwarsDoublesFKDR3
                                        var bedwarsDoublesBBLR = bedwarsDoublesBBLR1 || bedwarsDoublesBBLR2 || bedwarsDoublesBBLR3
                                        this.send(`/gc Daily stats for ${playerName} in ${mode}: Wins: ${bedwarsDoublesWins}  WLR: ${bedwarsDoublesWLR} FKDR: ${bedwarsDoublesFKDR} BLR: ${bedwarsDoublesBBLR} Finals: ${bedwarsDoublesFinalKills} Beds: ${bedwarsDoublesBedsBroken}`)
                                    }
                                    else if (mode == 'threes') {
                                        var bedwarsThreesWins = player.stats.Bedwars.four_three_wins_bedwars === undefined ? 0 : player.stats.Bedwars.four_three_wins_bedwars - daily.Bedwars.threes.wins
                                        var bedwarsThreesLosses = player.stats.Bedwars.four_three_losses_bedwars === undefined ? 0 : player.stats.Bedwars.four_three_losses_bedwars - daily.Bedwars.threes.losses
                                        var bedwarsThreesFinalKills = player.stats.Bedwars.four_three_final_kills_bedwars === undefined ? 0 : player.stats.Bedwars.four_three_final_kills_bedwars - daily.Bedwars.threes.finalKills
                                        var bedwarsThreesFinalDeaths = player.stats.Bedwars.four_three_final_deaths_bedwars === undefined ? 0 : player.stats.Bedwars.four_three_final_deaths_bedwars - daily.Bedwars.threes.finalDeaths
                                        var bedwarsThreesBedsBroken = player.stats.Bedwars.four_three_beds_broken_bedwars === undefined ? 0 : player.stats.Bedwars.four_three_beds_broken_bedwars - daily.Bedwars.threes.bedsBroken
                                        var bedwarsThreesBedsLost = player.stats.Bedwars.four_three_beds_lost_bedwars === undefined ? 0 : player.stats.Bedwars.four_three_beds_lost_bedwars - daily.Bedwars.threes.bedsLost
                                        if (bedwarsThreesWins == '0') {
                                            var bedwarsThreesWLR1 = '0'
                                        }
                                        else if (bedwarsThreesLosses == '0') {
                                            var bedwarsThreesWLR2 = bedwarsThreesWins
                                        }
                                        else {
                                            var bedwarsThreesWLR3 = (bedwarsThreesWins / bedwarsThreesLosses).toFixed(2)
                                        }
                                        if (bedwarsThreesFinalKills == '0') {
                                            var bedwarsThreesFKDR1 = '0'
                                        }
                                        else if (bedwarsThreesFinalDeaths == '0') {
                                            var bedwarsThreesFKDR2 = bedwarsThreesFinalKills
                                        }
                                        else {
                                            var bedwarsThreesFKDR3 = (bedwarsThreesFinalKills / bedwarsThreesFinalDeaths).toFixed(2)
                                        }
                                        if (bedwarsThreesBedsBroken == '0') {
                                            var bedwarsThreesBBLR1 = '0'
                                        }
                                        else if (bedwarsThreesBedsLost == '0') {
                                            var bedwarsThreesBBLR2 = bedwarsThreesBedsBroken
                                        }
                                        else {
                                            var bedwarsThreesBBLR3 = (bedwarsThreesBedsBroken / bedwarsThreesBedsLost).toFixed(2)
                                        }
                                        var bedwarsThreesWLR = bedwarsThreesWLR1 || bedwarsThreesWLR2 || bedwarsThreesWLR3
                                        var bedwarsThreesFKDR = bedwarsThreesFKDR1 || bedwarsThreesFKDR2 || bedwarsThreesFKDR3
                                        var bedwarsThreesBBLR = bedwarsThreesBBLR1 || bedwarsThreesBBLR2 || bedwarsThreesBBLR3
                                        this.send(`/gc Daily stats for ${playerName} in ${mode}: Wins: ${bedwarsThreesWins} WLR: ${bedwarsThreesWLR} FKDR: ${bedwarsThreesFKDR} BLR: ${bedwarsThreesBBLR} Finals: ${bedwarsThreesFinalKills} Beds: ${bedwarsThreesBedsBroken}`)
                                    }
                                    else if (mode == 'fours') {
                                        var bedwarsFoursWins = player.stats.Bedwars.four_four_wins_bedwars === undefined ? 0 : player.stats.Bedwars.four_four_wins_bedwars - daily.Bedwars.fours.wins
                                        var bedwarsFoursLosses = player.stats.Bedwars.four_four_losses_bedwars === undefined ? 0 : player.stats.Bedwars.four_four_losses_bedwars - daily.Bedwars.fours.losses
                                        var bedwarsFoursFinalKills = player.stats.Bedwars.four_four_final_kills_bedwars === undefined ? 0 : player.stats.Bedwars.four_four_final_kills_bedwars - daily.Bedwars.fours.finalKills
                                        var bedwarsFoursFinalDeaths = player.stats.Bedwars.four_four_final_deaths_bedwars === undefined ? 0 : player.stats.Bedwars.four_four_final_deaths_bedwars - daily.Bedwars.fours.finalDeaths
                                        var bedwarsFoursBedsBroken = player.stats.Bedwars.four_four_beds_broken_bedwars === undefined ? 0 : player.stats.Bedwars.four_four_beds_broken_bedwars - daily.Bedwars.fours.bedsBroken
                                        var bedwarsFoursBedsLost = player.stats.Bedwars.four_four_beds_lost_bedwars === undefined ? 0 : player.stats.Bedwars.four_four_beds_lost_bedwars - daily.Bedwars.fours.bedsLost
                                        if (bedwarsFoursWins == '0') {
                                            var bedwarsFoursWLR1 = '0'
                                        }
                                        else if (bedwarsFoursLosses == '0') {
                                            var bedwarsFoursWLR2 = bedwarsFoursWins
                                        }
                                        else {
                                            var bedwarsFoursWLR3 = (bedwarsFoursWins / bedwarsFoursLosses).toFixed(2)
                                        }
                                        if (bedwarsFoursFinalKills == '0') {
                                            var bedwarsFoursFKDR1 = '0'
                                        }
                                        else if (bedwarsFoursFinalDeaths == '0') {
                                            var bedwarsFoursFKDR2 = bedwarsFoursFinalKills
                                        }
                                        else {
                                            var bedwarsFoursFKDR3 = (bedwarsFoursFinalKills / bedwarsFoursFinalDeaths).toFixed(2)
                                        }
                                        if (bedwarsFoursBedsBroken == '0') {
                                            var bedwarsFoursBBLR1 = '0'
                                        }
                                        else if (bedwarsFoursBedsLost == '0') {
                                            var bedwarsFoursBBLR2 = bedwarsFoursBedsBroken
                                        }
                                        else {
                                            var bedwarsFoursBBLR3 = (bedwarsFoursBedsBroken / bedwarsFoursBedsLost).toFixed(2)
                                        }
                                        var bedwarsFoursWLR = bedwarsFoursWLR1 || bedwarsFoursWLR2 || bedwarsFoursWLR3
                                        var bedwarsFoursFKDR = bedwarsFoursFKDR1 || bedwarsFoursFKDR2 || bedwarsFoursFKDR3
                                        var bedwarsFoursBBLR = bedwarsFoursBBLR1 || bedwarsFoursBBLR2 || bedwarsFoursBBLR3
                                        this.send(`/gc Daily stats for ${playerName} in ${mode}: Wins: ${bedwarsFoursWins} WLR: ${bedwarsFoursWLR} FKDR: ${bedwarsFoursFKDR} BLR: ${bedwarsFoursBBLR} Finals: ${bedwarsFoursFinalKills} Beds: ${bedwarsFoursBedsBroken}`)
                                    }
                                    else if (mode == '4v4') {
                                        var bedwarsFourTwoWins = player.stats.Bedwars.two_four_wins_bedwars === undefined ? 0 : player.stats.Bedwars.two_four_wins_bedwars - daily.Bedwars.four_two.wins
                                        var bedwarsFourTwoLosses = player.stats.Bedwars.two_four_losses_bedwars === undefined ? 0 : player.stats.Bedwars.two_four_losses_bedwars - daily.Bedwars.four_two.losses
                                        var bedwarsFourTwoFinalKills = player.stats.Bedwars.two_four_final_kills_bedwars === undefined ? 0 : player.stats.Bedwars.two_four_final_kills_bedwars - daily.Bedwars.four_two.finalKills
                                        var bedwarsFourTwoFinalDeaths = player.stats.Bedwars.two_four_final_deaths_bedwars === undefined ? 0 : player.stats.Bedwars.two_four_final_deaths_bedwars - daily.Bedwars.four_two.finalDeaths
                                        var bedwarsFourTwoBedsBroken = player.stats.Bedwars.two_four_beds_broken_bedwars === undefined ? 0 : player.stats.Bedwars.two_four_beds_broken_bedwars - daily.Bedwars.four_two.bedsBroken
                                        var bedwarsFourTwoBedsLost = player.stats.Bedwars.two_four_beds_lost_bedwars === undefined ? 0 : player.stats.Bedwars.two_four_beds_lost_bedwars - daily.Bedwars.four_two.bedsLost
                                        if (bedwarsFourTwoWins == '0') {
                                            var bedwarsFourTwoWLR1 = '0'
                                        }
                                        else if (bedwarsFourTwoLosses == '0') {
                                            var bedwarsFourTwoWLR2 = bedwarsFourTwoWins
                                        }
                                        else {
                                            var bedwarsFourTwoWLR3 = (bedwarsFourTwoWins / bedwarsFourTwoLosses).toFixed(2)
                                        }
                                        if (bedwarsFourTwoFinalKills == '0') {
                                            var bedwarsFourTwoFKDR1 = '0'
                                        }
                                        else if (bedwarsFourTwoFinalDeaths == '0') {
                                            var bedwarsFourTwoFKDR2 = bedwarsFourTwoFinalKills
                                        }
                                        else {
                                            var bedwarsFourTwoFKDR3 = (bedwarsFourTwoFinalKills / bedwarsFourTwoFinalDeaths).toFixed(2)
                                        }
                                        if (bedwarsFourTwoBedsBroken == '0') {
                                            var bedwarsFourTwoBBLR1 = '0'
                                        }
                                        else if (bedwarsFourTwoBedsLost == '0') {
                                            var bedwarsFourTwoBBLR2 = bedwarsFourTwoBedsBroken
                                        }
                                        else {
                                            var bedwarsFourTwoBBLR3 = (bedwarsFourTwoBedsBroken / bedwarsFourTwoBedsLost).toFixed(2)
                                        }
                                        var bedwarsFourTwoWLR = bedwarsFourTwoWLR1 || bedwarsFourTwoWLR2 || bedwarsFourTwoWLR3
                                        var bedwarsFourTwoFKDR = bedwarsFourTwoFKDR1 || bedwarsFourTwoFKDR2 || bedwarsFourTwoFKDR3
                                        var bedwarsFourTwoBBLR = bedwarsFourTwoBBLR1 || bedwarsFourTwoBBLR2 || bedwarsFourTwoBBLR3
                                        this.send(`/gc Daily stats for ${playerName} in ${mode}: Wins: ${bedwarsFourTwoWins} WRL: ${bedwarsFourTwoWLR} FKDR: ${bedwarsFourTwoFKDR} BLR: ${bedwarsFourTwoBBLR} Finals: ${bedwarsFourTwoFinalKills} Beds: ${bedwarsFourTwoBedsBroken}`)
                                    }
                                    else if (mode == 'overall' || mode == undefined) {
                                        var bedwarsWins = player.stats.Bedwars.wins_bedwars === undefined ? 0 : player.stats.Bedwars.wins_bedwars - daily.Bedwars.overall.wins
                                        var bedwarsLosses = player.stats.Bedwars.losses_bedwars === undefined ? 0 : player.stats.Bedwars.losses_bedwars - daily.Bedwars.overall.losses
                                        var bedwarsFinalKills = player.stats.Bedwars.final_kills_bedwars === undefined ? 0 : player.stats.Bedwars.final_kills_bedwars - daily.Bedwars.overall.finalKills
                                        var bedwarsFinalDeaths = player.stats.Bedwars.final_deaths_bedwars === undefined ? 0 : player.stats.Bedwars.final_deaths_bedwars - daily.Bedwars.overall.finalDeaths
                                        var bedwarsBedsBroken = player.stats.Bedwars.beds_broken_bedwars === undefined ? 0 : player.stats.Bedwars.beds_broken_bedwars - daily.Bedwars.overall.bedsBroken
                                        var bedwarsBedsLost = player.stats.Bedwars.beds_lost_bedwars === undefined ? 0 : player.stats.Bedwars.beds_lost_bedwars - daily.Bedwars.overall.bedsLost
                                        if (bedwarsWins == '0') {
                                            var bedwarsWLR1 = '0'
                                        }
                                        else if (bedwarsLosses == '0') {
                                            var bedwarsWLR2 = bedwarsWins
                                        }
                                        else {
                                            var bedwarsWLR3 = (bedwarsWins / bedwarsLosses).toFixed(2)
                                        }
                                        if (bedwarsFinalKills == '0') {
                                            var bedwarsFKDR1 = '0'
                                        }
                                        else if (bedwarsFinalDeaths == '0') {
                                            var bedwarsFKDR2 = bedwarsFinalKills
                                        }
                                        else {
                                            var bedwarsFKDR3 = (bedwarsFinalKills / bedwarsFinalDeaths).toFixed(2)
                                        }
                                        if (bedwarsBedsBroken == '0') {
                                            var bedwarsBBLR1 = '0'
                                        }
                                        else if (bedwarsBedsLost == '0') {
                                            var bedwarsBBLR2 = bedwarsBedsBroken
                                        }
                                        else {
                                            var bedwarsBBLR3 = (bedwarsBedsBroken / bedwarsBedsLost).toFixed(2)
                                        }
                                        var bedwarsWLR = bedwarsWLR1 || bedwarsWLR2 || bedwarsWLR3
                                        var bedwarsFKDR = bedwarsFKDR1 || bedwarsFKDR2 || bedwarsFKDR3
                                        var bedwarsBBLR = bedwarsBBLR1 || bedwarsBBLR2 || bedwarsBBLR3
                                        this.send(`/gc Daily stats for ${playerName}: Wins: ${bedwarsWins} WLR: ${bedwarsWLR} FKDR: ${bedwarsFKDR} BLR: ${bedwarsBBLR} Finals: ${bedwarsFinalKills} Beds: ${bedwarsBedsBroken}`)
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

module.exports = WeeklyCommand


